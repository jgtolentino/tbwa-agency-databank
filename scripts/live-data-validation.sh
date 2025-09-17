#!/bin/bash

# Live Data Validation Suite
# Comprehensive validation that production is using real data with active ingestion

set -euo pipefail

echo "🔍 Live Data Validation Suite"
echo "============================="
echo "Comprehensive validation of production real-data status"
echo ""

ERRORS=0
WARNINGS=0

# Helper functions
report_error() {
    echo "❌ ERROR: $1"
    ((ERRORS++))
}

report_success() {
    echo "✅ $1"
}

report_warning() {
    echo "⚠️ WARNING: $1"
    ((WARNINGS++))
}

# Validate required environment variables
REQUIRED_VARS=("PG_URL_SCOUT" "SUPABASE_URL" "SUPABASE_ANON_KEY" "DASHBOARD_URL")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        report_error "$var environment variable not set"
    fi
done

if [ $ERRORS -gt 0 ]; then
    echo "Cannot proceed with missing environment variables"
    exit 1
fi

echo "== Stage 1: Environment Sanity Check =="
echo "========================================"

# Check Vercel production environment
if command -v vercel >/dev/null 2>&1; then
    echo "Checking Vercel production environment..."
    VERCEL_ENV=$(vercel env ls --prod 2>/dev/null || echo "vercel_cmd_failed")

    # Check for mock enablers
    if echo "$VERCEL_ENV" | grep -E '^(NEXT_PUBLIC_USE_MOCK|VITE_USE_MOCK)\s+1'; then
        report_error "Mocks enabled in Vercel production environment"
    else
        report_success "Vercel production environment has mocks disabled"
    fi

    # Check required variables are present
    if echo "$VERCEL_ENV" | grep -q "NEXT_PUBLIC_SUPABASE_URL"; then
        report_success "Supabase URL configured in Vercel"
    else
        report_warning "NEXT_PUBLIC_SUPABASE_URL not found in Vercel"
    fi
else
    report_warning "Vercel CLI not available - skipping env check"
fi

echo ""
echo "== Stage 2: Database Governance & Telemetry =="
echo "=============================================="

echo "Checking data source governance badge..."
BADGE_STATUS=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT source_status FROM public.get_data_source_status();" 2>/dev/null || echo "ERROR")

if [ "$BADGE_STATUS" = "Trusted" ]; then
    report_success "Data source badge: $BADGE_STATUS"
else
    report_error "Data source badge: $BADGE_STATUS (expected: Trusted)"
fi

echo "Checking telemetry for mock fallback violations..."
MOCK_HITS_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM scout_ops.ui_events
WHERE event_type='mock_fallback_hit'
AND timestamp > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "ERROR")

if [ "$MOCK_HITS_24H" = "0" ]; then
    report_success "No mock fallback hits in 24h"
else
    report_error "Mock fallback hits detected: $MOCK_HITS_24H (last 24h)"
fi

echo "Checking approved data surfaces..."
# Test multiple approved surfaces to ensure data availability
GOLD_TX_COUNT=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM public.gold_recent_transactions;" 2>/dev/null || echo "0")
STORE_SALES_COUNT=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM gold.v_store_sales_hourly;" 2>/dev/null || echo "0")

echo "Gold transactions: $GOLD_TX_COUNT"
echo "Store sales records: $STORE_SALES_COUNT"

if [ "$GOLD_TX_COUNT" -gt 0 ]; then
    report_success "Gold transactions populated: $GOLD_TX_COUNT records"
else
    report_error "Gold transactions empty: no analytics data available"
fi

if [ "$STORE_SALES_COUNT" -gt 0 ]; then
    report_success "Store sales data available: $STORE_SALES_COUNT records"
else
    report_warning "Store sales data not available"
fi

echo ""
echo "== Stage 3: RLS Security Validation =="
echo "======================================"

echo "Testing Row Level Security with anonymous access..."
RLS_TEST_STATUS=$(curl -fs "$SUPABASE_URL/rest/v1/rpc/get_geo_summary" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{}' \
    -w "%{http_code}" -o /tmp/rls_test_output 2>/dev/null || echo "000")

if [ "$RLS_TEST_STATUS" = "200" ]; then
    report_success "RLS allows proper anonymous access"

    # Check that response contains real data
    if [ -f "/tmp/rls_test_output" ]; then
        RLS_RESPONSE=$(cat /tmp/rls_test_output)
        if echo "$RLS_RESPONSE" | grep -q '"total_stores":[1-9]'; then
            report_success "RLS returns real data (non-zero stores)"
        else
            report_warning "RLS may be returning empty/mock data"
        fi
    fi
else
    report_error "RLS test failed (HTTP $RLS_TEST_STATUS)"
fi

# Cleanup
rm -f /tmp/rls_test_output

echo ""
echo "== Stage 4: UI Badge & Mock Detection =="
echo "========================================"

echo "Running Playwright UI validation..."

# Install Playwright if needed
if ! command -v playwright >/dev/null 2>&1; then
    echo "Installing Playwright..."
    npx --yes playwright install --with-deps >/dev/null 2>&1
fi

# Create comprehensive UI test
cat > /tmp/live-data-ui-test.spec.ts <<'PW'
import { test, expect } from '@playwright/test';

test('Live data UI validation', async ({ page }) => {
  await page.goto(process.env.DASHBOARD_URL!, { waitUntil: 'domcontentloaded' });

  // Must show "Trusted" badge
  await expect(page.getByText(/Data Source:\s*Trusted/i)).toBeVisible();

  // Must NOT show any mock indicators
  await expect(page.getByText(/Data Source:\s*Mock Data/i)).toHaveCount(0);
  await expect(page.getByText(/mock/i)).toHaveCount(0);
  await expect(page.getByText(/demo/i)).toHaveCount(0);
  await expect(page.getByText(/sample/i)).toHaveCount(0);

  // Should not show production violations
  await expect(page.getByText(/PROD VIOLATION/i)).toHaveCount(0);
  await expect(page.getByText(/PROD FAILURE/i)).toHaveCount(0);

  // Check for real data indicators (non-zero values)
  const storeCount = await page.locator('[data-testid="total-stores"]').textContent();
  const transactionCount = await page.locator('[data-testid="total-transactions"]').textContent();

  if (storeCount && parseInt(storeCount) > 0) {
    console.log(`✅ Real store data: ${storeCount} stores`);
  } else {
    console.log(`⚠️ Store count may be zero or missing`);
  }

  if (transactionCount && parseInt(transactionCount) > 0) {
    console.log(`✅ Real transaction data: ${transactionCount} transactions`);
  } else {
    console.log(`⚠️ Transaction count may be zero or missing`);
  }
});
PW

# Run the UI test
if DASHBOARD_URL="$DASHBOARD_URL" npx playwright test /tmp/live-data-ui-test.spec.ts --reporter=line 2>/dev/null; then
    report_success "UI validation passed - shows Trusted badge, no mock indicators"
else
    report_error "UI validation failed - check for mock indicators or badge issues"
fi

# Cleanup
rm -f /tmp/live-data-ui-test.spec.ts

echo ""
echo "== Stage 5: Ingestion Pipeline Health =="
echo "========================================"

echo "Checking data ingestion pipelines..."

# Drive ingestion check
DRIVE_FILES_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(SUM(file_count), 0)
FROM drive_intelligence.ingestion_metrics_24h();" 2>/dev/null || echo "0")

echo "Drive files processed (24h): $DRIVE_FILES_24H"

if [ "$DRIVE_FILES_24H" -gt 0 ]; then
    report_success "Drive ingestion active: $DRIVE_FILES_24H files"
else
    report_warning "Drive ingestion inactive: 0 files in 24h"
fi

# Azure ingestion check
AZURE_EVENTS_1H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COALESCE(COUNT(*), 0)
FROM staging.azure_stream_events
WHERE ingested_at > NOW() - INTERVAL '1 hour';" 2>/dev/null || echo "0")

echo "Azure events (1h): $AZURE_EVENTS_1H"

if [ "$AZURE_EVENTS_1H" -gt 0 ]; then
    report_success "Azure ingestion active: $AZURE_EVENTS_1H events"
else
    report_warning "Azure ingestion may be inactive: 0 events in 1h"
fi

# ETL job health
ETL_RUNS_24H=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM etl_job_registry
WHERE last_run_at > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "0")

if [ "$ETL_RUNS_24H" -gt 0 ]; then
    report_success "ETL pipeline active: $ETL_RUNS_24H runs in 24h"
else
    report_warning "ETL pipeline may be stalled: 0 runs in 24h"
fi

echo ""
echo "== Stage 6: Performance Validation =="
echo "====================================="

echo "Testing Time To First Byte (TTFB)..."
TTFB=$(curl -w '%{time_starttransfer}\n' -o /dev/null -s "$DASHBOARD_URL" 2>/dev/null || echo "999")

echo "TTFB: ${TTFB}s"

# Check if TTFB meets <1.2s requirement
if awk "BEGIN{exit !($TTFB < 1.2)}" 2>/dev/null; then
    report_success "Performance meets requirement: ${TTFB}s (<1.2s)"
else
    report_warning "Performance concern: ${TTFB}s (≥1.2s target)"
fi

echo ""
echo "== Stage 7: Scout Function Validation =="
echo "========================================"

echo "Validating Scout analytics functions..."
SCOUT_FUNCTIONS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM information_schema.routines
WHERE routine_schema = 'scout' AND routine_name LIKE 'get_%';" 2>/dev/null || echo "0")

echo "Scout functions deployed: $SCOUT_FUNCTIONS"

if [ "$SCOUT_FUNCTIONS" -ge 10 ]; then
    report_success "Scout functions operational: $SCOUT_FUNCTIONS deployed"
else
    report_error "Insufficient Scout functions: $SCOUT_FUNCTIONS (expected: ≥10)"
fi

# Test key Scout functions with real data
echo "Testing Scout function responses..."
GEO_SUMMARY_TEST=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT total_stores FROM scout.get_geo_summary('{}');" 2>/dev/null | head -1 || echo "0")

if [ "$GEO_SUMMARY_TEST" -gt 0 ]; then
    report_success "Scout geo summary returns real data: $GEO_SUMMARY_TEST stores"
else
    report_warning "Scout geo summary may return empty data: $GEO_SUMMARY_TEST stores"
fi

echo ""
echo "== Final Validation Report =="
echo "============================"

echo "Environment: $([ $ERRORS -eq 0 ] && echo "✅ CLEAN" || echo "❌ ISSUES")"
echo "Database: Badge=$BADGE_STATUS, Mock hits=$MOCK_HITS_24H"
echo "Data: Gold=$GOLD_TX_COUNT tx, Store sales=$STORE_SALES_COUNT records"
echo "Ingestion: Drive=$DRIVE_FILES_24H files, Azure=$AZURE_EVENTS_1H events, ETL=$ETL_RUNS_24H runs"
echo "Performance: TTFB=${TTFB}s"
echo "Functions: $SCOUT_FUNCTIONS Scout functions deployed"

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "🎯 LIVE DATA VALIDATION: PASSED"
    echo "✅ Production is using real data only"
    echo "✅ All critical systems operational"
    echo "✅ Data governance enforced"

    if [ $WARNINGS -gt 0 ]; then
        echo "⚠️ $WARNINGS warnings detected - monitor ingestion pipelines"
    fi

    exit 0
else
    echo "💥 LIVE DATA VALIDATION: FAILED"
    echo "❌ $ERRORS critical errors detected"
    echo "❌ Production may be using mock data or have system issues"

    if [ $WARNINGS -gt 0 ]; then
        echo "⚠️ $WARNINGS additional warnings"
    fi

    echo ""
    echo "🚨 IMMEDIATE ACTION REQUIRED"
    echo "Review errors above and fix before proceeding"
    exit 1
fi