import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, AlertCircle, Lightbulb, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react'
import { groqService, type ScoutAnalysisResponse } from '../../services/groqService'
import ScoutAIChat from '../ai/ScoutAIChat'

interface AIPanelProps {
  section: string
}

const AIPanel = ({ section }: AIPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [aiInsights, setAiInsights] = useState<ScoutAnalysisResponse | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate AI insights for the current section
  useEffect(() => {
    generateAIInsights()
  }, [section])

  const generateAIInsights = async () => {
    try {
      setLoading(true)
      const sectionQueries = {
        'transaction-trends': 'Analyze transaction trends and provide key insights about peak hours, volume patterns, and revenue opportunities',
        'product-mix': 'What are the key product mix insights and cross-selling opportunities? Focus on category performance and bundling strategies',
        'consumer-behavior': 'Analyze customer behavior patterns including purchase frequency, basket composition, and loyalty indicators',
        'consumer-profiling': 'What are the main customer segments by demographics, spending patterns, and geographic distribution?',
        'competitive-analysis': 'Provide competitive analysis insights including market positioning and differentiation opportunities',
        'geographical-intelligence': 'Analyze store performance by location, identify expansion opportunities, and geographic revenue patterns'
      }

      const query = sectionQueries[section as keyof typeof sectionQueries] || 'Provide general business insights based on Scout transaction data'
      const response = await groqService.analyzeQuery({ query })
      setAiInsights(response)
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
      setAiInsights(null)
    } finally {
      setLoading(false)
    }
  }

  const getSectionTitle = (section: string) => {
    const titles = {
      'transaction-trends': 'Transaction Trends Intelligence',
      'product-mix': 'Product Mix Intelligence',
      'consumer-behavior': 'Behavioral Pattern Analysis',
      'consumer-profiling': 'Customer Profile Insights',
      'competitive-analysis': 'Competitive Analysis',
      'geographical-intelligence': 'Geographic Intelligence'
    }
    return titles[section as keyof typeof titles] || 'Scout AI Analytics'
  }

  return (
    <>
      <div className="scout-card">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-scout-secondary" />
            <h3 className="font-semibold text-scout-text">{getSectionTitle(section)}</h3>
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-scout-secondary"></div>}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowChat(true)
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Open Scout AI Chat"
            >
              <MessageCircle className="w-4 h-4 text-scout-secondary" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-scout-secondary mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Suqi is analyzing your data...</p>
                </div>
              </div>
            ) : aiInsights ? (
              <>
                {/* AI Answer */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-4 h-4 text-scout-secondary" />
                    <span className="text-sm font-medium text-scout-text">Scout AI Analysis</span>
                  </div>
                  <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-scout-secondary">
                    {aiInsights.answer}
                  </div>
                </div>

                {/* AI Insights */}
                {aiInsights.insights && aiInsights.insights.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-scout-text">Key Insights</span>
                    </div>
                    <div className="space-y-2">
                      {aiInsights.insights.map((insight, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {insight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Metrics */}
                {aiInsights.metrics && aiInsights.metrics.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-scout-text">Key Metrics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {aiInsights.metrics.map((metric, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border">
                          <div className="font-medium text-scout-text">{metric.name}</div>
                          <div className="flex items-center space-x-1">
                            <span className="text-lg font-bold text-scout-secondary">{metric.value}</span>
                            {metric.trend === 'up' && <span className="text-green-500">↗</span>}
                            {metric.trend === 'down' && <span className="text-red-500">↘</span>}
                            {metric.trend === 'stable' && <span className="text-gray-500">→</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Recommendations */}
                {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-scout-secondary" />
                      <span className="text-sm font-medium text-scout-text">AI Recommendations</span>
                    </div>
                    <div className="space-y-2">
                      {aiInsights.recommendations.map((rec, index) => (
                        <div key={index} className="text-sm bg-orange-50 p-3 rounded border-l-2 border-scout-secondary">
                          <div className="font-medium text-scout-text">{rec.action}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Priority: {rec.priority} | Impact: {rec.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No AI insights available</p>
                <button
                  onClick={generateAIInsights}
                  className="text-sm text-scout-secondary hover:underline mt-2"
                >
                  Retry Analysis
                </button>
              </div>
            )}

            {/* Chat Interface */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask Scout AI about this data..."
                  className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setShowChat(true)
                    }
                  }}
                />
                <button
                  onClick={() => setShowChat(true)}
                  className="scout-btn-primary text-sm px-4 py-2"
                >
                  Ask Scout AI
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scout AI Chat Modal */}
      {showChat && (
        <ScoutAIChat
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          initialContext={section}
        />
      )}
    </>
  )
}

export default AIPanel