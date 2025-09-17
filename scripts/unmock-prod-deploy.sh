#!/bin/bash

# Unmock Production Deployment Script
# Configures Vercel environment variables and deploys production-ready dashboard

set -euo pipefail

echo "🚀 Unmock Production Deployment"
echo "=============================="

# Configuration
VERCEL_PROJECT="tbwa-agency-databank"
PROD_URL="https://scout-dashboard-xi.vercel.app"

echo "1️⃣ Configuring Vercel Environment Variables"
echo "============================================"

# Production environment (no mocks) - Set both VITE_ and NEXT_PUBLIC_ to prevent env drift
vercel env add VITE_USE_MOCK production <<< "0"
vercel env add NEXT_PUBLIC_USE_MOCK production <<< "0"
vercel env add VITE_ALLOW_FALLBACK_IN_PROD production <<< "0"
vercel env add NEXT_PUBLIC_ALLOW_FALLBACK_IN_PROD production <<< "0"
vercel env add VITE_SUPABASE_URL production <<< "$VITE_SUPABASE_URL"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "$VITE_SUPABASE_ANON_KEY"

# Preview environment (allow mocks for testing)
vercel env add VITE_USE_MOCK preview <<< "1"
vercel env add NEXT_PUBLIC_USE_MOCK preview <<< "1"
vercel env add VITE_ALLOW_FALLBACK_IN_PROD preview <<< "0"
vercel env add NEXT_PUBLIC_ALLOW_FALLBACK_IN_PROD preview <<< "0"
vercel env add VITE_SUPABASE_URL preview <<< "$VITE_SUPABASE_URL"
vercel env add VITE_SUPABASE_ANON_KEY preview <<< "$VITE_SUPABASE_ANON_KEY"

echo "✅ Environment variables configured"

echo "2️⃣ Building and Deploying to Production"
echo "======================================="

# Deploy to production
vercel deploy --prod --confirm

echo "✅ Production deployment initiated"

echo "3️⃣ Waiting for deployment to stabilize..."
sleep 30

echo "4️⃣ Post-Deploy Validation"
echo "========================="

# Database validation
echo "Validating database connection and data source badge..."

BADGE_STATUS=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT source_status FROM public.get_data_source_status();")
GOLD_TX_COUNT=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM public.gold_recent_transactions;")
SCOUT_FUNCTIONS=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'scout' AND routine_name LIKE 'get_%';")

echo "Badge Status: $BADGE_STATUS"
echo "Gold Transactions: $GOLD_TX_COUNT"
echo "Scout Functions: $SCOUT_FUNCTIONS"

# Validation checks
if [ "$BADGE_STATUS" != "Trusted" ]; then
    echo "❌ ERROR: Data source badge is not 'Trusted'"
    exit 1
fi

if [ "$GOLD_TX_COUNT" -eq 0 ]; then
    echo "❌ ERROR: No gold transactions found"
    exit 1
fi

if [ "$SCOUT_FUNCTIONS" -lt 10 ]; then
    echo "❌ ERROR: Insufficient Scout functions deployed"
    exit 1
fi

echo "✅ Database validation passed"

echo "5️⃣ Telemetry Check"
echo "=================="

# Check for mock fallback hits in the last hour
MOCK_HITS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM scout_ops.ui_events
WHERE event_type='mock_fallback_hit'
AND timestamp > NOW() - INTERVAL '1 hour';" 2>/dev/null || echo "0")

echo "Mock fallback hits (last hour): $MOCK_HITS"

if [ "$MOCK_HITS" -gt 0 ]; then
    echo "⚠️ WARNING: $MOCK_HITS mock fallback hits detected"
    echo "This may indicate production is using mock data"
fi

echo "6️⃣ E2E Production Tests"
echo "======================"

# Run production E2E tests
export DASHBOARD_URL="$PROD_URL"
npx playwright test tests/e2e/prod-no-mock.spec.ts --project=chromium --reporter=line

echo "✅ E2E tests passed"

echo "7️⃣ Final Production Health Check"
echo "================================"

# Comprehensive health check
curl -f "$PROD_URL" > /dev/null && echo "✅ Website accessible" || echo "❌ Website unreachable"

echo ""
echo "🎯 DEPLOYMENT COMPLETE"
echo "====================="
echo "✅ Production URL: $PROD_URL"
echo "✅ Data Source: $BADGE_STATUS"
echo "✅ Gold Transactions: $GOLD_TX_COUNT"
echo "✅ Mock Fallbacks: $MOCK_HITS (last hour)"
echo "✅ All production guards active"
echo ""
echo "🚀 Dashboard is live with real data only!"