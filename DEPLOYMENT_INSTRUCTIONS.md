# PS2 ETL Deployment Instructions

## 🚀 Production Deployment Steps

### 1. Merge PR to Main Branch ✅ COMPLETED

The PS2 ETL fixes have been committed to the `ps2-etl-fixes` branch and are ready for merge.

**Create PR manually at**: https://github.com/jgtolentino/tbwa-agency-databank/pull/new/ps2-etl-fixes

### 2. Apply Migrations to Production Database

#### Option A: Automated Deployment (Recommended)
```bash
# Set your production database URL
export DATABASE_URL="postgres://user:pass@host:port/dbname"

# Run automated deployment script
./deploy_ps2_etl_production.sh
```

#### Option B: Manual Step-by-Step
```bash
# Apply migrations in order
psql "$DATABASE_URL" -f supabase/migrations/030_ps2_effective_ts.sql
psql "$DATABASE_URL" -f supabase/migrations/031_ps2_items_flatten.sql
psql "$DATABASE_URL" -f supabase/migrations/032_canonical_regen.sql
psql "$DATABASE_URL" -f supabase/migrations/033_gold_flat_effective.sql
```

### 3. Run Verification Queries

```bash
# Validate the fixes worked
psql "$DATABASE_URL" -f ps2_verification_queries.sql
```

**Expected Results**:
- ✅ **PS2 Timestamp Coverage**: ~100% `pct_effective_ok`
- ✅ **Items Flattening**: `item_rows` > `tx_rows` (multiple items per transaction)
- ✅ **Pricing Mapping**: High % with valid amounts
- ✅ **Canonical Uniqueness**: `potential_collapses = 0`
- ✅ **Data Quality Scorecard**: Overall "GOOD" or "PERFECT" grades

### 4. Monitor Dashboard for PS2 Transaction Display

Open the updated dashboard:
```bash
# Open PS2-enabled ETL dashboard
open dual_source_etl_dashboard_ps2.html
```

**New Dashboard Features**:
- 🔧 **PS2 Edge Source** in architecture diagram
- 📊 **PS2-specific metrics** (items flattened, timestamp fixes, etc.)
- 🔄 **Real-time PS2 activity feed**
- ✅ **PS2 ETL status banner** showing deployment success
- 📈 **Enhanced quality metrics** with PS2 validation

## 📋 Migration Details

### Migration 030: PS2 Timestamp Fallback
**Purpose**: Fix empty PS2 timestamps using deterministic fallback hierarchy
```sql
effective_ts = COALESCE(
  NULLIF(timestamp, '')::timestamptz,        -- Original if not empty
  privacy.consentTimestamp::timestamptz,     -- Fallback to consent
  loaded_at,                                 -- ETL load time
  _ingested_at                              -- Raw ingest time
)
```

### Migration 031: PS2 Items Array Flattening
**Purpose**: Properly flatten `items[]` arrays and map pricing
- **Before**: 1 JSON → 1 database row with empty values
- **After**: 1 JSON → N database rows (one per `items[]` entry)
- **Price mapping**: `items[].totalPrice` → `amount` field

### Migration 032: Canonical TX ID Regeneration
**Purpose**: Regenerate canonical IDs using `effective_ts` to prevent collapses
```sql
canonical_tx_id = md5(store_id || '|' || effective_ts || '|' || amount || '|' || device_id)
```

### Migration 033: Gold Layer Updates
**Purpose**: Update Gold views and public API to use `effective_ts`
- Gold views use `effective_ts` for proper temporal sorting
- Public API maintains compatibility with existing UI
- Enhanced stats and summary views

## 🔍 Verification Checklist

After deployment, verify these metrics:

### PS2 Data Quality
- [ ] **Timestamp Coverage**: 100% of PS2 records have `effective_ts`
- [ ] **Price Mapping**: 100% of PS2 records have valid `total_amount`
- [ ] **Store Coverage**: 100% of PS2 records have `store_id`
- [ ] **Items Flattening**: Multiple item rows per transaction JSON
- [ ] **Zero Collapses**: No duplicate `canonical_tx_id` values

### System Health
- [ ] **API Endpoints**: `/scout_gold_transactions_flat` returns PS2 data
- [ ] **Dashboard**: Shows PS2 transactions in UI
- [ ] **Performance**: Query response times < 2 seconds
- [ ] **Error Rates**: < 1% processing errors

### Data Integrity
- [ ] **Transaction Atomicity**: Canonical grouping preserved
- [ ] **Historical Data**: Existing Azure data unaffected
- [ ] **Audit Trail**: Migration logs and backup created

## 🚨 Rollback Plan

If issues are detected:

### Quick Rollback
```bash
# Restore from backup
psql "$DATABASE_URL" < backup_pre_ps2_etl_YYYYMMDD_HHMMSS.sql
```

### Partial Rollback
```sql
-- Revert canonical TX ID changes
UPDATE silver.sales_interactions
SET canonical_tx_id = md5(store_id || '|' || transaction_ts || '|' || amount)
WHERE source = 'ps2';
```

## 📞 Support

If deployment issues occur:
1. Check verification results for specific failures
2. Review migration logs for SQL errors
3. Validate environment variables are set correctly
4. Ensure database permissions allow schema modifications

## 🎯 Success Metrics

**Deployment successful when**:
- All 4 migrations complete without errors
- Verification queries show 100% coverage metrics
- Dashboard displays PS2 data correctly
- API endpoints return expected PS2 transactions
- Zero transaction collapses detected

---

**Repository**: https://github.com/jgtolentino/tbwa-agency-databank
**Branch**: `ps2-etl-fixes`
**Deployment Script**: `./deploy_ps2_etl_production.sh`
**Dashboard**: `dual_source_etl_dashboard_ps2.html`