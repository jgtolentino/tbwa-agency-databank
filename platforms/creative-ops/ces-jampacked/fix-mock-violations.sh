#!/bin/bash

echo "🔧 Fixing Mock Violations for Lions Palette Forge"
echo "================================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Backup before making changes
echo "📦 Creating backup..."
cp -r src src.backup.$(date +%Y%m%d_%H%M%S)

echo -e "\n1. Fixing mockData in CampaignDashboard.tsx..."
echo "----------------------------------------------"

# Fix CampaignDashboard mockData
if [ -f "src/pages/CampaignDashboard.tsx" ]; then
  # Wrap mockData in development check
  sed -i '' 's/const mockData = {/const mockData = import.meta.env.DEV ? {/' src/pages/CampaignDashboard.tsx
  sed -i '' 's/const data = dashboardData || mockData;/const data = dashboardData || (import.meta.env.DEV ? mockData : null);/' src/pages/CampaignDashboard.tsx
  echo -e "${GREEN}✅ Fixed CampaignDashboard.tsx${NC}"
fi

echo -e "\n2. Conditioning mock imports..."
echo "--------------------------------"

# Create a conditional mock service wrapper
cat > src/services/mockService.ts << 'EOF'
/**
 * Conditional Mock Service
 * Only loads mock data in development mode
 */

import { isProduction, isDevelopment } from '@/config/production-guard';

export async function getMockData<T>(mockImportFn: () => Promise<T>): Promise<T | null> {
  if (isDevelopment) {
    return mockImportFn();
  }
  return null;
}

export function useMockFallback<T>(realData: T | null, mockData: T): T | null {
  if (realData !== null) {
    return realData;
  }
  
  if (isDevelopment) {
    console.warn('Using mock data fallback in development mode');
    return mockData;
  }
  
  console.error('No data available and mock fallback disabled in production');
  return null;
}
EOF
echo -e "${GREEN}✅ Created conditional mock service${NC}"

echo -e "\n3. Updating videoAnalysis.ts..."
echo "--------------------------------"

# Fix videoAnalysis service
if [ -f "src/services/videoAnalysis.ts" ]; then
  # Add import for production guard
  sed -i '' '1i\
import { isDevelopment } from "@/config/production-guard";\
' src/services/videoAnalysis.ts
  
  # Wrap mock fallbacks in development checks
  sed -i '' 's/console.warn('\''MCP unavailable, using enriched mock data:'\''[^)]*);/if (isDevelopment) {\
      console.warn('\''MCP unavailable, using enriched mock data:'\'', error);\
      return generateEnrichedMockAnalysis(videoFile.name, metadata);\
    }\
    throw new Error('\''Backend unavailable and mock data disabled in production'\'');/' src/services/videoAnalysis.ts
  
  echo -e "${GREEN}✅ Updated videoAnalysis.ts${NC}"
fi

echo -e "\n4. Updating CampaignAnalysisViewer.tsx..."
echo "------------------------------------------"

# Fix CampaignAnalysisViewer
if [ -f "src/components/CampaignAnalysisViewer.tsx" ]; then
  # Add development check for mock response
  sed -i '' 's/const mockResponse = generateMockQueryResponse/const mockResponse = import.meta.env.DEV ? generateMockQueryResponse/' src/components/CampaignAnalysisViewer.tsx
  
  # Update the usage
  sed -i '' 's/setQueryResponse(mockResponse);/if (import.meta.env.DEV && mockResponse) {\
        setQueryResponse(mockResponse);\
      } else {\
        setQueryResponse({ error: "Backend unavailable" });\
      }/' src/components/CampaignAnalysisViewer.tsx
  
  echo -e "${GREEN}✅ Updated CampaignAnalysisViewer.tsx${NC}"
fi

echo -e "\n5. Creating production build configuration..."
echo "----------------------------------------------"

# Update vite.config.ts to exclude mocks from production
if [ -f "vite.config.ts" ]; then
  # Add production optimizations
  cat >> vite.config.ts << 'EOF'

// Production optimizations
const productionConfig = {
  build: {
    rollupOptions: {
      external: process.env.NODE_ENV === 'production' ? [
        './src/mocks/**/*'
      ] : []
    }
  }
};
EOF
  echo -e "${GREEN}✅ Updated vite.config.ts${NC}"
fi

echo -e "\n6. Adding BackendStatusMonitor to layout..."
echo "--------------------------------------------"

# Check if App.tsx exists and add monitor
if [ -f "src/App.tsx" ]; then
  # Check if BackendStatusMonitor is already imported
  if ! grep -q "BackendStatusMonitor" src/App.tsx; then
    # Add import at the top
    sed -i '' '1a\
import { BackendStatusMonitor } from "./backend-status-monitor";\
' src/App.tsx
    
    # Add component after first div or header
    sed -i '' '/<div.*className.*App/a\
        <BackendStatusMonitor />\
' src/App.tsx
    
    echo -e "${GREEN}✅ Added BackendStatusMonitor to App.tsx${NC}"
  else
    echo -e "${YELLOW}⚠️  BackendStatusMonitor already in App.tsx${NC}"
  fi
fi

echo -e "\n7. Moving backend-status-monitor.tsx to correct location..."
echo "------------------------------------------------------------"

# Move the monitor component to src directory
if [ -f "backend-status-monitor.tsx" ] && [ ! -f "src/backend-status-monitor.tsx" ]; then
  mv backend-status-monitor.tsx src/
  echo -e "${GREEN}✅ Moved backend-status-monitor.tsx to src/${NC}"
fi

echo -e "\n8. Running verification..."
echo "---------------------------"

# Run the strict verification
npm run verify-backend-strict

echo -e "\n================================================="
echo "📊 Fix Summary"
echo "================================================="
echo ""
echo "Applied fixes:"
echo "✅ Wrapped mockData in development checks"
echo "✅ Created conditional mock service"
echo "✅ Updated service fallbacks"
echo "✅ Added production build configuration"
echo "✅ Integrated BackendStatusMonitor"
echo ""
echo "Next steps:"
echo "1. Review the changes"
echo "2. Test the application"
echo "3. Run: npm run verify-backend-strict"
echo "4. If all passes, commit the changes"
echo ""
echo "Backup created at: src.backup.$(date +%Y%m%d_%H%M%S)/"