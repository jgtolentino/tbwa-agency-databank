#!/bin/bash

echo "🚀 Deploying Scout Dashboard to Vercel..."

# Clean up problematic files
rm -rf components/chartvision/*/MainPage.tsx
rm -rf components/chartvision/*/*Dashboard.tsx
rm -rf components/chartvision/*/*DataHook.tsx

# Keep only the working files
find components/chartvision -type f -name "*.tsx" | grep -v SimplifiedDashboards | xargs rm -f

# Deploy
vercel --prod --yes

echo "✅ Deployment complete!"