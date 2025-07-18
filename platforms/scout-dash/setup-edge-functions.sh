#!/bin/bash

# Setup script for Supabase Edge Functions with AI Bots
# This script configures and deploys the edge functions

echo "🚀 Setting up Supabase Edge Functions for AI Bots..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Set the Groq API key
echo "🔐 Setting Groq API key..."
supabase secrets set GROQ_API_KEY=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

# Optional: Set Supabase credentials for logging
echo "📊 Do you want to enable AI insights logging? (y/n)"
read -r enable_logging

if [[ "$enable_logging" == "y" ]]; then
    echo "Enter your Supabase URL:"
    read -r supabase_url
    echo "Enter your Supabase Service Role Key:"
    read -r supabase_key
    
    supabase secrets set SUPABASE_URL="$supabase_url"
    supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$supabase_key"
fi

# Deploy the functions
echo "🚀 Deploying AI Genie..."
supabase functions deploy genie --no-verify-jwt

echo "🚀 Deploying RetailBot..."
supabase functions deploy retailbot --no-verify-jwt

echo "🚀 Deploying AdsBot..."
supabase functions deploy adsbot --no-verify-jwt

# Get the project ref
PROJECT_REF=$(supabase status --output json | jq -r '.SUPABASE_URL' | sed 's|https://||' | sed 's|.supabase.co||')

echo "✅ Deployment complete!"
echo ""
echo "📍 Your Edge Function URLs:"
echo "AI Genie:   https://${PROJECT_REF}.supabase.co/functions/v1/genie"
echo "RetailBot:  https://${PROJECT_REF}.supabase.co/functions/v1/retailbot"
echo "AdsBot:     https://${PROJECT_REF}.supabase.co/functions/v1/adsbot"
echo ""
echo "🔧 Add these to your .env.local:"
echo "NEXT_PUBLIC_GENIE_URL=https://${PROJECT_REF}.supabase.co/functions/v1/genie"
echo "NEXT_PUBLIC_RETAILBOT_URL=https://${PROJECT_REF}.supabase.co/functions/v1/retailbot"
echo "NEXT_PUBLIC_ADSBOT_URL=https://${PROJECT_REF}.supabase.co/functions/v1/adsbot"
echo ""
echo "🎉 All done! Your AI bots are ready to use."