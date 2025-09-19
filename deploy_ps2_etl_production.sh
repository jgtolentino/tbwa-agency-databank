#!/bin/bash

# Deploy PS2 ETL fixes to production database
# Usage: ./deploy_ps2_etl_production.sh

set -e

echo "🚀 Deploying PS2 ETL fixes to production..."

# Check required environment variables
if [[ -z "${DATABASE_URL:-}" ]]; then
    echo "❌ ERROR: DATABASE_URL environment variable not set"
    echo "Set it with: export DATABASE_URL='postgres://user:pass@host:port/dbname'"
    exit 1
fi

# Backup current state (optional but recommended)
echo "📦 Creating backup of current state..."
pg_dump "$DATABASE_URL" --schema=silver --schema=gold --schema=governance > "backup_pre_ps2_etl_$(date +%Y%m%d_%H%M%S).sql" || echo "⚠️ Backup failed, continuing..."

echo "🔧 Applying PS2 ETL migrations in sequence..."

# Migration 1: PS2 timestamp fallback + effective_ts
echo "1️⃣ Applying PS2 timestamp fallback migration..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/030_ps2_effective_ts.sql

# Migration 2: PS2 items array flattening + price mapping
echo "2️⃣ Applying PS2 items array flattening migration..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/031_ps2_items_flatten.sql

# Migration 3: Canonical TX ID regeneration with effective_ts
echo "3️⃣ Applying canonical TX ID regeneration migration..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/032_canonical_regen.sql

# Migration 4: Gold layer views + public API updates
echo "4️⃣ Applying Gold layer views migration..."
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/033_gold_flat_effective.sql

echo "✅ All migrations applied successfully!"

echo "🔍 Running post-deployment verification..."

# Run verification queries
echo "📊 Running PS2 ETL verification queries..."
psql "$DATABASE_URL" -f ps2_verification_queries.sql > ps2_verification_results_$(date +%Y%m%d_%H%M%S).txt

echo "📈 Verification results saved to ps2_verification_results_*.txt"

echo ""
echo "🎉 PS2 ETL deployment complete!"
echo ""
echo "Expected results:"
echo "✅ 100% timestamp coverage using fallback hierarchy"
echo "✅ 100% price mapping from items array"
echo "✅ 100% store coverage (storeId in JSON)"
echo "✅ Zero transaction collapses with proper canonical IDs"
echo "✅ Full item granularity preserved from items[] array"
echo ""
echo "Next steps:"
echo "1. Review verification results in ps2_verification_results_*.txt"
echo "2. Monitor dashboard at dual_source_etl_dashboard_ps2.html"
echo "3. Check public API endpoints for PS2 data availability"
echo ""
echo "Dashboard: file://$(pwd)/dual_source_etl_dashboard_ps2.html"