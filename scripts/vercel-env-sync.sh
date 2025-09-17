#!/bin/bash

# Vercel Environment Sync Script
# Ensures proper environment isolation with safe frontend variables only

set -euo pipefail

echo "🔄 Vercel Environment Sync"
echo "=========================="
echo "Syncing safe environment variables to Vercel production"
echo ""

# Validate required environment variables
if [ -z "${SUPABASE_URL:-}" ]; then
    echo "❌ ERROR: SUPABASE_URL environment variable not set"
    exit 1
fi

if [ -z "${SUPABASE_ANON_KEY:-}" ]; then
    echo "❌ ERROR: SUPABASE_ANON_KEY environment variable not set"
    exit 1
fi

echo "1️⃣ Cleaning Existing Mock Variables"
echo "===================================="

# Remove any existing mock variables to prevent conflicts
vercel env rm NEXT_PUBLIC_USE_MOCK --yes --prod 2>/dev/null || true
vercel env rm VITE_USE_MOCK --yes --prod 2>/dev/null || true
vercel env rm NEXT_PUBLIC_ALLOW_FALLBACK_IN_PROD --yes --prod 2>/dev/null || true
vercel env rm VITE_ALLOW_FALLBACK_IN_PROD --yes --prod 2>/dev/null || true

echo "✅ Cleaned existing mock variables"

echo ""
echo "2️⃣ Setting Production Environment Variables"
echo "==========================================="

# CRITICAL: Disable mocks in production (both prefixes for bulletproof protection)
echo "Setting mock disable flags..."
vercel env add NEXT_PUBLIC_USE_MOCK production <<< "0"
vercel env add VITE_USE_MOCK production <<< "0"

# Disable fallbacks in production
echo "Setting fallback disable flags..."
vercel env add NEXT_PUBLIC_ALLOW_FALLBACK_IN_PROD production <<< "0"
vercel env add VITE_ALLOW_FALLBACK_IN_PROD production <<< "0"

# Safe frontend Supabase variables (read-only)
echo "Setting Supabase frontend variables..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_URL production <<< "$SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
vercel env add VITE_SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"

echo "✅ Production environment variables set"

echo ""
echo "3️⃣ Setting Preview Environment Variables"
echo "========================================"

# Preview environment (mocks allowed for testing)
echo "Setting preview environment with mock capability..."
vercel env add NEXT_PUBLIC_USE_MOCK preview <<< "1"
vercel env add VITE_USE_MOCK preview <<< "1"
vercel env add NEXT_PUBLIC_ALLOW_FALLBACK_IN_PROD preview <<< "0"
vercel env add VITE_ALLOW_FALLBACK_IN_PROD preview <<< "0"
vercel env add NEXT_PUBLIC_SUPABASE_URL preview <<< "$SUPABASE_URL"
vercel env add VITE_SUPABASE_URL preview <<< "$SUPABASE_URL"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview <<< "$SUPABASE_ANON_KEY"
vercel env add VITE_SUPABASE_ANON_KEY preview <<< "$SUPABASE_ANON_KEY"

echo "✅ Preview environment variables set"

echo ""
echo "4️⃣ Environment Validation"
echo "========================="

# Validate production environment
echo "Validating production environment..."
PROD_ENV_OUTPUT=$(vercel env ls --prod)

# Check that mocks are disabled
if echo "$PROD_ENV_OUTPUT" | grep -E '^(NEXT_PUBLIC_USE_MOCK|VITE_USE_MOCK)\s+1'; then
    echo "❌ ERROR: Mocks still enabled in production"
    exit 1
fi

# Check that required variables are present
if ! echo "$PROD_ENV_OUTPUT" | grep -q "NEXT_PUBLIC_SUPABASE_URL"; then
    echo "❌ ERROR: NEXT_PUBLIC_SUPABASE_URL not found in production"
    exit 1
fi

if ! echo "$PROD_ENV_OUTPUT" | grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY"; then
    echo "❌ ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in production"
    exit 1
fi

echo "✅ Production environment validated"

echo ""
echo "5️⃣ Security Verification"
echo "========================"

# Verify NO sensitive variables are in Vercel
SENSITIVE_VARS=("SUPABASE_SERVICE_ROLE_KEY" "SUPABASE_DB_PASSWORD" "PG_URL_SCOUT" "GOOGLE_DRIVE_SA" "AZURE_EVENT_HUB")

for var in "${SENSITIVE_VARS[@]}"; do
    if echo "$PROD_ENV_OUTPUT" | grep -q "$var"; then
        echo "❌ ERROR: Sensitive variable $var found in Vercel production environment"
        echo "Remove it immediately: vercel env rm $var --prod"
        exit 1
    fi
done

echo "✅ No sensitive variables detected in Vercel"

echo ""
echo "6️⃣ Summary"
echo "=========="
echo "✅ Production: Mocks disabled, safe variables only"
echo "✅ Preview: Mocks enabled for testing"
echo "✅ Security: No sensitive variables in Vercel"
echo "✅ Isolation: Frontend variables properly scoped"
echo ""
echo "🎯 Vercel environment sync complete!"
echo "Ready for deployment with real data only."