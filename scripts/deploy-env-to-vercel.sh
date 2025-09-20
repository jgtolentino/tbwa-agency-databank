#!/bin/bash

# Deploy Environment Variables to Vercel
# Usage: ./deploy-env-to-vercel.sh [project-name]

set -e

PROJECT_NAME=${1:-"scout-dashboard"}
VERCEL_ORG_ID=${VERCEL_ORG_ID:-""}

echo "🚀 Deploying environment variables to Vercel project: $PROJECT_NAME"

# Validate Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
    exit 1
fi

# Set production environment variables
echo "📝 Setting production environment variables..."

# Supabase Configuration
vercel env add NEXT_PUBLIC_SUPABASE_URL production << EOF
https://cxzllzyxwpyptfretryc.supabase.co
EOF

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production << EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.TKvgUGWOUPPYgqGmSLlYCy1LfkqpLhTg8jQ38h_TjeE
EOF

vercel env add SUPABASE_URL production << EOF
https://cxzllzyxwpyptfretryc.supabase.co
EOF

vercel env add SUPABASE_SERVICE_KEY production << EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTIwNjMzNCwiZXhwIjoyMDcwNzgyMzM0fQ.vB9MIfInzX-ch4Kzb-d0_0ndNm-id1MVgQZuDBmtrdw
EOF

# Data source mode
vercel env add NEXT_PUBLIC_STRICT_DATASOURCE production << EOF
true
EOF

# Set preview environment variables (same as production)
echo "📝 Setting preview environment variables..."

vercel env add NEXT_PUBLIC_SUPABASE_URL preview << EOF
https://cxzllzyxwpyptfretryc.supabase.co
EOF

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview << EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.TKvgUGWOUPPYgqGmSLlYCy1LfkqpLhTg8jQ38h_TjeE
EOF

vercel env add SUPABASE_URL preview << EOF
https://cxzllzyxwpyptfretryc.supabase.co
EOF

vercel env add SUPABASE_SERVICE_KEY preview << EOF
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTIwNjMzNCwiZXhwIjoyMDcwNzgyMzM0fQ.vB9MIfInzX-ch4Kzb-d0_0ndNm-id1MVgQZuDBmtrdw
EOF

vercel env add NEXT_PUBLIC_STRICT_DATASOURCE preview << EOF
true
EOF

echo "✅ Environment variables deployed successfully!"

# Trigger new deployment to pick up env vars
echo "🔄 Triggering new deployment..."
vercel --prod --yes

echo "🎉 Deployment complete! Environment variables are now live."
echo ""
echo "🔍 Verify deployment:"
echo "   Production: https://$PROJECT_NAME.vercel.app/debug"
echo "   Data Health: https://$PROJECT_NAME.vercel.app/data-health"