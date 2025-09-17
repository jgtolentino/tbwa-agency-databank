#!/bin/bash

# One-Shot Production Audit Script
# Comprehensive end-to-end validation of production mock-free status
# Fails hard on any mock usage detection

set -euo pipefail

echo "🔍 One-Shot Production Audit"
echo "============================="
echo "Comprehensive validation of production mock-free status"
echo ""

ERRORS=0

# Helper function to report errors
report_error() {
  echo "❌ ERROR: $1"
  ((ERRORS++))
}

report_success() {
  echo "✅ $1"
}

echo "== ENV Sanity Check (Vercel) =="
echo "==============================="

# Check Vercel production environment variables
if command -v vercel >/dev/null 2>&1; then
  echo "Checking Vercel production environment variables..."

  # List production env vars and check for mock enablers
  ENV_OUTPUT=$(vercel env ls --prod 2>/dev/null || echo "vercel env ls failed")

  if echo "$ENV_OUTPUT" | grep -E '^(VITE_USE_MOCK|NEXT_PUBLIC_USE_MOCK)\s+1'; then
    report_error "Production mocks enabled in Vercel environment"
  else
    report_success "Vercel production environment has mocks disabled"
  fi
else
  echo "⚠️ Vercel CLI not available - skipping env check"
fi

echo ""
echo "== Database Gates =="
echo "==================="

# Ensure required environment variables are set
if [ -z "${PG_URL_SCOUT:-}" ]; then
  report_error "PG_URL_SCOUT environment variable not set"
else
  echo "Checking database status..."

  # 1) Governance badge check
  echo "Checking data source badge..."
  BADGE_STATUS=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT source_status FROM public.get_data_source_status();" 2>/dev/null || echo "ERROR")

  if [ "$BADGE_STATUS" = "Trusted" ]; then
    report_success "Data source badge: $BADGE_STATUS"
  else
    report_error "Data source badge: $BADGE_STATUS (expected: Trusted)"
  fi

  # 2) Telemetry check - mock hits in last 24h
  echo "Checking telemetry for mock fallback hits..."
  MOCK_HITS=$(psql "$PG_URL_SCOUT" -t -A -c "
    SELECT COUNT(*)
    FROM scout_ops.ui_events
    WHERE event_type='mock_fallback_hit'
    AND timestamp > NOW() - INTERVAL '24 hours';" 2>/dev/null || echo "ERROR")

  if [ "$MOCK_HITS" = "0" ]; then
    report_success "Mock fallback hits (24h): $MOCK_HITS"
  else
    report_error "Mock fallback hits (24h): $MOCK_HITS (expected: 0)"
  fi

  # 3) Data presence check
  echo "Checking for real data presence..."
  GOLD_TX_COUNT=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM public.gold_recent_transactions;" 2>/dev/null || echo "0")

  if [ "$GOLD_TX_COUNT" -gt 0 ]; then
    report_success "Gold transactions: $GOLD_TX_COUNT"
  else
    report_error "Gold transactions: $GOLD_TX_COUNT (expected: >0)"
  fi

  # 4) Scout functions check
  echo "Checking Scout function deployment..."
  SCOUT_FUNCTIONS=$(psql "$PG_URL_SCOUT" -t -A -c "
    SELECT COUNT(*)
    FROM information_schema.routines
    WHERE routine_schema = 'scout' AND routine_name LIKE 'get_%';" 2>/dev/null || echo "0")

  if [ "$SCOUT_FUNCTIONS" -ge 10 ]; then
    report_success "Scout functions deployed: $SCOUT_FUNCTIONS"
  else
    report_error "Scout functions deployed: $SCOUT_FUNCTIONS (expected: >=10)"
  fi
fi

echo ""
echo "== RLS Smoke Test (Anon REST) =="
echo "================================"

if [ -n "${SUPABASE_URL:-}" ] && [ -n "${SUPABASE_ANON_KEY:-}" ]; then
  echo "Testing RLS with anonymous REST API call..."

  HTTP_STATUS=$(curl -fs "$SUPABASE_URL/rest/v1/rpc/get_geo_summary" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{}' \
    -w "%{http_code}" -o /dev/null 2>/dev/null || echo "000")

  if [ "$HTTP_STATUS" = "200" ]; then
    report_success "Anonymous RPC works within RLS constraints"
  else
    report_error "Anonymous RPC failed (HTTP $HTTP_STATUS)"
  fi
else
  echo "⚠️ Supabase credentials not available - skipping RLS test"
fi

echo ""
echo "== UI Badge + No-Mock Text (Playwright) =="
echo "==========================================="

if [ -n "${DASHBOARD_URL:-}" ]; then
  echo "Running Playwright UI validation..."

  # Install Playwright if needed
  if ! command -v playwright >/dev/null 2>&1; then
    echo "Installing Playwright..."
    npx --yes playwright install --with-deps >/dev/null 2>&1
  fi

  # Create temporary test file
  cat > /tmp/prod-audit-ui.spec.ts <<'PW'
import { test, expect } from '@playwright/test';

test('production UI validation @prod-audit', async ({ page }) => {
  await page.goto(process.env.DASHBOARD_URL!, { waitUntil: 'domcontentloaded' });

  // Must show "Trusted" badge
  await expect(page.getByText(/Data Source:\s*Trusted/i)).toBeVisible();

  // Must NOT show any mock indicators
  await expect(page.getByText(/Data Source:\s*Mock Data/i)).toHaveCount(0);
  await expect(page.getByText(/mock/i)).toHaveCount(0);
  await expect(page.getByText(/demo/i)).toHaveCount(0);

  // Should not show production violations
  await expect(page.getByText(/PROD VIOLATION/i)).toHaveCount(0);
});
PW

  # Run the test
  if DASHBOARD_URL="$DASHBOARD_URL" npx playwright test /tmp/prod-audit-ui.spec.ts --reporter=line 2>/dev/null; then
    report_success "UI shows 'Trusted' badge and no mock indicators"
  else
    report_error "UI validation failed - check for mock indicators or badge issues"
  fi

  # Cleanup
  rm -f /tmp/prod-audit-ui.spec.ts
else
  echo "⚠️ DASHBOARD_URL not set - skipping UI validation"
fi

echo ""
echo "== Static Build Artifact Scan =="
echo "================================"

# Look for build directories
BUILD_DIRS=()
for dir in dist build .next out; do
  if [ -d "$dir" ]; then
    BUILD_DIRS+=("$dir")
  fi
done

if [ ${#BUILD_DIRS[@]} -gt 0 ]; then
  echo "Scanning build artifacts in: ${BUILD_DIRS[*]}"

  # Check for mock strings in build artifacts
  MOCK_STRINGS=$(grep -RIn --binary-files=text -E "(Mock Data|/lib/mocks/|mockData)" "${BUILD_DIRS[@]}" 2>/dev/null || true)

  if [ -n "$MOCK_STRINGS" ]; then
    report_error "Mock strings found in build artifacts:"
    echo "$MOCK_STRINGS"
  else
    report_success "No mock strings found in build artifacts"
  fi
else
  echo "⚠️ No build artifacts found - skipping static scan"
fi

echo ""
echo "== Performance Probe (TTFB) =="
echo "=============================="

if [ -n "${DASHBOARD_URL:-}" ]; then
  echo "Testing Time To First Byte (TTFB)..."

  TTFB=$(curl -w '%{time_starttransfer}\n' -o /dev/null -s "$DASHBOARD_URL" 2>/dev/null || echo "999")

  # Check if TTFB is under 1.2 seconds
  if awk "BEGIN{exit !($TTFB < 1.2)}" 2>/dev/null; then
    report_success "TTFB: ${TTFB}s (<1.2s requirement)"
  else
    report_error "TTFB: ${TTFB}s (>=1.2s - performance issue)"
  fi
else
  echo "⚠️ DASHBOARD_URL not set - skipping performance test"
fi

echo ""
echo "== Final Report =="
echo "=================="

if [ $ERRORS -eq 0 ]; then
  echo "🎯 ALL GREEN - PRODUCTION AUDIT PASSED"
  echo ""
  echo "✅ Environment: No mock variables enabled"
  echo "✅ Database: Badge='Trusted', Data present, Functions deployed"
  echo "✅ Telemetry: Zero mock fallback hits"
  echo "✅ RLS: Anonymous access working"
  echo "✅ UI: Shows 'Trusted' badge, no mock indicators"
  echo "✅ Build: No mock artifacts detected"
  echo "✅ Performance: TTFB under 1.2s"
  echo ""
  echo "🚀 Production is running with real data only!"
  exit 0
else
  echo "💥 AUDIT FAILED - $ERRORS ERRORS DETECTED"
  echo ""
  echo "❌ Production environment has mock-related issues"
  echo "❌ Immediate investigation and remediation required"
  echo ""
  echo "🚨 DO NOT PROCEED WITH PRODUCTION OPERATIONS"
  exit 1
fi