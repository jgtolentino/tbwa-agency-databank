# 🚀 Scout Dashboard - Production Deployment Guide

## **Critical Path Configuration**

### **A) Vercel Build Settings**
**Project**: scout-analytics
**Build Command**: `npm --prefix apps/scout-dashboard run build:vercel`
**Framework**: Next.js
**Root Directory**: *(leave empty)*

### **B) Environment Variables (Production Scope Only)**

**⚠️ REMOVE ALL `VITE_*` variables first**

**Required Variables:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://cxzllzyxwpyptfretryc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.adA0EO89jw5uPH4qdL_aox6EbDPvJ28NcXGYW7u33Ok
NEXT_PUBLIC_STRICT_DATASOURCE=true
```

### **C) Pre-Deployment Validation**

**Local CSV Guard Test:**
```bash
cd apps/scout-dashboard
npm run build:guard
# Expected: ✅ CSV guard passed
```

**PostgREST API Test:**
```bash
curl -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.adA0EO89jw5uPH4qdL_aox6EbDPvJ28NcXGYW7u33Ok" \
"https://cxzllzyxwpyptfretryc.supabase.co/rest/v1/scout_gold_transactions_flat?limit=1"
# Expected: HTTP 200 + JSON array
```

---

## **Production Features**

### **🛡️ Security & Data Protection**
- **Singleton Client**: `getSupabase()` prevents multiple GoTrueClient instances
- **CSV Guard**: Build-time protection against CSV imports in production
- **Strict Data Source**: `NEXT_PUBLIC_STRICT_DATASOURCE=true` enforces Supabase-only mode
- **Runtime Guard**: Blocks CSV functions in production environment

### **📊 Data Architecture**
- **Gold Layer Views**: `scout_gold_transactions_flat`, `scout_gold_facial_demographics`
- **Stats Summary**: `scout_stats_summary` for KPI aggregations
- **Health Monitoring**: `dq_health_summary` for data quality metrics
- **Unified Service**: `UnifiedDataService` singleton for consistent data access

### **⚡ Performance Features**
- **Edge Caching**: 60s cache on API routes with 5min stale-while-revalidate
- **Real-time Updates**: WebSocket connections to Supabase for live data
- **Optimized Queries**: Leverages materialized views and proper indexing

---

## **Post-Deploy Smoke Tests**

### **1. Health Check**
```bash
curl https://your-deployment.vercel.app/api/health
# Expected: {"status": "ok", "lastCheck": "...", "activeIssues": 0}
```

### **2. API Endpoints**
```bash
# KPI Data
curl https://your-deployment.vercel.app/api/kpis
# Expected: JSON with metrics

# Enriched Data
curl https://your-deployment.vercel.app/api/enriched
# Expected: JSON array with facial demographics
```

### **3. Browser Console (DevTools)**
**✅ Expected (Clean Console):**
- No "Multiple GoTrueClient instances" errors
- No "Using CSV data mode" warnings
- No `toLocaleString` / `.map is not a function` errors

**❌ Red Flags:**
- Any mention of CSV data loading
- Authentication/client creation errors
- Undefined method calls on arrays/objects

### **4. Data Verification**
- Dashboard loads with live Supabase data (not placeholder/CSV)
- Charts display actual transaction metrics
- Real-time updates work (if implemented)
- Health badge shows "DQ: ok" status

---

## **Troubleshooting Common Issues**

### **"Multiple GoTrueClient instances"**
**Fix**: Ensure all components import from `@/lib/supabaseClient` only
```bash
# Check for rogue createClient calls
grep -r "createClient" apps/scout-dashboard/src/
# Should only find: src/lib/supabaseClient.ts
```

### **"Using CSV data mode"**
**Fix**: Verify environment variables in Vercel dashboard
- Check Production scope (not Preview)
- Remove any `VITE_*` variables
- Ensure `NEXT_PUBLIC_STRICT_DATASOURCE=true`

### **Build Failures**
**Fix**: CSV guard failing or TypeScript errors
```bash
# Local debug
npm run build:guard  # Should pass
npm run build        # Should complete without errors
```

### **401/403 API Errors**
**Fix**: Supabase RLS or invalid anon key
- Verify anon key in Vercel matches Supabase dashboard
- Check RLS policies allow anon access to public views
- Test PostgREST directly (curl command above)

---

## **File Structure Reference**

```
apps/scout-dashboard/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts          # ✅ Health monitoring
│   │   │   ├── kpis/route.ts            # KPI aggregations
│   │   │   └── enriched/route.ts        # Enhanced data
│   │   └── page.tsx                     # Main dashboard
│   ├── components/
│   │   └── HealthBadge.tsx              # ✅ DQ status indicator
│   ├── hooks/
│   │   └── useRealtimeMetrics.ts        # ✅ Real-time updates
│   ├── lib/
│   │   └── supabaseClient.ts            # ✅ Singleton client
│   └── services/
│       ├── datasource.ts                # Data fetching
│       └── unifiedDataService.ts        # ✅ Unified API
├── scripts/
│   └── guard-no-csv.mjs                 # ✅ CSV protection
├── package.json                         # Build scripts
└── DEPLOYMENT_README.md                 # This file
```

---

## **Environment-Specific Notes**

### **Development**
- CSV guard skipped when `NEXT_PUBLIC_STRICT_DATASOURCE !== "true"`
- Multiple data sources allowed for testing
- Verbose error messages and debugging

### **Production**
- CSV guard enforced on every build
- Supabase-only data access
- Error boundaries and graceful fallbacks
- Performance optimizations enabled

---

**Last Updated**: September 2025
**Maintainer**: Claude Code + Jake Tolentino
**Version**: Production-ready with unified services and real-time features