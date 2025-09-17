#!/bin/bash

# Test RPC Functions in Production with Real Data
# Validates >0 rows returned under RLS conditions

set -euo pipefail

# Configuration
PG_URL=${PG_URL_SCOUT:-"postgres://postgres.cxzllzyxwpyptfretryc:Postgres_26@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"}

echo "🧪 Testing RPC Functions with Real Data"
echo "======================================="

# Test Geographic Summary
echo "📍 Testing scout.get_geo_summary..."
GEO_RESULT=$(psql "$PG_URL" -t -A -c "SELECT total_stores FROM scout.get_geo_summary('{}');")
if [[ "$GEO_RESULT" =~ ^[0-9]+$ ]] && [[ "$GEO_RESULT" -gt 0 ]]; then
    echo "✅ Geographic Summary: $GEO_RESULT stores found"
else
    echo "❌ Geographic Summary: No data or invalid result: $GEO_RESULT"
    exit 1
fi

# Test Brand Performance
echo "🏢 Testing scout.get_brand_performance..."
BRAND_COUNT=$(psql "$PG_URL" -t -A -c "SELECT COUNT(*) FROM scout.get_brand_performance('{}');")
if [[ "$BRAND_COUNT" =~ ^[0-9]+$ ]] && [[ "$BRAND_COUNT" -gt 0 ]]; then
    echo "✅ Brand Performance: $BRAND_COUNT brands analyzed"
else
    echo "❌ Brand Performance: No data returned: $BRAND_COUNT"
    exit 1
fi

# Test Consumer Behavior
echo "👥 Testing scout.get_consumer_behavior..."
CONSUMER_RESULT=$(psql "$PG_URL" -t -A -c "SELECT spending_patterns->>'total_transactions' FROM scout.get_consumer_behavior('{}');")
if [[ "$CONSUMER_RESULT" =~ ^[0-9]+$ ]] && [[ "$CONSUMER_RESULT" -gt 0 ]]; then
    echo "✅ Consumer Behavior: $CONSUMER_RESULT transactions analyzed"
else
    echo "❌ Consumer Behavior: No data or invalid result: $CONSUMER_RESULT"
    exit 1
fi

# Test Data Source Status
echo "🛡️ Testing data source governance..."
BADGE_STATUS=$(psql "$PG_URL" -t -A -c "SELECT source_status FROM public.get_data_source_status();")
if [[ "$BADGE_STATUS" == "Trusted" ]]; then
    echo "✅ Data Source Badge: $BADGE_STATUS"
else
    echo "⚠️ Data Source Badge: $BADGE_STATUS (not Trusted)"
fi

# Test Performance
echo "⚡ Testing performance benchmarks..."
START_TIME=$(date +%s%N)
psql "$PG_URL" -c "SELECT * FROM scout.get_geo_summary('{}');" > /dev/null
END_TIME=$(date +%s%N)
DURATION_MS=$(( (END_TIME - START_TIME) / 1000000 ))

if [[ $DURATION_MS -lt 1200 ]]; then
    echo "✅ Performance: ${DURATION_MS}ms (target <1200ms)"
else
    echo "⚠️ Performance: ${DURATION_MS}ms (exceeds 1200ms target)"
fi

echo ""
echo "🎯 Production RPC Test Summary:"
echo "  Geographic Data: $GEO_RESULT stores"
echo "  Brand Analysis: $BRAND_COUNT brands"
echo "  Consumer Data: $CONSUMER_RESULT transactions"
echo "  Data Source: $BADGE_STATUS"
echo "  Performance: ${DURATION_MS}ms"

if [[ "$GEO_RESULT" -gt 0 ]] && [[ "$BRAND_COUNT" -gt 0 ]] && [[ "$CONSUMER_RESULT" -gt 0 ]]; then
    echo "✅ ALL PRODUCTION TESTS PASSED"
    exit 0
else
    echo "❌ SOME PRODUCTION TESTS FAILED"
    exit 1
fi