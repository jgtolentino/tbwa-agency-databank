# 🚀 Production Cutover Guide - Scout Dashboard

## **Current Status**
- ✅ **Current Production**: `main` branch → `scout-dashboard-xi.vercel.app`
- ✅ **Ready for Cutover**: `platform/scout-dash` branch → hardened production features
- ✅ **Correct App Path**: `apps/scout-dashboard/` (not `standalone-dashboard`)

---

## **Step-by-Step Cutover Process**

### **1. Vercel Project Settings → Git**
**Navigate**: Vercel Dashboard → Project → Settings → Git

**Change Production Branch**:
- **Current**: `main`
- **New**: `platform/scout-dash`
- **Action**: Set Production Branch to `platform/scout-dash`

### **2. Vercel Project Settings → Build & Output**
**Navigate**: Vercel Dashboard → Project → Settings → Build & Output Settings

**Install Command**:
```bash
npm --prefix apps/scout-dashboard ci
```

**Build Command**:
```bash
npm --prefix apps/scout-dashboard run build:vercel
```

**Output Directory**:
```bash
apps/scout-dashboard/.next
```

**Framework Preset**: Next.js

### **3. Environment Variables (Production Scope)**
**Navigate**: Vercel Dashboard → Project → Settings → Environment Variables

**⚠️ Important**: Set scope to **Production** (not Preview/Development)

**Required Variables**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://cxzllzyxwpyptfretryc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.adA0EO89jw5uPH4qdL_aox6EbDPvJ28NcXGYW7u33Ok
NEXT_PUBLIC_STRICT_DATASOURCE=true
```

**⚠️ Remove Old Variables**:
- Delete any `VITE_*` variables
- Remove any `SERVICE_ROLE_KEY` (client doesn't need this)
- Clean up any old app references

### **4. Deploy to Production**
**Navigate**: Vercel Dashboard → Project → Deployments

**Action**: Click "Deploy" → Select `platform/scout-dash` branch → "Deploy to Production"

---

## **Post-Cutover Validation**

### **A. Deployment Success**
```bash
# Check deployment status
curl -I https://scout-dashboard-xi.vercel.app/
# Expected: HTTP 200
```

### **B. Health Check**
```bash
curl https://scout-dashboard-xi.vercel.app/api/health
# Expected: {"status":"ok","lastCheck":"...","activeIssues":0}
```

### **C. API Endpoints**
```bash
# KPI Data
curl https://scout-dashboard-xi.vercel.app/api/kpis
# Expected: JSON with transaction metrics

# Enriched Data
curl https://scout-dashboard-xi.vercel.app/api/enriched
# Expected: JSON array with facial demographics
```

### **D. Browser Console (DevTools)**
Open browser → Navigate to dashboard → F12 → Console

**✅ Expected (Clean Console)**:
- No "Multiple GoTrueClient instances" errors
- No "Using CSV data mode" warnings
- No `toLocaleString` / `.map is not a function` errors
- Dashboard loads with live Supabase data

**❌ Red Flags**:
- Any CSV data loading messages
- Authentication/client creation errors
- Undefined method calls on arrays/objects

### **E. Data Verification**
- ✅ Dashboard displays live transaction data (not placeholder/CSV)
- ✅ Charts render actual metrics from Supabase
- ✅ Health badge shows "DQ: ok" status
- ✅ Real-time updates work (if enabled)

---

## **Rollback Plan (If Needed)**

### **Quick Rollback**
1. **Vercel → Git Settings**: Change Production Branch back to `main`
2. **Redeploy**: Deploy `main` branch to production
3. **Monitor**: Verify old version works

### **Alternative Rollback**
1. **Branch Creation**: Create hotfix branch from `main`
2. **Cherry-pick**: Apply critical fixes only
3. **Deploy**: Switch production to hotfix branch

---

## **Safety Rails (Recommended)**

### **Branch Protection**
```bash
# GitHub → Settings → Branches → Add rule
# Branch: platform/scout-dash
# ✅ Require pull request reviews
# ✅ Restrict pushes that create files outside apps/scout-dashboard/
# ✅ Require status checks to pass
```

### **Archive Old App**
```bash
# Rename to clearly indicate it's archived
mv apps/standalone-dashboard apps/_archived_standalone-dashboard
git add apps/
git commit -m "Archive old standalone-dashboard app"
```

### **CSV Guard CI**
```bash
# In .github/workflows/ - ensure CSV guard runs on all PRs
# Should block any CSV imports in production builds
npm run build:guard  # Should be part of CI pipeline
```

---

## **Production Features Enabled**

### **🛡️ Security & Data Protection**
- ✅ **Singleton Client**: Prevents multiple GoTrueClient instances
- ✅ **CSV Guard**: Build-time protection against CSV imports
- ✅ **Strict Data Source**: Enforces Supabase-only mode
- ✅ **Runtime Guard**: Blocks CSV functions in production

### **📊 Data Architecture**
- ✅ **Gold Layer Views**: `scout_gold_transactions_flat`, `scout_gold_facial_demographics`
- ✅ **Stats Summary**: `scout_stats_summary` for KPI aggregations
- ✅ **Health Monitoring**: `dq_health_summary` for data quality metrics
- ✅ **Unified Service**: `UnifiedDataService` singleton pattern

### **⚡ Performance Features**
- ✅ **Edge Caching**: 60s cache on API routes with 5min stale-while-revalidate
- ✅ **Real-time Updates**: WebSocket connections for live data
- ✅ **Optimized Queries**: Materialized views and proper indexing

---

## **Support Contacts**

**Technical Issues**: Check browser console, API responses, Vercel build logs
**Data Issues**: Verify Supabase connection, check PostgREST API directly
**Deployment Issues**: Review Vercel settings, environment variables, build commands

**Last Updated**: September 2025
**Maintainer**: Claude Code + Jake Tolentino