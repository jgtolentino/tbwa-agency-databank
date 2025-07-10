#!/bin/bash

echo "🔥 STRIPPING ALL MOCK DATA - Real Backend Only"
echo "=============================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create backup
echo "📦 Creating backup before stripping mocks..."
cp -r src src.backup.pre-strip.$(date +%Y%m%d_%H%M%S)

echo -e "\n1. Removing mock files and directories..."
echo "-----------------------------------------"

# Remove all mock files
rm -rf src/mocks
echo -e "${GREEN}✅ Removed src/mocks directory${NC}"

# Remove mock service if exists
rm -f src/services/mockService.ts
echo -e "${GREEN}✅ Removed mockService.ts${NC}"

echo -e "\n2. Cleaning up CampaignDashboard.tsx..."
echo "----------------------------------------"

# Remove ALL mock data from CampaignDashboard
cat > src/pages/CampaignDashboard.tsx << 'EOF'
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CampaignAnalysisViewer } from '@/components/CampaignAnalysisViewer';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Target, Users } from 'lucide-react';
import { getCampaignAnalytics } from '@/services/campaignService';
import { toast } from '@/hooks/use-toast';

export default function CampaignDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCampaignAnalytics();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data. Please check your backend connection.');
      toast({
        title: 'Error loading dashboard',
        description: 'Unable to connect to backend services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaign data...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'No data available'}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const COLORS = ['#FF006E', '#8338EC', '#3A86FF', '#06FFA5'];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Campaign Intelligence Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeCampaigns} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CES Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.avgCESScore}</div>
            <p className="text-xs text-muted-foreground">
              +{dashboardData.cesImprovement}% from last quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalReach}</div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awards Won</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.awardsWon}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CES Score Trend */}
            <Card>
              <CardHeader>
                <CardTitle>CES Score Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.cesScoreTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#FF006E" name="CES Score" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Campaign Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.campaignTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dashboardData.campaignTypes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentCampaigns.map((campaign: any) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.brand} • {campaign.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{campaign.cesScore}</div>
                      <p className="text-sm text-gray-600">CES Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dashboardData.performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#FF006E" name="Current" />
                  <Bar dataKey="target" fill="#3A86FF" name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <CampaignAnalysisViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
EOF

echo -e "${GREEN}✅ Cleaned CampaignDashboard.tsx - real data only${NC}"

echo -e "\n3. Cleaning up videoAnalysis.ts..."
echo "-----------------------------------"

# Remove ALL mock references from videoAnalysis
sed -i '' '/import.*mock/d' src/services/videoAnalysis.ts
sed -i '' '/generateMock/d' src/services/videoAnalysis.ts
sed -i '' '/generateEnrichedMockAnalysis/d' src/services/videoAnalysis.ts

# Replace mock fallbacks with proper error handling
sed -i '' 's/if (isDevelopment) {[^}]*return generateEnrichedMockAnalysis[^}]*}/throw new Error("Backend service unavailable");/g' src/services/videoAnalysis.ts

echo -e "${GREEN}✅ Cleaned videoAnalysis.ts - real API only${NC}"

echo -e "\n4. Cleaning up CampaignAnalysisViewer.tsx..."
echo "---------------------------------------------"

# Remove mock response generation
sed -i '' '/generateMockQueryResponse/d' src/components/CampaignAnalysisViewer.tsx
sed -i '' 's/const mockResponse.*/\/\/ Real API call only/g' src/components/CampaignAnalysisViewer.tsx
sed -i '' 's/if (import.meta.env.DEV && mockResponse).*/\/\/ No mock fallback/g' src/components/CampaignAnalysisViewer.tsx
sed -i '' 's/setQueryResponse(mockResponse);/setQueryResponse({ error: "Backend required" });/g' src/components/CampaignAnalysisViewer.tsx

echo -e "${GREEN}✅ Cleaned CampaignAnalysisViewer.tsx${NC}"

echo -e "\n5. Updating campaignService.ts for real API only..."
echo "----------------------------------------------------"

# Create a clean campaign service
cat > src/services/campaignService.ts << 'EOF'
import { API_BASE_URL, CAMPAIGN_API_ENDPOINTS } from '@/config/api';

export interface CampaignAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  avgCESScore: number;
  cesImprovement: number;
  totalReach: string;
  awardsWon: number;
  cesScoreTrend: Array<{ month: string; score: number }>;
  campaignTypes: Array<{ name: string; value: number }>;
  recentCampaigns: Array<{
    id: string;
    name: string;
    brand: string;
    type: string;
    cesScore: number;
  }>;
  performanceMetrics: Array<{
    metric: string;
    current: number;
    target: number;
  }>;
}

export async function getCampaignAnalytics(): Promise<CampaignAnalytics> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.analytics}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch campaign analytics: ${response.statusText}`);
  }

  return response.json();
}

export async function getCampaignDetails(campaignId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.details}/${campaignId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch campaign details: ${response.statusText}`);
  }

  return response.json();
}

export async function searchCampaigns(query: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search campaigns: ${response.statusText}`);
  }

  return response.json();
}

export async function getBenchmarks(campaignType: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.benchmarks}?type=${campaignType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch benchmarks: ${response.statusText}`);
  }

  return response.json();
}
EOF

echo -e "${GREEN}✅ Created clean campaignService.ts - real API only${NC}"

echo -e "\n6. Removing mock imports from all files..."
echo "-------------------------------------------"

# Remove all mock imports
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' '/import.*mock/d' {} \;
find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' '/from.*mock/d' {} \;

echo -e "${GREEN}✅ Removed all mock imports${NC}"

echo -e "\n7. Updating vite.config.ts to exclude any mock remnants..."
echo "------------------------------------------------------------"

# Ensure vite config excludes mocks in build
if ! grep -q "rollupOptions" vite.config.ts; then
  sed -i '' '/export default defineConfig/i\
const isProduction = process.env.NODE_ENV === "production";\
' vite.config.ts
  
  sed -i '' 's/export default defineConfig({/export default defineConfig({\
  build: {\
    rollupOptions: {\
      external: isProduction ? ["*mock*"] : []\
    }\
  },/' vite.config.ts
fi

echo -e "${GREEN}✅ Updated vite.config.ts${NC}"

echo -e "\n8. Final cleanup..."
echo "--------------------"

# Remove any remaining mock patterns
grep -rl "mockData\|fakeData\|generateMock\|dummyData" src --include="*.ts" --include="*.tsx" | while read file; do
  echo "Cleaning $file..."
  sed -i '' '/mockData/d' "$file"
  sed -i '' '/fakeData/d' "$file"
  sed -i '' '/generateMock/d' "$file"
  sed -i '' '/dummyData/d' "$file"
done

echo -e "${GREEN}✅ Final cleanup complete${NC}"

echo -e "\n================================================="
echo -e "${GREEN}🎉 ALL MOCKS STRIPPED - Real Backend Only!${NC}"
echo "================================================="
echo ""
echo "Summary:"
echo "✅ Removed all mock files and directories"
echo "✅ Cleaned all components to use real API only"
echo "✅ Updated services to throw errors instead of mock fallbacks"
echo "✅ Created clean API service implementations"
echo "✅ Removed all mock imports"
echo ""
echo "Next steps:"
echo "1. Ensure your backend is running"
echo "2. Update .env with real backend URL"
echo "3. Run: npm run dev"
echo "4. Run: npm run verify-backend-strict"
echo ""
echo "Backup saved at: src.backup.pre-strip.$(date +%Y%m%d_%H%M%S)/"