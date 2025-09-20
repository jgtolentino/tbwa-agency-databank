import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, Users, Clock, DollarSign, Zap, AlertCircle } from 'lucide-react'
import { scoutAI } from '../../services/scoutAIService'
import type { CrossTabInsight, CrossTabMetric } from '../../types/crossTab'

interface AIInsightsPanelProps {
  className?: string
  autoRefresh?: boolean
  refreshInterval?: number
  insights?: any[] // Accept external insights
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  className = '',
  autoRefresh = false,
  refreshInterval = 300000, // 5 minutes
  insights: externalInsights
}) => {
  const [insights, setInsights] = useState<CrossTabInsight[]>([])
  const [metrics, setMetrics] = useState<CrossTabMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // If external insights are provided, use them instead of generating
    if (externalInsights && Array.isArray(externalInsights)) {
      setInsights(externalInsights.slice(0, 6))
      setLoading(false)
      setLastUpdate(new Date())
    } else {
      generateAIInsights()

      if (autoRefresh) {
        const interval = setInterval(generateAIInsights, refreshInterval)
        return () => clearInterval(interval)
      }
    }
  }, [autoRefresh, refreshInterval, externalInsights])

  const generateAIInsights = async () => {
    setLoading(true)
    try {
      // Generate insights for key business questions
      const queries = [
        'What are the peak shopping hours by product category?',
        'How does basket size vary by payment method?',
        'Which age groups prefer which product categories?',
        'What are the top performing stores by revenue?'
      ]

      const responses = await Promise.all(
        queries.map(query =>
          scoutAI.processQuery({
            query,
            options: {
              includeVisualization: false,
              detailLevel: 'brief',
              maxRecommendations: 2
            }
          })
        )
      )

      // Aggregate insights and metrics
      const allInsights: CrossTabInsight[] = []
      const allMetrics: CrossTabMetric[] = []

      responses.forEach(response => {
        if (response.success && response.data) {
          allInsights.push(...response.data.insights)
          allMetrics.push(...response.data.metrics)
        }
      })

      setInsights(allInsights.slice(0, 6)) // Show top 6 insights
      setMetrics(allMetrics.slice(0, 8)) // Show top 8 metrics
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error generating AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'time_pattern': return <Clock className="w-4 h-4" />
      case 'basket_behavior': return <TrendingUp className="w-4 h-4" />
      case 'demographic_trend': return <Users className="w-4 h-4" />
      case 'substitution_pattern': return <Zap className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getMetricIcon = (name: string) => {
    if (name.toLowerCase().includes('revenue') || name.toLowerCase().includes('value')) {
      return <DollarSign className="w-4 h-4" />
    }
    if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('conversion')) {
      return <TrendingUp className="w-4 h-4" />
    }
    if (name.toLowerCase().includes('customer') || name.toLowerCase().includes('user')) {
      return <Users className="w-4 h-4" />
    }
    return <Brain className="w-4 h-4" />
  }

  const formatChangeDirection = (direction: string, change: number) => {
    const isPositive = direction === 'up'
    const color = isPositive ? 'text-green-600' : 'text-red-600'
    const symbol = isPositive ? '↗' : '↘'

    return (
      <span className={`text-xs ${color} font-medium`}>
        {symbol} {Math.abs(change)}%
      </span>
    )
  }

  if (loading && insights.length === 0) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-scout-secondary animate-pulse" />
          <h3 className="text-lg font-semibold text-scout-text">AI-Generated Insights</h3>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`scout-card p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">AI-Generated Insights</h3>
        </div>
        <div className="text-right">
          <button
            onClick={generateAIInsights}
            disabled={loading}
            className="text-sm text-scout-secondary hover:text-scout-accent transition-colors"
          >
            {loading ? 'Analyzing...' : 'Refresh'}
          </button>
          <div className="text-xs text-gray-500">
            Updated {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Key Performance Metrics</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.isArray(metrics) && metrics.slice(0, 4).map((metric, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                {getMetricIcon(metric.name)}
                <span className="text-xs text-gray-600 truncate">{metric.name}</span>
              </div>
              <div className="text-lg font-semibold text-scout-text">{metric.value}</div>
              {metric.comparison && (
                <div className="mt-1">
                  {formatChangeDirection(metric.comparison.direction, metric.comparison.change)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Smart Insights</h4>
        {Array.isArray(insights) && insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-sm mb-1">{insight.title}</h5>
                <p className="text-sm text-gray-700 mb-2">{insight.finding}</p>
                <div className="text-xs text-gray-600">{insight.context}</div>

                {insight.impact && (
                  <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs">
                    <span className="font-medium">Impact:</span> {insight.impact}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                  insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {insight.priority}
                </span>
              </div>
            </div>
          </div>
        ))}

        {insights.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No insights available. Try refreshing or check your data connection.</p>
          </div>
        )}
      </div>

      {/* Analysis Coverage */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
        <h4 className="font-medium text-scout-text mb-2">AI Analysis Coverage</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>✓ Time-based patterns</div>
          <div>✓ Customer demographics</div>
          <div>✓ Basket behavior</div>
          <div>✓ Product substitution</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Powered by 16 cross-tabulation analyses with real-time data processing
        </p>
      </div>
    </div>
  )
}

export default AIInsightsPanel