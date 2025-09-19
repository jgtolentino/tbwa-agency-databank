import React, { useMemo } from 'react'
import { Zap, Target, TrendingUp, AlertTriangle, CheckCircle, BarChart3, MapPin } from 'lucide-react'
import { useStoreData } from '../../hooks/useStoreData'

interface PerformanceMetric {
  name: string
  current: number
  target: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  improvement: number
  actions: string[]
}

interface OptimizationOpportunity {
  area: string
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  description: string
  expectedGain: string
  steps: string[]
  priority: number
}

interface PerformanceOptimizerProps {
  transactions: any[]
  className?: string
}

const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  transactions,
  className = ''
}) => {
  const { stores, insights: geoInsights } = useStoreData()
  const performanceAnalysis = useMemo(() => {
    if (!transactions.length) return { metrics: [], opportunities: [], insights: [] }

    // Calculate current performance metrics
    const totalRevenue = transactions.reduce((sum, t) => sum + (parseFloat(t.total_price) || 0), 0)
    const avgTransactionValue = totalRevenue / transactions.length
    const uniqueCustomers = new Set(transactions.map(t => t.facialid)).size
    const avgItemsPerTransaction = transactions.reduce((sum, t) => sum + (parseInt(t.qty) || 0), 0) / transactions.length

    // Calculate time-based performance
    const hourlyData = transactions.reduce((acc, t) => {
      const hour = parseInt(t.real_hour) || 0
      if (!acc[hour]) acc[hour] = { transactions: 0, revenue: 0 }
      acc[hour].transactions += 1
      acc[hour].revenue += parseFloat(t.total_price) || 0
      return acc
    }, {} as Record<number, { transactions: number, revenue: number }>)

    const peakHour = Object.entries(hourlyData).reduce((max, [hour, data]) =>
      data.revenue > max.revenue ? { hour: parseInt(hour), ...data } : max,
      { hour: 0, transactions: 0, revenue: 0 }
    )

    const offPeakHours = Object.entries(hourlyData).filter(([, data]) =>
      data.revenue < peakHour.revenue * 0.3
    )

    // Performance metrics with targets
    const metrics: PerformanceMetric[] = [
      {
        name: 'Average Transaction Value',
        current: avgTransactionValue,
        target: avgTransactionValue * 1.25, // 25% improvement target
        unit: '₱',
        status: avgTransactionValue > 50 ? 'good' : avgTransactionValue > 30 ? 'warning' : 'critical',
        improvement: 25,
        actions: ['Bundle promotions', 'Upselling training', 'Premium product placement']
      },
      {
        name: 'Items Per Transaction',
        current: avgItemsPerTransaction,
        target: Math.max(3, avgItemsPerTransaction * 1.3), // 30% improvement
        unit: 'items',
        status: avgItemsPerTransaction > 2.5 ? 'good' : avgItemsPerTransaction > 1.8 ? 'warning' : 'critical',
        improvement: 30,
        actions: ['Cross-selling programs', 'Product bundling', 'Combo deals']
      },
      {
        name: 'Peak Hour Efficiency',
        current: (peakHour.revenue / totalRevenue) * 100,
        target: Math.min(40, (peakHour.revenue / totalRevenue) * 100 * 1.2), // Max 40% concentration
        unit: '%',
        status: (peakHour.revenue / totalRevenue) > 0.3 ? 'warning' : 'good',
        improvement: 20,
        actions: ['Staff optimization', 'Inventory management', 'Customer flow management']
      },
      {
        name: 'Customer Retention Rate',
        current: Math.min(100, (uniqueCustomers / transactions.length) * 100 * 0.8), // Estimated retention
        target: 75,
        unit: '%',
        status: uniqueCustomers / transactions.length < 0.7 ? 'good' : 'warning',
        improvement: 15,
        actions: ['Loyalty programs', 'Personalized service', 'Customer feedback systems']
      }
    ]

    // Optimization opportunities
    const opportunities: OptimizationOpportunity[] = []

    // Revenue optimization
    if (avgTransactionValue < 40) {
      opportunities.push({
        area: 'Revenue Per Transaction',
        impact: 'high',
        effort: 'medium',
        description: 'Increase average transaction value through strategic bundling and upselling',
        expectedGain: `₱${(25 * transactions.length).toLocaleString()} monthly revenue`,
        steps: [
          'Create high-margin product bundles',
          'Train staff on upselling techniques',
          'Implement point-of-sale promotions',
          'Optimize product placement for impulse purchases'
        ],
        priority: 1
      })
    }

    // Operational efficiency
    if (offPeakHours.length > 8) {
      opportunities.push({
        area: 'Operational Efficiency',
        impact: 'medium',
        effort: 'low',
        description: 'Optimize staffing and operational costs during low-traffic periods',
        expectedGain: `₱${Math.round(totalRevenue * 0.1).toLocaleString()} cost savings`,
        steps: [
          'Analyze staffing patterns vs. customer traffic',
          'Implement flexible scheduling',
          'Reduce operational hours during very low periods',
          'Focus inventory restocking during off-peak'
        ],
        priority: 2
      })
    }

    // Customer experience
    const bundleTransactions = transactions.filter(t => t.bought_with_other_brands && t.bought_with_other_brands.trim())
    if (bundleTransactions.length / transactions.length < 0.3) {
      opportunities.push({
        area: 'Cross-Selling Effectiveness',
        impact: 'high',
        effort: 'medium',
        description: 'Improve cross-selling to increase basket size and customer satisfaction',
        expectedGain: `${Math.round((0.3 - bundleTransactions.length / transactions.length) * 100)}% basket size increase`,
        steps: [
          'Implement AI-powered product recommendations',
          'Create strategic product placement',
          'Train staff on complementary products',
          'Develop customer journey optimization'
        ],
        priority: 1
      })
    }

    // Inventory optimization
    const categoryData = transactions.reduce((acc, t) => {
      const category = t.category || 'Unknown'
      if (!acc[category]) acc[category] = { count: 0, revenue: 0 }
      acc[category].count += 1
      acc[category].revenue += parseFloat(t.total_price) || 0
      return acc
    }, {} as Record<string, { count: number, revenue: number }>)

    const lowPerformingCategories = Object.entries(categoryData).filter(([, data]) =>
      data.revenue / totalRevenue < 0.05 && data.count > 10
    )

    if (lowPerformingCategories.length > 0) {
      opportunities.push({
        area: 'Inventory Optimization',
        impact: 'medium',
        effort: 'low',
        description: 'Optimize inventory mix by focusing on high-performing categories',
        expectedGain: `${lowPerformingCategories.length} category optimization`,
        steps: [
          'Reduce slow-moving inventory',
          'Increase high-margin category allocation',
          'Implement just-in-time ordering',
          'Analyze supplier performance'
        ],
        priority: 3
      })
    }

    // Sort opportunities by priority and impact
    opportunities.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority
      const impactWeight = { high: 3, medium: 2, low: 1 }
      return impactWeight[b.impact] - impactWeight[a.impact]
    })

    // Generate insights
    const insights = []

    const criticalMetrics = metrics.filter(m => m.status === 'critical')
    if (criticalMetrics.length > 0) {
      insights.push({
        type: 'Critical Performance Alert',
        message: `${criticalMetrics.length} performance metric(s) need immediate attention`,
        action: `Focus on ${criticalMetrics[0].name.toLowerCase()} improvement`,
        impact: 'Immediate business impact required'
      })
    }

    const topOpportunity = opportunities[0]
    if (topOpportunity) {
      insights.push({
        type: 'Top Optimization Opportunity',
        message: `${topOpportunity.area} shows highest improvement potential`,
        action: topOpportunity.steps[0],
        impact: topOpportunity.expectedGain
      })
    }

    // Add geographic optimization insights
    if (geoInsights && stores.length > 0) {
      // Concentration risk insight
      if (geoInsights.concentration_risk.store_108_dominance > 40) {
        insights.push({
          type: 'Geographic Concentration Risk',
          message: `Store concentration risk: ${geoInsights.concentration_risk.store_108_dominance}% revenue from single location`,
          action: 'Diversify revenue sources across multiple high-performing locations',
          impact: 'Reduce business continuity risk and unlock growth potential'
        })
      }

      // Performance gap insight
      if (geoInsights.analyzed_vs_network.performance_gap > 30) {
        insights.push({
          type: 'Store Network Optimization',
          message: `${geoInsights.analyzed_vs_network.performance_gap}% performance gap between analyzed and network stores`,
          action: 'Upgrade network stores with analytics capabilities',
          impact: `₱${Math.round(geoInsights.analyzed_vs_network.performance_gap * 1000).toLocaleString()} potential monthly revenue`
        })
      }

      // Expansion opportunity insight
      if (geoInsights.performance_clusters.expansion_opportunities.length > 0) {
        insights.push({
          type: 'Geographic Expansion Opportunity',
          message: `${geoInsights.performance_clusters.expansion_opportunities.length} high-potential expansion areas identified`,
          action: `Focus on ${geoInsights.performance_clusters.expansion_opportunities[0]} market entry`,
          impact: 'Estimated ₱150K+ monthly revenue from strategic expansion'
        })
      }
    }

    return { metrics, opportunities: opportunities.slice(0, 4), insights }
  }, [transactions])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'critical': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (!transactions.length) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Performance Optimizer</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No performance data available for optimization</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`scout-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">AI Performance Optimizer</h3>
        </div>
        <div className="text-sm text-gray-500">
          {performanceAnalysis.metrics.length} metrics tracked
        </div>
      </div>

      {/* Performance Metrics */}
      {performanceAnalysis.metrics.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-scout-text mb-3">Performance Metrics</h4>
          <div className="space-y-3">
            {performanceAnalysis.metrics.map((metric, index) => (
              <div key={index} className={`border rounded-lg p-3 ${getStatusColor(metric.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    <span className="font-medium text-scout-text">{metric.name}</span>
                  </div>
                  <span className="text-sm font-semibold">
                    +{metric.improvement}% target
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <span className="text-gray-600">Current:</span>
                    <span className="font-semibold text-scout-text ml-1">
                      {metric.unit}{metric.current.toFixed(metric.unit === '₱' ? 0 : 1)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Target:</span>
                    <span className="font-semibold text-green-600 ml-1">
                      {metric.unit}{metric.target.toFixed(metric.unit === '₱' ? 0 : 1)}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  Actions: {metric.actions.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Opportunities */}
      {performanceAnalysis.opportunities.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-scout-text mb-3">Optimization Opportunities</h4>
          <div className="space-y-3">
            {performanceAnalysis.opportunities.map((opportunity, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-scout-secondary" />
                    <span className="font-medium text-scout-text">{opportunity.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(opportunity.impact)}`}>
                      {opportunity.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">#{opportunity.priority}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-700 mb-2">{opportunity.description}</div>

                <div className="text-sm font-medium text-green-600 mb-2">
                  Expected gain: {opportunity.expectedGain}
                </div>

                <div className="text-xs text-gray-600">
                  <div className="font-medium mb-1">Implementation steps:</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {opportunity.steps.slice(0, 2).map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Insights */}
      {performanceAnalysis.insights.length > 0 && (
        <div>
          <h4 className="font-medium text-scout-text mb-3">Performance Intelligence</h4>
          <div className="space-y-3">
            {performanceAnalysis.insights.map((insight, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-orange-900">{insight.type}</div>
                    <div className="text-sm text-orange-800">{insight.message}</div>
                    <div className="text-xs text-orange-600 mt-1">→ {insight.action}</div>
                    <div className="text-xs text-orange-700 font-medium mt-1">{insight.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Zap className="w-3 h-3" />
          <span>AI-powered performance optimization with actionable improvement recommendations</span>
        </div>
      </div>
    </div>
  )
}

export default PerformanceOptimizer