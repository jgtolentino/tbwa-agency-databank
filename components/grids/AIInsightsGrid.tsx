import { useState, useEffect } from 'react'
import { AIBots } from '@/lib/ai-bots'
import { Card } from '@/components/ui/card'

interface AIInsightsGridProps {
  data: any[]
  aggregated: any
  filters: any
  userRole?: string
}

export function AIInsightsGrid({ data, aggregated, filters, userRole = 'analyst' }: AIInsightsGridProps) {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedBot, setSelectedBot] = useState<'aladdin' | 'retailbot' | 'adsbot'>('aladdin')

  const generateInsights = async (type: string) => {
    setLoading(true)
    try {
      let response
      
      switch (selectedBot) {
        case 'aladdin':
          response = await AIBots.genie.generate(
            `Generate ${type} insights for the current data`,
            { metrics: aggregated, filters },
            userRole
          )
          break
        case 'retailbot':
          response = await AIBots.retailBot.analyze(
            `What are the key ${type} insights?`,
            aggregated
          )
          break
        case 'adsbot':
          response = await AIBots.adsBot.analyze(
            aggregated,
            ['performance', 'trends', 'optimization']
          )
          break
      }
      
      setInsights(response)
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Bot Selector */}
      <div className="card col-span-full">
        <div className="card-header">
          <h4>AI Assistant Selection</h4>
          <select 
            value={selectedBot} 
            onChange={(e) => setSelectedBot(e.target.value as any)}
            className="text-sm px-3 py-1 border rounded"
          >
            <option value="aladdin">🧞 Aladdin Insights</option>
            <option value="retailbot">🏪 RetailBot</option>
            <option value="adsbot">📢 AdsBot</option>
          </select>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => generateInsights('executive-summary')}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Executive Summary
            </button>
            <button
              onClick={() => generateInsights('anomaly')}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            >
              Detect Anomalies
            </button>
            <button
              onClick={() => generateInsights('trends')}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Trend Analysis
            </button>
            <button
              onClick={() => generateInsights('what-if')}
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
            >
              What-If Scenario
            </button>
          </div>
        </div>
      </div>

      {/* Query Box */}
      <div className="card">
        <div className="card-header">
          <h4>Ask a Question</h4>
        </div>
        <div className="card-body">
          <textarea
            className="w-full p-3 border rounded-lg resize-none"
            rows={3}
            placeholder="Type your question here..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                // Handle query submission
              }
            }}
          />
          <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Get Answer
          </button>
        </div>
      </div>

      {/* Insights Display */}
      {insights && (
        <>
          <div className="card col-span-full md:col-span-2">
            <div className="card-header">
              <h4>AI Analysis</h4>
              <span className="text-xs text-gray-500">
                {new Date(insights.generated_at || Date.now()).toLocaleString()}
              </span>
            </div>
            <div className="card-body">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">
                  {insights.content || insights.analysis || insights.insights}
                </p>
              </div>
              {insights.metadata && (
                <div className="mt-4 text-xs text-gray-500">
                  Model: {insights.metadata.model} | 
                  Confidence: {(insights.metadata.confidence || insights.confidence || 0.9 * 100).toFixed(0)}%
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {(insights.recommendations || insights.optimization_tips) && (
            <div className="card">
              <div className="card-header">
                <h4>Recommendations</h4>
              </div>
              <div className="card-body">
                <ul className="space-y-2">
                  {(insights.recommendations || insights.optimization_tips || []).map((rec: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Metrics */}
          {(insights.metrics || insights.performance_metrics) && (
            <div className="card">
              <div className="card-header">
                <h4>Key Metrics</h4>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(insights.metrics || insights.performance_metrics || {}).map(([key, value]) => (
                    <div key={key} className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-xs text-gray-500 uppercase">{key}</div>
                      <div className="text-lg font-semibold">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="card col-span-full">
          <div className="card-body flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-3 text-sm text-gray-600">Generating insights...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}