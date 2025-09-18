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

  // Business Health Metrics
  const businessMetrics: BusinessMetric[] = [
    {
      label: 'Revenue Today',
      value: '₱135,785',
      change: -13.1,
      status: 'amber',
      target: '₱155K'
    },
    {
      label: 'MTD Revenue',
      value: '₱2.8M',
      change: 8.0,
      status: 'green',
      target: '₱3.2M'
    },
    {
      label: 'Avg Basket Size',
      value: '2.4 items',
      change: -20.0,
      status: 'red',
      target: '3.0 items'
    },
    {
      label: 'Transaction Velocity',
      value: '649 daily',
      change: 5.2,
      status: 'green',
      target: '700'
    },
    {
      label: 'Peak Utilization',
      value: '52.7%',
      change: 2.3,
      status: 'amber',
      target: '60%'
    },
    {
      label: 'Store Concentration',
      value: '44.6%',
      change: 0,
      status: 'red',
      target: '<30%'
    }
  ]

  // Strategic Opportunities
  const opportunities: StrategicOpportunity[] = [
    {
      title: 'Basket Expansion',
      currentState: '74.5% single-item transactions',
      action: 'Create ₱120 bundle strategy',
      impact: '+₱200K/month',
      priority: 'high',
      timeframe: '2 weeks'
    },
    {
      title: 'Store 108 Model Replication',
      currentState: '44.6% revenue concentration',
      action: 'Clone high-performance model 2x',
      impact: '+₱500K/month',
      priority: 'high',
      timeframe: '6 weeks'
    },
    {
      title: 'Morning Optimization',
      currentState: '52.7% revenue in AM hours',
      action: 'Redistribute staff allocation',
      impact: '+₱50K savings/month',
      priority: 'medium',
      timeframe: '1 week'
    },
    {
      title: 'Payment Evolution',
      currentState: '100% cash transactions',
      action: 'E-wallet pilot for ₱200+ purchases',
      impact: '+₱150K/month',
      priority: 'medium',
      timeframe: '4 weeks'
    }
  ]

  // Decision Triggers
  const decisionTriggers: DecisionTrigger[] = [
    {
      condition: 'Basket size < 2.0 items',
      action: 'Emergency bundle promotion',
      threshold: '2.4 current',
      status: 'triggered'
    },
    {
      condition: 'Morning queue > 5 minutes',
      action: 'Add staff immediately',
      threshold: '3.2 avg',
      status: 'active'
    },
    {
      condition: 'Stockout rate > 15%',
      action: 'Supplier escalation',
      threshold: '12% current',
      status: 'active'
    },
    {
      condition: 'Store 108 dependency > 45%',
      action: 'Accelerate expansion',
      threshold: '44.6% current',
      status: 'triggered'
    }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdate(new Date())
      setRefreshing(false)
    }, 1500)
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
          <h1 className="text-2xl font-bold text-scout-text">Executive Overview</h1>
          <p className="text-gray-600">Strategic command center for Scout network performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 bg-scout-accent text-white rounded-lg hover:bg-scout-secondary transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {businessMetrics.map((metric, index) => (
          <div key={index} className="scout-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">{metric.label}</span>
              {getStatusIcon(metric.status)}
            </div>
            <div className="text-lg font-bold text-scout-text mb-1">{metric.value}</div>
            <div className="flex items-center justify-between">
              {getChangeIndicator(metric.change)}
              {metric.target && (
                <span className="text-xs text-gray-500">Target: {metric.target}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategic Opportunities */}
        <div className="scout-card p-6">
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
        <div className="scout-card p-6">
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
            <div className="flex justify-between">
              <span className="text-gray-600">Top Category:</span>
              <span className="font-medium">Snacks (35%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Growth:</span>
              <span className="font-medium">Personal Care (+18%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Switching:</span>
              <span className="font-medium">231 events</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bundle Sweet Spot:</span>
              <span className="font-medium">₱136 (3 items)</span>
            </div>
          </div>
        </div>

        {/* Customer Behavior */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Shopper Patterns</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Segments:</span>
              <span className="font-medium">Conv. 58%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Brand Loyalty:</span>
              <span className="font-medium">64.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Peak Behavior:</span>
              <span className="font-medium">AM planned</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Demo Skew:</span>
              <span className="font-medium">Working age</span>
            </div>
          </div>
        </div>

        {/* Operational Excellence */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Operations</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Top 3 Stores:</span>
              <span className="font-medium">68% revenue</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stockout Risk:</span>
              <span className="font-medium text-red-600">12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Staffing:</span>
              <span className="font-medium">Eve +60%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Queue Peak:</span>
              <span className="font-medium">5-7 PM</span>
            </div>
          </div>
        </div>

        {/* Growth Indicators */}
        <div className="scout-card p-4">
          <h4 className="font-medium text-scout-text mb-3">Growth Potential</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Weekend:</span>
              <span className="font-medium text-green-600">+40% opp</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Digital Ready:</span>
              <span className="font-medium">0% e-wallet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cross-sell:</span>
              <span className="font-medium">35% open</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Geographic:</span>
              <span className="font-medium">3 areas ID'd</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Triggers */}
      <div className="scout-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Decision Triggers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decisionTriggers.map((trigger, index) => (
            <div key={index} className={`p-4 rounded-lg border ${
              trigger.status === 'triggered' ? 'border-red-300 bg-red-50' :
              trigger.status === 'resolved' ? 'border-green-300 bg-green-50' :
              'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{trigger.condition}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  trigger.status === 'triggered' ? 'bg-red-100 text-red-800' :
                  trigger.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trigger.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{trigger.action}</p>
              <p className="text-xs text-gray-500">Current: {trigger.threshold}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Actions */}
      <div className="scout-card p-6 bg-blue-50 border-l-4 border-scout-accent">
        <h4 className="font-medium text-scout-text mb-3">Decisions Required This Week</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-medium mb-2">Immediate Actions:</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Approve ₱120 bundle pricing strategy</li>
              <li>• Authorize Store 108 replication study</li>
              <li>• Implement morning shift changes</li>
              <li>• Select e-wallet provider for pilot</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Watch Items:</h5>
            <ul className="space-y-1 text-gray-700">
              <li>• Detergent switching volatility</li>
              <li>• Weekend underperformance</li>
              <li>• Single-item transaction opportunity</li>
              <li>• Store concentration risk monitoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveOverview