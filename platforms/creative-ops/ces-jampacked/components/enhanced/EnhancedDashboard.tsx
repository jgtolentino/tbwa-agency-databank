import React, { useState, useEffect } from 'react'
import { Download, RefreshCw, Calendar, MapPin, Package, Filter } from 'lucide-react'
import { getRealAnalytics, type RealAnalytics, type FilterOptions } from '../../services/realDataService'
import StorePerformanceMap from '../maps/StorePerformanceMap'
import GeographicInsights from '../ai/GeographicInsights'
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

// Real Analytics Hook with Filters
const useRealAnalytics = (filters?: FilterOptions) => {
  const [data, setData] = useState<RealAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const analytics = await getRealAnalytics(filters)
        setData(analytics)
        setError(null)
      } catch (err) {
        console.error('Failed to load analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters])

  const refresh = async () => {
    try {
      setLoading(true)
      const analytics = await getRealAnalytics(filters)
      setData(analytics)
      setError(null)
    } catch (err) {
      console.error('Failed to refresh analytics:', err)
      setError('Failed to refresh analytics data')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refresh }
}

export const EnhancedTransactionTrends = () => {
  const [activeTab, setActiveTab] = useState('Volume')
  const tabs = ['Volume', 'Revenue', 'Basket Size', 'Duration']
  const { data: realData, loading, error } = useRealAnalytics()

  // Transform real data for charts
  const getTransactionData = () => {
    if (!realData || loading) return []
    return realData.transactionTrends.map((trend, index) => ({
      date: trend.period,
      transactions: trend.volume,
      revenue: trend.revenue,
      basketSize: trend.avgBasketSize || 2.4,
      duration: 42 + (index % 10) // Mock duration for now
    }))
  }

  const transactionData = getTransactionData()

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
          title="Total Volume"
          value={loading ? "Loading..." : realData ? realData.executiveMetrics.totalTransactions.toLocaleString() : "N/A"}
          change={loading ? 0 : realData?.executiveMetrics.transactionGrowth || 0}
          trend={!realData ? "neutral" : realData.executiveMetrics.transactionGrowth > 0 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Total Revenue"
          value={loading ? "Loading..." : realData ? `₱${realData.executiveMetrics.totalRevenue.toLocaleString()}` : "N/A"}
          change={loading ? 0 : realData?.executiveMetrics.revenueGrowth || 0}
          trend={!realData ? "neutral" : realData.executiveMetrics.revenueGrowth > 0 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Basket Size"
          value={loading ? "Loading..." : realData ? realData.executiveMetrics.avgBasketSize.toFixed(1) : "N/A"}
          change={loading ? 0 : realData?.executiveMetrics.basketSizeGrowth || 0}
          trend={!realData ? "neutral" : realData.executiveMetrics.basketSizeGrowth > 0 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Order Value"
          value={loading ? "Loading..." : realData ? `₱${realData.executiveMetrics.avgOrderValue.toFixed(0)}` : "N/A"}
          change={loading ? 0 : realData?.executiveMetrics.revenueGrowth || 0}
          trend={!realData ? "neutral" : realData.executiveMetrics.revenueGrowth > 0 ? "up" : "down"}
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
              {loading ? (
                <div className="h-64 flex items-center justify-center text-gray-500">Loading transaction data...</div>
              ) : (
                <>
                  <TransactionAreaChart data={transactionData} />
                  {realData && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                      <p className="text-sm font-medium text-scout-text">Volume Analysis</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total {realData.executiveMetrics.totalTransactions.toLocaleString()} transactions with
                        {realData.executiveMetrics.transactionGrowth > 0 ? ' +' : ' '}
                        {realData.executiveMetrics.transactionGrowth.toFixed(1)}% growth trend.
                        Peak period: {realData.transactionTrends.reduce((max, t) => t.volume > max.volume ? t : max, realData.transactionTrends[0])?.period || 'N/A'}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {activeTab === 'Revenue' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Revenue & Transaction Correlation</h3>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-gray-500">Loading revenue data...</div>
              ) : (
                <>
                  <RevenueChart data={transactionData} />
                  {realData && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-scout-success">
                      <p className="text-sm font-medium text-scout-text">Revenue Insights</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Total revenue: ₱{realData.executiveMetrics.totalRevenue.toLocaleString()} with
                        {realData.executiveMetrics.revenueGrowth > 0 ? ' +' : ' '}
                        {realData.executiveMetrics.revenueGrowth.toFixed(1)}% growth.
                        Avg order value: ₱{realData.executiveMetrics.avgOrderValue.toFixed(0)}
                      </p>
                    </div>
                  )}
                </>
              )}
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
  const { data: realData, loading, error } = useRealAnalytics()

  // Transform real product mix data for charts
  const getProductMixData = () => {
    if (!realData || loading) return []
    return realData.productMix.map(product => ({
      name: product.name,
      value: product.percentage,
      growth: product.growth,
      revenue: product.revenue
    }))
  }

  const productMixData = getProductMixData()

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
          title="Active Categories"
          value={loading ? "Loading..." : realData ? realData.productMix.length.toString() : "N/A"}
          change={loading ? 0 : realData ? realData.productMix.filter(p => p.growth > 0).length : 0}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Top Category"
          value={loading ? "Loading..." : realData ? realData.productMix[0]?.name || "N/A" : "N/A"}
          change={loading ? 0 : realData?.productMix[0]?.percentage || 0}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Growth Leaders"
          value={loading ? "Loading..." : realData ? realData.productMix.filter(p => p.growth > 5).length.toString() : "0"}
          change={loading ? 0 : realData ? realData.productMix.filter(p => p.growth > 10).length : 0}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Category Diversity"
          value={loading ? "Loading..." : realData ? `${Math.min(100, realData.productMix.length * 12).toFixed(0)}%` : "N/A"}
          change={loading ? 0 : realData ? realData.productMix.filter(p => p.growth > 0).length / realData.productMix.length * 100 : 0}
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
                  {realData && (
                    <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                      <p className="text-sm font-medium text-scout-text">Key Insight</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {realData.productMix[0]?.name || 'Top category'} leads at {realData.productMix[0]?.percentage.toFixed(1) || 0}% of transactions.
                        {realData.productMix.filter(p => p.growth > 5).length > 0 && (
                          ` Growth opportunities in ${realData.productMix.filter(p => p.growth > 5).map(p => p.name).join(', ')}.`
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Pareto Analysis' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">80/20 Rule: SKU Revenue Distribution</h3>
              <ParetoChart data={productMixData} />
              {realData && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-scout-warning">
                  <p className="text-sm font-medium text-scout-text">Pareto Analysis</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Top 3 categories ({realData.productMix.slice(0, 3).map(p => p.name).join(', ')})
                    account for {realData.productMix.slice(0, 3).reduce((sum, p) => sum + p.percentage, 0).toFixed(1)}%
                    of total transactions, showing strong concentration patterns.
                  </p>
                </div>
              )}
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
  const { data: realData, loading, error } = useRealAnalytics()

  // Transform consumer behavior data
  const getCustomerJourneyData = () => {
    if (!realData || loading) return []
    const behavior = realData.consumerBehavior[0]
    if (!behavior) return []

    const totalCustomers = realData.executiveMetrics.activeCustomers
    return [
      { stage: 'Store Visit', count: totalCustomers },
      { stage: 'Product Browse', count: Math.round(totalCustomers * 0.85) },
      { stage: 'Brand Request', count: Math.round(totalCustomers * behavior.conversionRate / 100) },
      { stage: 'Accept Suggestion', count: Math.round(totalCustomers * behavior.loyaltyScore / 100 * 0.7) },
      { stage: 'Purchase', count: Math.round(totalCustomers * behavior.satisfactionScore / 100 * 0.5) }
    ]
  }

  const customerJourneyData = getCustomerJourneyData()

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
          value={loading ? "Loading..." : realData ? `${realData.consumerBehavior[0]?.conversionRate.toFixed(1) || 0}%` : "N/A"}
          change={loading ? 0 : realData?.consumerBehavior[0]?.conversionRate > 40 ? 3.2 : -1.5}
          trend={!realData ? "neutral" : realData.consumerBehavior[0]?.conversionRate > 40 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Satisfaction Score"
          value={loading ? "Loading..." : realData ? `${realData.consumerBehavior[0]?.satisfactionScore.toFixed(1) || 0}%` : "N/A"}
          change={loading ? 0 : realData?.consumerBehavior[0]?.satisfactionScore > 70 ? 5.1 : -2.3}
          trend={!realData ? "neutral" : realData.consumerBehavior[0]?.satisfactionScore > 70 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Loyalty Score"
          value={loading ? "Loading..." : realData ? `${realData.consumerBehavior[0]?.loyaltyScore.toFixed(1) || 0}%` : "N/A"}
          change={loading ? 0 : realData?.consumerBehavior[0]?.loyaltyScore > 65 ? 2.1 : -1.4}
          trend={!realData ? "neutral" : realData.consumerBehavior[0]?.loyaltyScore > 65 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Frequency"
          value={loading ? "Loading..." : realData ? `${realData.consumerBehavior[0]?.frequency.toFixed(1) || 0}x/mo` : "N/A"}
          change={loading ? 0 : realData?.consumerBehavior[0]?.frequency > 3 ? 7.8 : -3.2}
          trend={!realData ? "neutral" : realData.consumerBehavior[0]?.frequency > 3 ? "up" : "down"}
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
  const { data: realData, loading, error } = useRealAnalytics()

  // Transform profiling data for charts
  const getIncomeData = () => {
    if (!realData || loading) return []
    return realData.consumerProfiling.map(profile => ({
      income: profile.segment,
      percentage: profile.percentage
    }))
  }

  const getUrbanRuralData = () => {
    if (!realData || loading) return []
    const geoData = realData.geographicalIntelligence
    const urban = geoData.filter(g => g.region.includes('Metro') || g.region.includes('City')).reduce((sum, g) => sum + g.percentage, 0)
    return [
      { name: 'Urban', value: urban },
      { name: 'Rural', value: 100 - urban }
    ]
  }

  const incomeData = getIncomeData()
  const urbanRuralData = getUrbanRuralData()

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
          title="Active Customers"
          value={loading ? "Loading..." : realData ? realData.executiveMetrics.activeCustomers.toLocaleString() : "N/A"}
          change={loading ? 0 : realData?.executiveMetrics.customerGrowth || 0}
          trend={!realData ? "neutral" : realData.executiveMetrics.customerGrowth > 0 ? "up" : "down"}
          icon={Package}
        />
        <EnhancedKPICard
          title="Customer Segments"
          value={loading ? "Loading..." : realData ? realData.consumerProfiling.length.toString() : "N/A"}
          change={loading ? 0 : realData ? realData.consumerProfiling.filter(p => p.percentage > 10).length : 0}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Top Segment"
          value={loading ? "Loading..." : realData ? `${realData.consumerProfiling[0]?.percentage.toFixed(0) || 0}%` : "N/A"}
          trend="neutral"
          icon={Package}
        />
        <EnhancedKPICard
          title="Geographic Spread"
          value={loading ? "Loading..." : realData ? `${realData.geographicalIntelligence.length} regions` : "N/A"}
          change={loading ? 0 : realData ? realData.geographicalIntelligence.filter(g => g.growth > 0).length : 0}
          changeType="absolute"
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
  const [activeTab, setActiveTab] = useState('Store Map')
  const tabs = ['Store Map', 'Geographic Insights', 'Performance Analysis']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Geographic Analytics</h2>
          <p className="text-gray-600">Store performance mapping, concentration risk analysis & expansion opportunities</p>
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

      {/* Enhanced KPI Cards - Real data from store analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Top Store"
          value="Store 108"
          subValue="₱1.25M revenue"
          trend="up"
          icon={MapPin}
        />
        <EnhancedKPICard
          title="Store Network"
          value="20 Stores"
          subValue="7 analyzed"
          trend="up"
          icon={MapPin}
        />
        <EnhancedKPICard
          title="Concentration Risk"
          value="44.6%"
          subValue="Store 108 dominance"
          trend="warning"
          icon={MapPin}
        />
        <EnhancedKPICard
          title="Performance Gap"
          value="38%"
          subValue="Analyzed vs Network"
          trend="down"
          icon={MapPin}
        />
      </div>

      {/* Tab Navigation with Real Geographic Components */}
      <div className="scout-card-chart p-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="mt-4">
          {activeTab === 'Store Map' && (
            <div>
              <StorePerformanceMap className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                  <p className="text-sm font-medium text-scout-text">Store Distribution</p>
                  <p className="text-sm text-gray-600 mt-1">
                    20 stores concentrated in Quezon City area. Store 108 on Quezon Ave dominates with
                    ₱1.25M revenue (26.6% market share). 7 stores have advanced analytics enabled.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm font-medium text-scout-text">Performance Insights</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Top performers: Store 108 (₱1.25M), Store 105 Katipunan (₱420K), Store 103 Diliman (₱380K).
                    All analyzed stores show higher avg transaction values (₱200 vs ₱141).
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Geographic Insights' && (
            <div>
              <GeographicInsights className="mb-6" />
              <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <p className="text-sm font-medium text-orange-800">Strategic Recommendations</p>
                <ul className="text-sm text-orange-700 mt-1 space-y-1">
                  <li>• Diversify revenue sources - Store 108 concentration creates business risk</li>
                  <li>• Upgrade network stores to analytics-enabled status for performance boost</li>
                  <li>• Focus expansion on Fairview and southern QC areas</li>
                  <li>• Implement bundle optimization across all analyzed stores</li>
                </ul>
              </div>
            </div>
          )}
          {activeTab === 'Performance Analysis' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Store Performance Analysis</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">Top Performers</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Store 108 - Quezon Ave:</span>
                        <span className="font-medium">₱1.25M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store 105 - Katipunan:</span>
                        <span className="font-medium">₱420K</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store 103 - Diliman:</span>
                        <span className="font-medium">₱380K</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">Growth Opportunities</h4>
                    <div className="space-y-2 text-sm text-orange-700">
                      <div className="flex justify-between">
                        <span>Store 202 - Fairview:</span>
                        <span className="font-medium">₱158K (expansion target)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store 203 - La Mesa:</span>
                        <span className="font-medium">₱152K (optimize)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store 106 - Commonwealth:</span>
                        <span className="font-medium">₱180K (analytics upgrade)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Performance Metrics</h4>
                    <div className="space-y-2 text-sm text-blue-700">
                      <div className="flex justify-between">
                        <span>Analyzed Stores Avg:</span>
                        <span className="font-medium">₱384K revenue</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Stores Avg:</span>
                        <span className="font-medium">₱124K revenue</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance Gap:</span>
                        <span className="font-medium">38% higher</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">Revenue Potential</h4>
                    <div className="space-y-2 text-sm text-purple-700">
                      <div className="flex justify-between">
                        <span>Total Network Revenue:</span>
                        <span className="font-medium">₱4.69M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bundle Opportunities:</span>
                        <span className="font-medium">₱675K potential</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analytics Upgrade Value:</span>
                        <span className="font-medium">₱1.2M+ potential</span>
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
