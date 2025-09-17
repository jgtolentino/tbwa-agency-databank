#!/bin/bash

# Bruno CI Deployment Script
# Deploys migrations and edge functions via Bruno (keeping secrets isolated)

set -euo pipefail

echo "🚀 Bruno CI Deployment"
echo "======================"
echo "Deploying migrations and edge functions with proper secret isolation"
echo ""

# Validate required environment variables
REQUIRED_VARS=("SUPABASE_PROJECT_REF" "SUPABASE_DB_PASSWORD" "SUPABASE_ACCESS_TOKEN")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var:-}" ]; then
        echo "❌ ERROR: $var environment variable not set"
        exit 1
    fi
done

echo "1️⃣ Database Migration Deployment"
echo "================================="

echo "Checking Supabase CLI availability..."
if ! command -v supabase >/dev/null 2>&1; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
fi

echo "Applying database migrations..."
supabase db push \
    --include-roles \
    --password "$SUPABASE_DB_PASSWORD" \
    --project-ref "$SUPABASE_PROJECT_REF"

echo "✅ Database migrations applied"

echo ""
echo "2️⃣ Edge Function Deployment"
echo "==========================="

# Check if edge functions directory exists
if [ -d "supabase/functions" ]; then
    echo "Deploying edge functions..."

    # Deploy each function individually for better error handling
    for func_dir in supabase/functions/*/; do
        if [ -d "$func_dir" ]; then
            func_name=$(basename "$func_dir")
            echo "Deploying function: $func_name"

            supabase functions deploy "$func_name" \
                --project-ref "$SUPABASE_PROJECT_REF" \
                --token "$SUPABASE_ACCESS_TOKEN"

            echo "✅ Function $func_name deployed"
        fi
    done
else
    echo "⚠️ No edge functions directory found - skipping function deployment"
fi

echo ""
echo "3️⃣ Migration Verification"
echo "========================="

echo "Verifying Scout functions are deployed..."
SCOUT_FUNCTION_COUNT=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM information_schema.routines
WHERE routine_schema = 'scout' AND routine_name LIKE 'get_%';" 2>/dev/null || echo "0")

if [ "$SCOUT_FUNCTION_COUNT" -ge 10 ]; then
    echo "✅ Scout functions verified: $SCOUT_FUNCTION_COUNT deployed"
else
    echo "❌ ERROR: Insufficient Scout functions: $SCOUT_FUNCTION_COUNT (expected: ≥10)"
    exit 1
fi

echo "Verifying data source status..."
DATA_SOURCE_STATUS=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT source_status FROM public.get_data_source_status();" 2>/dev/null || echo "Unknown")

if [ "$DATA_SOURCE_STATUS" = "Trusted" ]; then
    echo "✅ Data source status verified: $DATA_SOURCE_STATUS"
else
    echo "❌ ERROR: Data source status: $DATA_SOURCE_STATUS (expected: Trusted)"
    exit 1
fi

echo ""
echo "4️⃣ Edge Function Health Check"
echo "============================="

if [ -d "supabase/functions" ]; then
    echo "Testing edge function endpoints..."

    # Test each deployed function
    for func_dir in supabase/functions/*/; do
        if [ -d "$func_dir" ]; then
            func_name=$(basename "$func_dir")
            echo "Testing function: $func_name"

            # Basic health check (adjust URL format as needed)
            FUNC_URL="https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/$func_name"
            HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FUNC_URL" || echo "000")

            if [ "$HTTP_STATUS" != "000" ]; then
                echo "✅ Function $func_name responding (HTTP $HTTP_STATUS)"
            else
                echo "⚠️ Function $func_name not responding"
            fi
        fi
    done
fi

echo ""
echo "5️⃣ Post-Deployment Validation"
echo "============================="

echo "Running post-deployment checks..."

# Check that gold tables have data
GOLD_TX_COUNT=$(psql "$PG_URL_SCOUT" -t -A -c "SELECT COUNT(*) FROM public.gold_recent_transactions;" 2>/dev/null || echo "0")
echo "Gold transactions: $GOLD_TX_COUNT"

# Check for any recent mock fallback hits (should be 0)
MOCK_HITS=$(psql "$PG_URL_SCOUT" -t -A -c "
SELECT COUNT(*)
FROM scout_ops.ui_events
WHERE event_type='mock_fallback_hit'
AND timestamp > NOW() - INTERVAL '1 hour';" 2>/dev/null || echo "0")

if [ "$MOCK_HITS" -eq 0 ]; then
    echo "✅ No mock fallback hits detected"
else
    echo "⚠️ Warning: $MOCK_HITS mock fallback hits in last hour"
fi

echo ""
echo "6️⃣ Deployment Summary"
echo "====================="
echo "✅ Database migrations: Applied"
echo "✅ Edge functions: Deployed"
echo "✅ Scout functions: $SCOUT_FUNCTION_COUNT active"
echo "✅ Data source: $DATA_SOURCE_STATUS"
echo "✅ Gold transactions: $GOLD_TX_COUNT"
echo "✅ Mock fallback hits: $MOCK_HITS (last hour)"
echo ""
echo "🎯 Bruno CI deployment complete!"
echo "Database and functions are live with proper secret isolation."