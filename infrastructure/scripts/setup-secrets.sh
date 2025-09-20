#!/bin/bash

# Setup Secrets for Palette Forge
echo "🔐 Setting up secrets for Palette Forge..."

# Generate API token if not provided
if [ -z "$CES_API_TOKEN" ]; then
    echo "🎲 Generating CES API token..."
    export CES_API_TOKEN=$(openssl rand -hex 32)
    echo "Generated token: $CES_API_TOKEN"
fi

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Please set:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_ANON_KEY"
    exit 1
fi

# Set PGVECTOR_URL from SUPABASE_URL if not provided
if [ -z "$PGVECTOR_URL" ]; then
    # Extract database URL from Supabase URL
    PGVECTOR_URL=$(echo $SUPABASE_URL | sed 's/https:\/\//postgres:\/\/postgres:your-password@/g' | sed 's/.supabase.co/.supabase.co:5432\/postgres/g')
    echo "⚠️  Warning: PGVECTOR_URL not set, using derived URL"
    echo "Please update with actual database password"
fi

# Configure Doppler
echo "📡 Configuring Doppler secrets..."
doppler secrets set \
  PALETTE_SUPA_URL="$SUPABASE_URL" \
  PALETTE_SUPA_KEY="$SUPABASE_ANON_KEY" \
  PALETTE_PGV_URL="$PGVECTOR_URL" \
  CES_API_TOKEN="$CES_API_TOKEN" \
  --project tbwa-platform-keykey

# Also set for Render services
doppler secrets set \
  SUPABASE_URL="$SUPABASE_URL" \
  SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY" \
  PGVECTOR_URL="$PGVECTOR_URL" \
  API_TOKEN="$CES_API_TOKEN" \
  --project tbwa-platform-keykey

echo ""
echo "✅ Secrets configured!"
echo ""
echo "🔑 Save this API token for client configuration:"
echo "CES_API_TOKEN=$CES_API_TOKEN"
echo ""
echo "Next steps:"
echo "1. Update PGVECTOR_URL with actual database password if needed"
echo "2. Ensure env-sync.yml includes palette-svc and ces-gw services"
echo "3. Deploy to Render"