import React, { useMemo } from 'react'
import { MapPin, AlertTriangle, Target, TrendingUp, DollarSign, Building } from 'lucide-react'
import { useStoreData } from '../../hooks/useStoreData'

interface GeographicInsightsProps {
  className?: string
}

const GeographicInsights: React.FC<GeographicInsightsProps> = ({ className = '' }) => {
  const { stores, insights, loading, error } = useStoreData()

  const performanceAnalysis = useMemo(() => {
    if (!stores.length) return { clusters: [], risks: [], opportunities: [] }

    // Calculate revenue concentration
    const totalRevenue = stores.reduce((sum, store) => sum + store.revenue, 0)
    const sortedStores = [...stores].sort((a, b) => b.revenue - a.revenue)

    // Performance clusters analysis
    const analyzedStores = stores.filter(s => s.analyzed)
    const networkStores = stores.filter(s => !s.analyzed)

    const clusters = [
      {
        name: 'High Performance Zone',
        description: insights.performance_clusters.high_performance_zone,
        stores: analyzedStores.filter(s => s.performance_tier === 'Top').length,
        avgRevenue: analyzedStores.filter(s => s.performance_tier === 'Top')
          .reduce((sum, s) => sum + s.revenue, 0) / Math.max(1, analyzedStores.filter(s => s.performance_tier === 'Top').length),
        color: 'green'
      },
      {
        name: 'Medium Performance Areas',
        description: 'Stable revenue generators with growth potential',
        stores: stores.filter(s => s.performance_tier === 'Medium').length,
        avgRevenue: stores.filter(s => s.performance_tier === 'Medium')
          .reduce((sum, s) => sum + s.revenue, 0) / Math.max(1, stores.filter(s => s.performance_tier === 'Medium').length),
        color: 'yellow'
      },
      {
        name: 'Underperforming Areas',
        description: insights.performance_clusters.underperforming_areas.join(', '),
        stores: stores.filter(s => s.performance_tier === 'Low').length,
        avgRevenue: stores.filter(s => s.performance_tier === 'Low')
          .reduce((sum, s) => sum + s.revenue, 0) / Math.max(1, stores.filter(s => s.performance_tier === 'Low').length),
        color: 'red'
      }
    ]

    // Risk analysis
    const risks = [
      {
        type: 'Concentration Risk',
        severity: 'high' as const,
        description: `Top store generates ${insights.concentration_risk.store_108_dominance}% of total revenue`,
        impact: 'Business continuity risk if top store fails',
        metric: insights.concentration_risk.store_108_dominance,
        recommendation: insights.concentration_risk.recommendation
      },
      {
        type: 'Geographic Concentration',
        severity: 'medium' as const,
        description: `Top 3 stores account for ${insights.concentration_risk.top_3_stores_share}% of revenue`,
        impact: 'Limited geographic diversification',
        metric: insights.concentration_risk.top_3_stores_share,
        recommendation: 'Expand to southern QC and adjacent cities'
      },
      {
        type: 'Analyzed vs Network Gap',
        severity: 'medium' as const,
        description: `${insights.analyzed_vs_network.performance_gap}% performance gap between analyzed and network stores`,
        impact: 'Significant unrealized revenue potential',
        metric: insights.analyzed_vs_network.performance_gap,
        recommendation: 'Upgrade network stores to analyzed status'
      }
    ]

    // Expansion opportunities
    const opportunities = insights.optimization_priorities.map(priority => ({
      area: priority.area,
      action: priority.action,
      impact: priority.impact,
      type: priority.area.includes('Store 108') ? 'Market Penetration' :
             priority.area.includes('Fairview') ? 'Market Expansion' : 'Optimization',
      priority: priority.area.includes('Store 108') ? 'High' :
               priority.area.includes('Fairview') ? 'Medium' : 'Low'
    }))

    return { clusters, risks, opportunities }
  }, [stores, insights])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700'
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-700'
      case 'low': return 'border-green-200 bg-green-50 text-green-700'
      default: return 'border-gray-200 bg-gray-50 text-gray-700'
    }
  }

  const getClusterColor = (color: string) => {
    switch (color) {
      case 'green': return 'border-green-200 bg-green-50'
      case 'yellow': return 'border-yellow-200 bg-yellow-50'
      case 'red': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Geographic Intelligence</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Building className="w-12 h-12 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p>Loading geographic analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Geographic Intelligence</h3>
        </div>
        <div className="text-center py-8 text-red-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p>Error loading geographic data: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`scout-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Geographic Intelligence</h3>
        </div>
        <div className="text-sm text-gray-500">
          {stores.length} stores analyzed
        </div>
      </div>

      {/* Performance Clusters */}
      <div className="mb-6">
        <h4 className="font-medium text-scout-text mb-3">Performance Clusters</h4>
        <div className="space-y-3">
          {performanceAnalysis.clusters.map((cluster, index) => (
            <div key={index} className={`border rounded-lg p-3 ${getClusterColor(cluster.color)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span className="font-medium text-scout-text">{cluster.name}</span>
                </div>
                <div className="text-sm font-semibold">
                  {cluster.stores} stores
                </div>
              </div>
              <div className="text-sm text-gray-700 mb-2">{cluster.description}</div>
              <div className="text-sm">
                <span className="text-gray-600">Avg Revenue: </span>
                <span className="font-semibold">₱{cluster.avgRevenue.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="mb-6">
        <h4 className="font-medium text-scout-text mb-3">Geographic Risk Assessment</h4>
        <div className="space-y-3">
          {performanceAnalysis.risks.map((risk, index) => (
            <div key={index} className={`border rounded-lg p-3 ${getSeverityColor(risk.severity)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">{risk.type}</span>
                </div>
                <span className="text-sm font-bold">{risk.metric}%</span>
              </div>
              <div className="text-sm mb-2">{risk.description}</div>
              <div className="text-sm mb-2">
                <span className="font-medium">Impact: </span>
                {risk.impact}
              </div>
              <div className="text-xs">
                <span className="font-medium">Recommendation: </span>
                {risk.recommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expansion Opportunities */}
      <div className="mb-6">
        <h4 className="font-medium text-scout-text mb-3">Expansion & Optimization Opportunities</h4>
        <div className="space-y-3">
          {performanceAnalysis.opportunities.map((opportunity, index) => (
            <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">{opportunity.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(opportunity.priority)}`}>
                    {opportunity.priority}
                  </span>
                  <span className="text-xs text-blue-600">{opportunity.type}</span>
                </div>
              </div>
              <div className="text-sm text-blue-800 mb-2">{opportunity.action}</div>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="w-3 h-3 text-green-600" />
                <span className="font-semibold text-green-700">Expected Impact: {opportunity.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <div className="font-medium text-purple-900 mb-2">Geographic Intelligence Summary</div>
            <div className="text-sm text-purple-800 space-y-1">
              <div>• <strong>High concentration risk:</strong> Store 108 dominates with {insights.concentration_risk.store_108_dominance}% market share</div>
              <div>• <strong>Performance gap:</strong> {insights.analyzed_vs_network.performance_gap}% difference between analyzed and network stores</div>
              <div>• <strong>Expansion potential:</strong> {insights.performance_clusters.expansion_opportunities.join(', ')} areas show promise</div>
              <div>• <strong>Revenue opportunity:</strong> ₱{performanceAnalysis.opportunities.reduce((sum, opp) => {
                const amount = parseInt(opp.impact.replace(/[^\d]/g, '')) || 0
                return sum + amount
              }, 0)}K+ monthly potential</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeographicInsights