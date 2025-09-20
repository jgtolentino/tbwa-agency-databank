# Scout Dashboard Deployment Guide

## 🎯 Production-Ready Deployment

This dashboard is hardened for production with **zero CSV dependencies** and **singleton Supabase client pattern**.

### ✅ Pre-Deploy Verification

Run these checks before any deployment:

```bash
# 1. CSV Guard passes
NEXT_PUBLIC_STRICT_DATASOURCE=true npm run build:guard
# Expected: ✅ CSV guard passed

# 2. Singleton client only
rg -n "createClient\(" src | rg -v "src/lib/supabaseClient"
# Expected: no matches

# 3. No SERVICE_ROLE in app code
rg -n "SERVICE_ROLE" src
# Expected: no matches

# 4. PostgREST API works
curl -H "apikey: $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/scout_gold_transactions_flat?limit=1"
# Expected: HTTP 200 + JSON array
```

### 🚀 Vercel Deployment

**Build Settings:**
- **Build Command:** `npm run build:vercel`
- **Output Directory:** _(leave empty)_
- **Install Command:** `npm ci`

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://cxzllzyxwpyptfretryc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRICT_DATASOURCE=true
```

### 🔒 Security Patterns

#### Singleton Supabase Client
- **File:** `src/lib/supabaseClient.ts`
- **Usage:** Always import `getSupabase()` - never create clients directly
- **Why:** Prevents "Multiple GoTrueClient instances" warnings

#### CSV Protection
- **Guard:** `scripts/guard-no-csv.mjs` runs before every build
- **Protection:** CSV export functions blocked in production mode
- **Detection:** Catches `papaparse`, `.csv` imports, unguarded exports

#### Error Handling
- All data fetches wrapped with `Array.isArray()` guards
- Safe date handling prevents `toLocaleString` undefined errors
- API routes use consistent error responses

### 🔍 Post-Deploy Smoke Tests

**DevTools Console (should be clean):**
- ❌ No "Multiple GoTrueClient instances"
- ❌ No "Using CSV data mode"
- ❌ No `toLocaleString` / `.map` undefined errors

**API Health:**
- Dashboard loads with live Supabase data
- `/api/kpis`, `/api/enriched`, `/api/dq/summary` return 200

**Data Sources:**
- Only Supabase data displayed
- CSV imports disabled in production

### 🛠 Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| CSV Export | Allowed | Blocked (throws error) |
| Data Source | Supabase + CSV fallbacks | Supabase only |
| Build Guard | Optional | Required (fails build) |
| Client Pattern | Flexible | Singleton enforced |

### ⚠️ Common Issues

**"Multiple GoTrueClient instances"**
- Fix: Ensure all files import from `src/lib/supabaseClient.ts`
- Check: No direct `createClient()` calls outside singleton

**"CSV references not allowed in production"**
- Fix: Remove any `.csv` imports or `papaparse` usage
- Check: Run `npm run build:guard` locally

**Build artifacts in repo**
- Fix: `.next` directory already ignored
- Check: No large files in git history

### 📊 Data Architecture

**Database Views (PostgREST):**
- `scout_gold_transactions_flat` - Main transaction data
- `scout_gold_facial_demographics` - Demographic analytics
- `scout_stats_summary` - KPI summary metrics

**API Routes:**
- `/api/kpis` - Dashboard KPI data
- `/api/enriched` - Enhanced transaction data
- `/api/dq/summary` - Data quality metrics

---

**Last Updated:** September 2025
**Version:** Production-ready with full CSV protection
**Maintainer:** Claude Code + Jake Tolentino