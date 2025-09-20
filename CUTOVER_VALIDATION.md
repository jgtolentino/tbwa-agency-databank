# 🚀 Production Cutover Validation Commands

## Pre-Cutover Status ✅
- **Branch**: `platform/scout-dash`
- **Commit**: `817237b` (workspace and vercel config fixes)
- **Tag**: `v-prod-cutover-1` (rollback anchor)
- **Configuration**: All paths verified, no lingering references

## Post-Deploy Smoke Test Commands

### 1. Supabase REST API Validation
```bash
# Test direct Supabase connection
export SUPABASE_URL="https://cxzllzyxwpyptfretryc.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.adA0EO89jw5uPH4qdL_aox6EbDPvJ28NcXGYW7u33Ok"

curl -s \
 -H "apikey: $SUPABASE_ANON_KEY" \
 -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
 "$SUPABASE_URL/rest/v1/scout_gold_transactions_flat?select=interaction_id,store_id,amount,effective_ts&limit=1" | jq .

# Expected: HTTP 200 + JSON array with transaction data
```

### 2. Health Endpoint Validation
```bash
# Test health monitoring API
curl -s "https://scout-dashboard-xi.vercel.app/api/health" | jq .

# Expected: {"status":"ok","lastCheck":"2025-09-20T...","activeIssues":0}
```

### 3. KPI Endpoints Validation
```bash
# Test KPI data endpoint
curl -s "https://scout-dashboard-xi.vercel.app/api/kpis" | jq .

# Test enriched data endpoint
curl -s "https://scout-dashboard-xi.vercel.app/api/enriched" | jq .

# Expected: JSON responses with dashboard data
```

## Browser Console Validation ✅
Open `https://scout-dashboard-xi.vercel.app` in browser → F12 → Console

**✅ Expected (Clean Console)**:
- No "Multiple GoTrueClient instances" errors
- No "Using CSV data mode" warnings
- No `.map` / `toLocaleString` / undefined method errors
- Dashboard loads with live Supabase data
- Health badge shows "DQ: ok" status

**❌ Red Flags**:
- Any CSV data loading messages
- Authentication/client creation errors
- JavaScript runtime errors

## Build Log Validation ✅
Check Vercel build logs for:
```
NEXT_PUBLIC_STRICT_DATASOURCE=true npm run build:guard
✅ CSV guard passed
```

## Rollback Commands (If Needed)

### Option A: Promote Previous Deployment
```bash
# List recent deployments
vercel ls scout-dashboard --prod

# Rollback to previous green deployment
vercel rollback https://scout-dashboard-<prev-hash>.vercel.app --yes
```

### Option B: Branch Rollback
```bash
# Vercel Dashboard: Git Settings → Production Branch → main
# Then trigger redeploy
```

### Option C: Tag Rollback
```bash
# Reset to tagged state
git checkout v-prod-cutover-1
git checkout -b hotfix/rollback
# Push and deploy hotfix branch
```

## Success Criteria Summary

1. ✅ **Health API**: Returns JSON with status/timestamp
2. ✅ **Data APIs**: KPIs and enriched data return live Supabase data
3. ✅ **Browser Console**: Clean, no errors or warnings
4. ✅ **CSV Guard**: Build logs show guard passed
5. ✅ **Dashboard**: Loads with live transaction data and charts
6. ✅ **Real-time**: Live data updates (if implemented)
7. ✅ **Performance**: API responses cached with proper headers

**All systems ready for production cutover!** 🚀

Last Updated: September 2025