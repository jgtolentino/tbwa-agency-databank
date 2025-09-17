import React, { useState } from 'react'
import { Download, RefreshCw, Calendar, MapPin, Package, Filter } from 'lucide-react'
import { 
  TransactionAreaChart, 
  ProductMixPieChart, 
  ProductMixLegend,
  CustomerJourneyFunnel,
  IncomeDistributionChart,
  UrbanRuralChart,
  EnhancedKPICard,
  TabNavigation,
  RevenueChart,
  BasketSizeChart,
  DurationChart,
  ParetoChart,
  SubstitutionChart,
  BasketAnalysisChart,
  RequestMethodsChart,
  AcceptanceRatesChart,
  BehaviorTraitsChart,
  AgeGenderChart,
  LocationChart,
  SegmentBehaviorChart,
  BrandMarketShareChart,
  CategoryCompetitiveChart,
  TimePeriodCompetitiveChart,
  RegionalHeatmapChart,
  StoreLocationChart,
  GeoDemographicsChart,
  ChoroplethMap,
  MercatorChoroplethMap,
  VisxChoroplethMap,
  MapboxChoroplethMap
} from '../charts/AdvancedCharts'

// Enhanced data from Scout dashboard analysis
const transactionData = [
  { date: 'Aug 19', transactions: 487 },
  { date: 'Aug 21', transactions: 523 },
  { date: 'Aug 23', transactions: 601 },
  { date: 'Aug 25', transactions: 578 },
  { date: 'Aug 27', transactions: 649 },
  { date: 'Aug 29', transactions: 612 },
  { date: 'Sep 1', transactions: 689 },
  { date: 'Sep 3', transactions: 734 },
  { date: 'Sep 5', transactions: 712 },
  { date: 'Sep 7', transactions: 756 },
  { date: 'Sep 9', transactions: 681 },
  { date: 'Sep 11', transactions: 723 },
  { date: 'Sep 13', transactions: 698 },
  { date: 'Sep 15', transactions: 742 }
]

const productMixData = [
  { name: 'Beverages', value: 35 },
  { name: 'Snacks', value: 25 },
  { name: 'Personal Care', value: 20 },
  { name: 'Household', value: 15 },
  { name: 'Others', value: 5 }
]

const customerJourneyData = [
  { stage: 'Store Visit', count: 1000 },
  { stage: 'Product Browse', count: 750 },
  { stage: 'Brand Request', count: 500 },
  { stage: 'Accept Suggestion', count: 350 },
  { stage: 'Purchase', count: 250 }
]

const incomeData = [
  { income: 'High', percentage: 25 },
  { income: 'Middle', percentage: 58 },
  { income: 'Low', percentage: 17 }
]

const urbanRuralData = [
  { name: 'Urban', value: 71 },
  { name: 'Rural', value: 29 }
]

export const EnhancedTransactionTrends = () => {
  const [activeTab, setActiveTab] = useState('Volume')
  const tabs = ['Volume', 'Revenue', 'Basket Size', 'Duration']

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-tbwa-black mb-2">Transaction Trends</h2>
          <p className="text-tbwa-black text-opacity-70">Volume, timing & patterns with advanced analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Daily Volume"
          value="649"
          change={12.3}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Daily Revenue"
          value="₱135,785"
          change={-13.1}
          trend="down"
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Basket Size"
          value="2.4"
          change={5.7}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Duration"
          value="42s"
          change={-8.2}
          trend="down"
          icon={Package}
        />
      </div>

      {/* Tab Navigation */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Chart Content */}
        <div className="mt-4">
          {activeTab === 'Volume' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Transaction Volume Trends</h3>
              <TransactionAreaChart data={transactionData} />
            </div>
          )}
          {activeTab === 'Revenue' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Revenue & Transaction Correlation</h3>
              <RevenueChart data={transactionData} />
            </div>
          )}
          {activeTab === 'Basket Size' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Basket Size Trends & Targets</h3>
              <BasketSizeChart data={transactionData} />
            </div>
          )}
          {activeTab === 'Duration' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Transaction Duration & Efficiency</h3>
              <DurationChart data={transactionData} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const EnhancedProductMix = () => {
  const [activeTab, setActiveTab] = useState('Category Mix')
  const tabs = ['Category Mix', 'Pareto Analysis', 'Substitutions', 'Basket Analysis']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Product Mix & SKU Analytics</h2>
          <p className="text-gray-600">Category performance, brand insights & cross-sell analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Total SKUs"
          value="369"
          change={8}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Active SKUs"
          value="342"
          change={5}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="New SKUs"
          value="12"
          change={3}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Category Diversity"
          value="85%"
          change={2.1}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Category Mix' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Product Category Distribution</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductMixPieChart data={productMixData} />
                <div>
                  <ProductMixLegend data={productMixData} />
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                    <p className="text-sm font-medium text-scout-text">Key Insight</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Beverages lead at 35% of transactions, followed by snacks at 25%. 
                      Personal care shows growth potential with 20% share.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Pareto Analysis' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">80/20 Rule: SKU Revenue Distribution</h3>
              <ParetoChart data={productMixData} />
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-scout-warning">
                <p className="text-sm font-medium text-scout-text">Key Finding</p>
                <p className="text-sm text-gray-600 mt-1">
                  Top 20% of SKUs generate 80% of total revenue, confirming the Pareto principle in your product mix.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Substitutions' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Product Substitution Patterns</h3>
              <SubstitutionChart />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                <p className="text-sm font-medium text-scout-text">Substitution Insights</p>
                <p className="text-sm text-gray-600 mt-1">
                  Shampoo substitution has the highest rate at 31%, followed by soap products at 27%.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Basket Analysis' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Market Basket Analysis</h3>
              <BasketAnalysisChart />
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-scout-success">
                <p className="text-sm font-medium text-scout-text">Cross-Sell Opportunities</p>
                <p className="text-sm text-gray-600 mt-1">
                  Chips + Soda has the highest co-occurrence (45%) with strong lift score (1.8x).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const EnhancedConsumerBehavior = () => {
  const [activeTab, setActiveTab] = useState('Purchase Funnel')
  const tabs = ['Purchase Funnel', 'Request Methods', 'Acceptance Rates', 'Behavior Traits']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Consumer Behavior Analytics</h2>
          <p className="text-gray-600">Purchase decisions, patterns & customer journey analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Conversion Rate"
          value="42%"
          change={3.2}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Suggestion Accept"
          value="73.8%"
          change={5.1}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Brand Loyalty"
          value="68%"
          change={-1.4}
          trend="down"
          icon={Package}
        />
        <EnhancedKPICard
          title="Discovery Rate"
          value="23%"
          change={7.8}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Purchase Funnel' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Purchase Journey</h3>
              <CustomerJourneyFunnel data={customerJourneyData} />
              <div className="mt-4 grid grid-cols-5 gap-4">
                {customerJourneyData.map((stage, index) => (
                  <div key={stage.stage} className="text-center">
                    <div className="text-2xl font-bold text-scout-text">{stage.count}</div>
                    <div className="text-sm text-gray-600">{stage.stage}</div>
                    {index < customerJourneyData.length - 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((stage.count / customerJourneyData[index + 1].count - 1) * 100)}% drop
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Request Methods' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Voice vs Visual Request Patterns</h3>
              <RequestMethodsChart />
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border-l-4 border-scout-purple">
                <p className="text-sm font-medium text-scout-text">Request Pattern Insights</p>
                <p className="text-sm text-gray-600 mt-1">
                  Voice requests peak at 6PM (65%) while visual requests dominate during morning hours.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Acceptance Rates' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Suggestion Acceptance by Category</h3>
              <AcceptanceRatesChart />
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-scout-success">
                <p className="text-sm font-medium text-scout-text">Acceptance Analysis</p>
                <p className="text-sm text-gray-600 mt-1">
                  Beverages show highest acceptance rate (78%) with strong confidence score (85%).
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Behavior Traits' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Behavior Traits Distribution</h3>
              <BehaviorTraitsChart />
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                <p className="text-sm font-medium text-scout-text">Behavior Insights</p>
                <p className="text-sm text-gray-600 mt-1">
                  45% of customers are price-sensitive, followed by 38% showing strong brand loyalty.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const EnhancedConsumerProfiling = () => {
  const [activeTab, setActiveTab] = useState('Demographics')
  const tabs = ['Demographics', 'Age & Gender', 'Location', 'Segment Behavior']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Consumer Profiling Analytics</h2>
          <p className="text-gray-600">Demographics, location patterns & customer segmentation</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Total Customers"
          value="11,000"
          change={8.3}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Average Age"
          value="32.5"
          change={0.8}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Gender Split"
          value="48/52"
          trend="neutral"
          icon={Package}
        />
        <EnhancedKPICard
          title="Urban Customers"
          value="71%"
          change={2.1}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Demographics' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Income & Location Distribution</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-scout-text mb-2">Income Distribution</h4>
                  <IncomeDistributionChart data={incomeData} />
                </div>
                <div>
                  <h4 className="text-md font-medium text-scout-text mb-2">Urban vs Rural</h4>
                  <UrbanRuralChart data={urbanRuralData} />
                  <div className="flex justify-center mt-2 space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-sm">Urban 71%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Rural 29%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                <p className="text-sm font-medium text-scout-text">Geographic Insight</p>
                <p className="text-sm text-gray-600 mt-1">
                  Metro Manila accounts for 35% of customers but generates 45% of revenue, 
                  indicating higher spending power in urban areas.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Age & Gender' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Age & Gender Distribution</h3>
              <AgeGenderChart />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                <p className="text-sm font-medium text-scout-text">Demographic Insights</p>
                <p className="text-sm text-gray-600 mt-1">
                  25-34 age group dominates with 35% male and 32% female representation, showing balanced engagement.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Location' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Geographic Distribution & Revenue</h3>
              <LocationChart />
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-scout-warning">
                <p className="text-sm font-medium text-scout-text">Geographic Performance</p>
                <p className="text-sm text-gray-600 mt-1">
                  Metro Manila leads with 45% customer share generating 52% of total revenue.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Segment Behavior' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Segment Performance</h3>
              <SegmentBehaviorChart />
              <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-scout-success">
                <p className="text-sm font-medium text-scout-text">Segment Analysis</p>
                <p className="text-sm text-gray-600 mt-1">
                  High-value customers spend ₱125 on average with 15 visits/month and 92% satisfaction.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Competitive Analysis Section (SimilarWeb-style for in-store customer journey)
export const EnhancedCompetitiveAnalysis = () => {
  const [activeTab, setActiveTab] = useState('Market Share')
  const tabs = ['Market Share', 'Category Performance', 'Time Periods', 'Brand Insights']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Competitive Analysis</h2>
          <p className="text-gray-600">Brand-to-brand comparison across categories, geolocation & time periods</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Market Position"
          value="#2"
          change={1}
          changeType="position"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Market Share"
          value="32%"
          change={4.2}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Competitive Index"
          value="8.7/10"
          change={0.3}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Store Visit Share"
          value="35%"
          change={2.8}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Market Share' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Brand Market Share Comparison</h3>
              <BrandMarketShareChart />
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                <p className="text-sm font-medium text-scout-text">Competitive Insight</p>
                <p className="text-sm text-gray-600 mt-1">
                  Leading in store visits (35%) but conversion rate (28%) trails Competitor B (32%), 
                  indicating opportunity to improve in-store experience and recommendation acceptance.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Category Performance' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Category Performance vs Competitors</h3>
              <CategoryCompetitiveChart />
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                <p className="text-sm font-medium text-scout-text">Category Leadership</p>
                <p className="text-sm text-gray-600 mt-1">
                  Strong performance in Snacks (42% share, +8% growth) and Household (+15% growth), 
                  but losing ground in Personal Care to Competitor A (32% vs our 28%).
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Time Periods' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Performance Trends vs Competition</h3>
              <TimePeriodCompetitiveChart />
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                <p className="text-sm font-medium text-scout-text">Trend Analysis</p>
                <p className="text-sm text-gray-600 mt-1">
                  Consistent outperformance vs competitor average (95% vs 87% in Q4). 
                  Market growth acceleration to 12% presents expansion opportunity.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Brand Insights' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Brand Performance Insights</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Strengths</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Highest store visit conversion (35%)</li>
                      <li>• Strong growth in Household (+15%)</li>
                      <li>• Leading Q4 performance (95%)</li>
                      <li>• Superior customer retention</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Opportunities</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Improve Personal Care positioning</li>
                      <li>• Enhance conversion rates</li>
                      <li>• Expand in growing categories</li>
                      <li>• Capture market growth (+12%)</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Competitive Positioning</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>vs Competitor A:</span>
                        <span className="font-medium">+7% market share</span>
                      </div>
                      <div className="flex justify-between">
                        <span>vs Competitor B:</span>
                        <span className="font-medium">+13% market share</span>
                      </div>
                      <div className="flex justify-between">
                        <span>vs Competitor C:</span>
                        <span className="font-medium">+18% market share</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2">Strategic Recommendations</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Invest in Personal Care category</li>
                      <li>• Optimize in-store experience</li>
                      <li>• Leverage Q4 momentum</li>
                      <li>• Focus on conversion improvement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Geographical Intelligence Section
export const EnhancedGeographicalIntelligence = () => {
  const [activeTab, setActiveTab] = useState('Regional Performance')
  const tabs = ['Regional Performance', 'Store Locations', 'Demographics', 'Market Penetration']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Geographical Intelligence</h2>
          <p className="text-gray-600">Location-based insights, regional performance & market penetration analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Top Region"
          value="Metro Manila"
          subValue="95% performance"
          trend="up"
          icon={MapPin}
        />
        <EnhancedKPICard
          title="Regional Coverage"
          value="6 Regions"
          change={1}
          changeType="absolute"
          trend="up"
          icon={MapPin}
        />
        <EnhancedKPICard
          title="Avg Performance"
          value="78%"
          change={5.2}
          trend="up"
          icon={MapPin}
        />
        <EnhancedKPICard
          title="Market Penetration"
          value="42%"
          change={3.8}
          trend="up"
          icon={MapPin}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Regional Performance' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Philippines Regional Performance Map</h3>
              <MapboxChoroplethMap 
                title="Regional Revenue & Performance Distribution"
                metric="revenue"
              />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                  <p className="text-sm font-medium text-scout-text">Regional Insights</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Metro Manila (NCR) leads with ₱2.85M revenue and 45 stores. 
                    CALABARZON shows highest growth at 14.2% with strong market penetration.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm font-medium text-scout-text">Growth Opportunities</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Central Visayas and Davao Region show balanced performance with 
                    strong growth rates (11.8% and 10.6%) and expanding customer base.
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Store Locations' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Store Location Intelligence</h3>
              <StoreLocationChart />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                <p className="text-sm font-medium text-scout-text">Location Strategy</p>
                <p className="text-sm text-gray-600 mt-1">
                  Standalone stores achieve highest conversion (42%) despite lower foot traffic. 
                  Mall locations generate most revenue (₱450K) through high traffic volume.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Demographics' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Geographic Demographics Distribution</h3>
              <GeoDemographicsChart />
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                <p className="text-sm font-medium text-scout-text">Demographic Patterns</p>
                <p className="text-sm text-gray-600 mt-1">
                  Urban core customers (₱145 avg spend) drive highest revenue per capita. 
                  Suburban 35-44 demographic (35% population) represents growth opportunity.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Market Penetration' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Market Penetration Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">High Penetration Markets</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Metro Manila:</span>
                        <span className="font-medium">65% penetration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cebu:</span>
                        <span className="font-medium">48% penetration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Davao:</span>
                        <span className="font-medium">42% penetration</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">Growth Opportunities</h4>
                    <div className="space-y-2 text-sm text-orange-700">
                      <div className="flex justify-between">
                        <span>Iloilo:</span>
                        <span className="font-medium">28% penetration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Baguio:</span>
                        <span className="font-medium">22% penetration</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cagayan de Oro:</span>
                        <span className="font-medium">35% penetration</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Strategic Recommendations</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Expand in Visayas region (Iloilo focus)</li>
                      <li>• Increase Mindanao presence (Davao base)</li>
                      <li>• Optimize Metro Manila store density</li>
                      <li>• Pilot rural market entry strategies</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Market Potential</h4>
                    <div className="space-y-2 text-sm text-purple-700">
                      <div className="flex justify-between">
                        <span>Addressable Market:</span>
                        <span className="font-medium">₱2.4B</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Capture:</span>
                        <span className="font-medium">₱1.0B (42%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Potential:</span>
                        <span className="font-medium">₱1.4B (58%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
