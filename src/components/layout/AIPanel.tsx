import React, { useState } from 'react'
import { Brain, TrendingUp, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

interface AIPanelProps {
  section: string
}

const AIPanel = ({ section }: AIPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const getInsights = (section: string) => {
    switch (section) {
      case 'transaction-trends':
        return {
          title: 'Transaction Trends Insights',
          insights: [
            '🕐 Peak hours: 7-9 AM and 5-7 PM drive 60% of daily volume',
            '💰 Weekend transactions average 15% higher value',
            '📍 Metro Manila locations show 2x transaction velocity',
            '⏱️ Average transaction duration: 45 seconds'
          ],
          recommendations: [
            'Staff high-traffic locations during peak hours',
            'Promote premium products during weekend rushes',
            'Optimize checkout process to reduce wait times'
          ]
        }
      case 'product-mix':
        return {
          title: 'Product Mix Intelligence', 
          insights: [
            '🚬 Tobacco products account for 35% of transactions',
            '🧴 Personal care frequently bundled with snacks (67%)',
            '🔄 Marlboro → Fortune substitution rate: 23%',
            '📦 3+ item baskets have 40% higher profit margins'
          ],
          recommendations: [
            'Place complementary products near tobacco displays',
            'Stock Fortune when Marlboro inventory is low',
            'Create bundle promotions for 3+ item purchases'
          ]
        }
      case 'consumer-behavior':
        return {
          title: 'Behavioral Pattern Analysis',
          insights: [
            '🗣️ 78% of customers request specific brands',
            '👉 Pointing behavior increases with older demographics',
            '💡 Store suggestions accepted 43% of the time',
            '❓ Uncertainty signals: "May available ba kayo ng..."'
          ],
          recommendations: [
            'Train staff on upselling during uncertainty moments',
            'Position popular brands at eye level',
            'Use visual cues for customers who point'
          ]
        }
      case 'consumer-profiling':
        return {
          title: 'Customer Profile Insights',
          insights: [
            '👨 Male customers: 65% of tobacco purchases',
            '👩 Female customers: 75% of personal care',
            '🏠 Repeat customers from 500m radius: 85%',
            '⏰ Age 25-40 dominates evening transactions'
          ],
          recommendations: [
            'Target male-oriented promos for tobacco',
            'Expand personal care selection for female customers',
            'Implement loyalty programs for nearby residents'
          ]
        }
      default:
        return {
          title: 'AI Analytics Ready',
          insights: ['Select a section to view AI-powered insights'],
          recommendations: ['Navigate through different sections to unlock recommendations']
        }
    }
  }

  const data = getInsights(section)

  return (
    <div className="scout-card">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-scout-secondary" />
          <h3 className="font-semibold text-scout-text">{data.title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Key Insights */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-scout-text">Key Insights</span>
            </div>
            <div className="space-y-2">
              {data.insights.map((insight, index) => (
                <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {insight}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {data.recommendations && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-scout-secondary" />
                <span className="text-sm font-medium text-scout-text">AI Recommendations</span>
              </div>
              <div className="space-y-2">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="text-sm text-scout-text bg-orange-50 p-2 rounded border-l-2 border-scout-secondary">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Interface */}
          <div className="pt-2 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Ask Suqi about this data..."
                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary focus:border-transparent"
              />
              <button className="scout-btn-primary text-sm px-4 py-2">
                Ask Suqi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIPanel