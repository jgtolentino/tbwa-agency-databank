import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  MapPin,
  Target,
  Zap,
  Calendar,
  RefreshCw,
  Download
} from 'lucide-react'
import StorePerformanceMap from '../maps/StorePerformanceMap'
import { useStoreData } from '../../hooks/useStoreData'
import { getRealAnalytics } from '../../services/realDataService'
import { EnhancedKPICard } from '../charts/AdvancedCharts'

interface ExecutiveOverviewProps {
  className?: string
}

interface BusinessMetric {
  label: string
  value: string
  change: number
  status: 'green' | 'amber' | 'red'
  target?: string
}

interface StrategicOpportunity {
  title: string
  currentState: string
  action: string
  impact: string
  priority: 'high' | 'medium' | 'low'
  timeframe: string
}

interface DecisionTrigger {
  condition: string
  action: string
  threshold: string
  status: 'active' | 'triggered' | 'resolved'
}

const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ className = '' }) => {
  const { stores } = useStoreData()
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [refreshing, setRefreshing] = useState(false)
  const [realData, setRealData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      setLoading(true)
      const analytics = await getRealAnalytics()
      setRealData(analytics)
    } catch (error) {
      console.error('Failed to load real analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Business Health Metrics (Real Data)
  const getBusinessMetrics = (): BusinessMetric[] => {
    if (!realData || loading) {
      return [
        { label: 'Revenue Today', value: 'Loading...', change: 0, status: 'amber' },
        { label: 'MTD Revenue', value: 'Loading...', change: 0, status: 'amber' },
        { label: 'Avg Basket Size', value: 'Loading...', change: 0, status: 'amber' },
        { label: 'Transaction Velocity', value: 'Loading...', change: 0, status: 'amber' },
        { label: 'Peak Utilization', value: 'Loading...', change: 0, status: 'amber' },
        { label: 'Store Concentration', value: 'Loading...', change: 0, status: 'amber' }
      ]
    }

    const exec = realData.executiveMetrics
    return [
      {
        label: 'Daily Revenue',
        value: `₱${(exec.totalRevenue / 30).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`,
        change: exec.revenueGrowth,
        status: exec.revenueGrowth >= 5 ? 'green' : exec.revenueGrowth >= 0 ? 'amber' : 'red',
        target: '₱155K'
      },
      {
        label: 'Total Revenue',
        value: `₱${exec.totalRevenue.toLocaleString('en-PH')}`,
        change: exec.revenueGrowth,
        status: exec.revenueGrowth >= 5 ? 'green' : exec.revenueGrowth >= 0 ? 'amber' : 'red',
        target: '₱3.2M'
      },
      {
        label: 'Avg Basket Size',
        value: `${(exec.avgBasketSize || 0).toFixed(1)} items`,
        change: exec.basketSizeGrowth || 0,
        status: (exec.avgBasketSize || 0) >= 3.0 ? 'green' : (exec.avgBasketSize || 0) >= 2.5 ? 'amber' : 'red',
        target: '3.0 items'
      },
      {
        label: 'Total Transactions',
        value: exec.totalTransactions.toLocaleString(),
        change: exec.transactionGrowth,
        status: exec.transactionGrowth >= 5 ? 'green' : exec.transactionGrowth >= 0 ? 'amber' : 'red',
        target: '700K'
      },
      {
        label: 'Active Customers',
        value: exec.activeCustomers.toLocaleString(),
        change: exec.customerGrowth,
        status: exec.customerGrowth >= 5 ? 'green' : exec.customerGrowth >= 0 ? 'amber' : 'red',
        target: '50K'
      },
      {
        label: 'Top Store Share',
        value: `${(exec.topStoreConcentration || 0).toFixed(1)}%`,
        change: 0,
        status: exec.topStoreConcentration > 45 ? 'red' : exec.topStoreConcentration > 35 ? 'amber' : 'green',
        target: '<30%'
      }
    ]
  }

  const businessMetrics = getBusinessMetrics()

  // Strategic Opportunities (Data-Driven)
  const getStrategicOpportunities = (): StrategicOpportunity[] => {
    if (!realData || loading) {
      return [
        { title: 'Loading...', currentState: 'Analyzing data...', action: 'Please wait...', impact: 'TBD', priority: 'medium', timeframe: 'TBD' }
      ]
    }

    const exec = realData.executiveMetrics
    const opportunities: StrategicOpportunity[] = []

    // Basket Size Opportunity
    if (exec.avgBasketSize < 3.0) {
      const singleItemPct = ((exec.totalTransactions - (exec.totalQuantity - exec.totalTransactions)) / exec.totalTransactions * 100)
      opportunities.push({
        title: 'Basket Expansion Strategy',
        currentState: `${(singleItemPct || 0).toFixed(1)}% single-item transactions`,
        action: 'Implement bundle pricing & cross-sell',
        impact: `+₱${Math.round(exec.totalRevenue * 0.15 / 1000)}K/month`,
        priority: 'high',
        timeframe: '2 weeks'
      })
    }

    // Store Concentration Risk
    if (exec.topStoreConcentration > 40) {
      opportunities.push({
        title: 'Diversification Initiative',
        currentState: `${(exec.topStoreConcentration || 0).toFixed(1)}% revenue concentration`,
        action: 'Expand high-performing store models',
        impact: `+₱${Math.round(exec.totalRevenue * 0.25 / 1000)}K/month`,
        priority: 'high',
        timeframe: '6 weeks'
      })
    }

    // Product Mix Optimization
    const topCategories = realData.productMix.slice(0, 3)
    if (topCategories.length > 0) {
      opportunities.push({
        title: 'Category Growth',
        currentState: `${topCategories[0]?.name || 'N/A'} leads at ${(topCategories[0]?.percentage || 0).toFixed(1)}%`,
        action: 'Optimize category adjacencies',
        impact: `+₱${Math.round(exec.totalRevenue * 0.08 / 1000)}K/month`,
        priority: 'medium',
        timeframe: '3 weeks'
      })
    }

    // Customer Retention
    if (exec.customerGrowth < 5) {
      opportunities.push({
        title: 'Customer Retention',
        currentState: `${exec.customerGrowth.toFixed(1)}% customer growth`,
        action: 'Loyalty program pilot launch',
        impact: `+₱${Math.round(exec.totalRevenue * 0.12 / 1000)}K/month`,
        priority: 'medium',
        timeframe: '4 weeks'
      })
    }

    return opportunities.slice(0, 4) // Limit to top 4
  }

  const opportunities = getStrategicOpportunities()

  // Decision Triggers (Data-Driven)
  const getDecisionTriggers = (): DecisionTrigger[] => {
    if (!realData || loading) {
      return [
        { condition: 'Loading triggers...', action: 'Please wait...', threshold: 'Analyzing...', status: 'active' }
      ]
    }

    const exec = realData.executiveMetrics
    const triggers: DecisionTrigger[] = []

    // Basket Size Alert
    if (exec.avgBasketSize < 2.5) {
      triggers.push({
        condition: 'Basket size below target',
        action: 'Implement bundle promotion strategy',
        threshold: `${exec.avgBasketSize.toFixed(1)} items (target: 3.0)`,
        status: exec.avgBasketSize < 2.0 ? 'triggered' : 'active'
      })
    }

    // Revenue Growth Alert
    if (exec.revenueGrowth < 5) {
      triggers.push({
        condition: 'Revenue growth below 5%',
        action: 'Review pricing and promotion strategy',
        threshold: `${exec.revenueGrowth.toFixed(1)}% growth`,
        status: exec.revenueGrowth < 0 ? 'triggered' : 'active'
      })
    }

    // Store Concentration Risk
    if (exec.topStoreConcentration > 40) {
      triggers.push({
        condition: 'High store concentration risk',
        action: 'Accelerate diversification plan',
        threshold: `${exec.topStoreConcentration.toFixed(1)}% (target: <30%)`,
        status: exec.topStoreConcentration > 45 ? 'triggered' : 'active'
      })
    }

    // Customer Growth Alert
    if (exec.customerGrowth < 3) {
      triggers.push({
        condition: 'Customer acquisition slowing',
        action: 'Launch retention and acquisition campaign',
        threshold: `${exec.customerGrowth.toFixed(1)}% growth (target: 5%+)`,
        status: exec.customerGrowth < 0 ? 'triggered' : 'active'
      })
    }

    return triggers.slice(0, 4) // Limit to top 4 most critical
  }

  const decisionTriggers = getDecisionTriggers()

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadRealData()
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'amber': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'red': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm">
          <TrendingUp className="w-3 h-3 mr-1" />
          +{change}%
        </span>
      )
    } else if (change < 0) {
      return (
        <span className="flex items-center text-red-600 text-sm">
          <TrendingDown className="w-3 h-3 mr-1" />
          {change}%
        </span>
      )
    }
    return <span className="text-gray-500 text-sm">No change</span>
  }

  const statusCounts = businessMetrics.reduce((acc, metric) => {
    acc[metric.status] = (acc[metric.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Executive Overview</h2>
          <p className="text-gray-600">Strategic command center for Scout network performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="scout-btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Status Strip */}
      <div className="scout-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">{statusCounts.green || 0} Green</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">{statusCounts.amber || 0} Amber</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">{statusCounts.red || 0} Red</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Network Health: {statusCounts.green >= 4 ? 'Strong' : statusCounts.red >= 2 ? 'Critical' : 'Moderate'}
          </div>
        </div>
      </div>

      {/* Business Health Pulse */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {businessMetrics.slice(0, 4).map((metric, index) => (
          <EnhancedKPICard
            key={index}
            title={metric.label}
            value={metric.value}
            change={metric.change}
            trend={metric.status === 'green' ? 'up' : metric.status === 'red' ? 'down' : 'neutral'}
            icon={DollarSign}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Opportunities */}
        <div className="scout-card-chart p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-scout-secondary" />
            <h3 className="text-lg font-semibold text-scout-text">Strategic Opportunities</h3>
          </div>
          <div className="space-y-4">
            {opportunities.map((opp, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${getPriorityColor(opp.priority)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-scout-text">{opp.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600">{opp.impact}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      opp.priority === 'high' ? 'bg-red-100 text-red-800' :
                      opp.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {opp.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{opp.currentState}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-scout-text">{opp.action}</span>
                  <span className="text-xs text-gray-500">{opp.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Performance Map */}
        <div className="scout-card-chart p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-scout-secondary" />
            <h3 className="text-lg font-semibold text-scout-text">Network Performance</h3>
          </div>
          <StorePerformanceMap />
        </div>
      </div>

      {/* Critical Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Product Intelligence */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Category Winners</h4>
          <div className="space-y-2 text-sm">
            {loading ? (
              <div className="text-gray-500">Loading product data...</div>
            ) : realData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Category:</span>
                  <span className="font-medium">
                    {realData.productMix[0]?.name || 'N/A'} ({realData.productMix[0]?.percentage.toFixed(1) || 0}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Leader:</span>
                  <span className="font-medium">
                    {realData.productMix.find(p => p.growth > 5)?.name || realData.productMix[1]?.name || 'N/A'}
                    (+{realData.productMix.find(p => p.growth > 5)?.growth.toFixed(1) || realData.productMix[1]?.growth.toFixed(1) || 0}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categories:</span>
                  <span className="font-medium">{realData.productMix.length} active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Basket:</span>
                  <span className="font-medium">₱{realData.executiveMetrics.avgOrderValue.toFixed(0)} ({realData.executiveMetrics.avgBasketSize.toFixed(1)} items)</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Customer Behavior */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Shopper Patterns</h4>
          <div className="space-y-2 text-sm">
            {loading ? (
              <div className="text-gray-500">Loading behavior data...</div>
            ) : realData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Segment:</span>
                  <span className="font-medium">
                    {realData.consumerProfiling[0]?.segment || 'General'} ({realData.consumerProfiling[0]?.percentage.toFixed(1) || 0}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat Rate:</span>
                  <span className="font-medium">{realData.consumerBehavior[0]?.loyaltyScore.toFixed(1) || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Time:</span>
                  <span className="font-medium">
                    {realData.transactionTrends.reduce((max, t) => t.volume > max.volume ? t : max, realData.transactionTrends[0])?.period || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Frequency:</span>
                  <span className="font-medium">{realData.consumerBehavior[0]?.frequency.toFixed(1) || 0}x/month</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Operational Excellence */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Operations</h4>
          <div className="space-y-2 text-sm">
            {loading ? (
              <div className="text-gray-500">Loading operations data...</div>
            ) : realData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Store Concentration:</span>
                  <span className="font-medium">{realData.executiveMetrics.topStoreConcentration.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Region:</span>
                  <span className="font-medium">
                    {realData.geographicalIntelligence[0]?.region || 'N/A'} ({realData.geographicalIntelligence[0]?.percentage.toFixed(1) || 0}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth Rate:</span>
                  <span className="font-medium text-green-600">+{realData.executiveMetrics.revenueGrowth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Stores:</span>
                  <span className="font-medium">{realData.geographicalIntelligence.length} locations</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Growth Potential</h4>
          <div className="space-y-2 text-sm">
            {loading ? (
              <div className="text-gray-500">Loading growth data...</div>
            ) : realData ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue Growth:</span>
                  <span className={`font-medium ${
                    realData.executiveMetrics.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {realData.executiveMetrics.revenueGrowth > 0 ? '+' : ''}{realData.executiveMetrics.revenueGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Growth:</span>
                  <span className={`font-medium ${
                    realData.executiveMetrics.customerGrowth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {realData.executiveMetrics.customerGrowth > 0 ? '+' : ''}{realData.executiveMetrics.customerGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Basket Growth:</span>
                  <span className={`font-medium ${
                    realData.executiveMetrics.basketSizeGrowth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {realData.executiveMetrics.basketSizeGrowth > 0 ? '+' : ''}{realData.executiveMetrics.basketSizeGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Expansion:</span>
                  <span className="font-medium">{realData.geographicalIntelligence.filter(g => g.growth > 5).length} high-growth areas</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Triggers - Enhanced layout */}
      <div className="scout-card p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Zap className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-scout-text">Decision Triggers</h3>
            <p className="text-sm text-gray-600">Automated alerts for critical business conditions</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {decisionTriggers.map((trigger, index) => (
            <div key={index} className={`p-5 rounded-lg border-l-4 ${
              trigger.status === 'triggered' ? 'border-red-500 bg-red-50' :
              trigger.status === 'resolved' ? 'border-green-500 bg-green-50' :
              'border-gray-400 bg-gray-50'
            } hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">{trigger.condition}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  trigger.status === 'triggered' ? 'bg-red-100 text-red-800' :
                  trigger.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trigger.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2 font-medium">{trigger.action}</p>
              <p className="text-xs text-gray-600 bg-white bg-opacity-70 px-2 py-1 rounded">
                Current: {trigger.threshold}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Actions - Enhanced layout */}
      <div className="scout-card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-scout-accent hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-scout-accent bg-opacity-10 rounded-lg">
            <Calendar className="w-6 h-6 text-scout-accent" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-scout-text">Weekly Action Plan</h4>
            <p className="text-sm text-gray-600">Strategic decisions and priority items for this week</p>
          </div>
        </div>
        {loading ? (
          <div className="text-gray-500 text-center py-4">Loading recommendations...</div>
        ) : realData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-70 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h5 className="font-semibold text-gray-800">Immediate Actions</h5>
              </div>
              <ul className="space-y-3 text-sm">
                {realData.executiveMetrics.avgBasketSize < 2.5 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Basket expansion strategy</strong> - Current: {realData.executiveMetrics.avgBasketSize.toFixed(1)} items (Target: 3.0)
                    </span>
                  </li>
                )}
                {realData.executiveMetrics.topStoreConcentration > 40 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Address concentration risk</strong> - Current: {realData.executiveMetrics.topStoreConcentration.toFixed(1)}% (Target: &lt;30%)
                    </span>
                  </li>
                )}
                {realData.executiveMetrics.revenueGrowth < 5 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Revenue optimization review</strong> - Current growth: {realData.executiveMetrics.revenueGrowth.toFixed(1)}%
                    </span>
                  </li>
                )}
                {realData.executiveMetrics.customerGrowth < 3 && (
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span className="text-gray-700">
                      <strong>Customer acquisition campaign</strong> - Growth: {realData.executiveMetrics.customerGrowth.toFixed(1)}%
                    </span>
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-white bg-opacity-70 p-5 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h5 className="font-semibold text-gray-800">Watch Items</h5>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span className="text-gray-700">
                    <strong>Top category performance:</strong> {realData.productMix[0]?.name || 'N/A'} ({realData.productMix[0]?.percentage.toFixed(1) || 0}%)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span className="text-gray-700">
                    <strong>Regional expansion:</strong> {realData.geographicalIntelligence.filter(g => g.growth > 5).length} high-growth areas identified
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span className="text-gray-700">
                    <strong>Customer behavior trends:</strong> Loyalty score at {realData.consumerBehavior[0]?.loyaltyScore.toFixed(1) || 0}%
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span className="text-gray-700">
                    <strong>Product mix optimization:</strong> {realData.productMix.filter(p => p.growth > 5).length} categories showing growth
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">No recommendations available</div>
        )}
      </div>
    </div>
  )
}

export default ExecutiveOverview