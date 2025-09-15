import React, { useState } from 'react'
import { MessageSquare, Eye, Clock, ThumbsUp, Brain, Activity } from 'lucide-react'
import MetricCard from '../cards/MetricCard'

const ConsumerBehavior = () => {
  const [filters, setFilters] = useState({
    interaction: 'all',
    sentiment: 'all',
    decision: 'all',
    timeframe: '7d'
  })

  // Mock data - replace with Scout data layer
  const metrics = [
    { title: 'Voice Requests', value: 1847, change: 12.3, icon: MessageSquare },
    { title: 'Visual Cues', value: 892, change: 8.7, icon: Eye },
    { title: 'Avg Decision Time', value: 23, change: -5.2, icon: Clock, format: 'time' as const },
    { title: 'Purchase Confidence', value: 78, change: 3.1, icon: ThumbsUp, format: 'percent' as const }
  ]

  const voicePatterns = [
    { pattern: 'Brand Request', phrase: '"Marlboro po"', frequency: 45, intent: 'Specific Brand' },
    { pattern: 'Category Browse', phrase: '"May sigarilyo kayo?"', frequency: 32, intent: 'Category Exploration' },
    { pattern: 'Price Inquiry', phrase: '"Magkano yung..."', frequency: 28, intent: 'Price Comparison' },
    { pattern: 'Availability Check', phrase: '"Meron pa ba kayong..."', frequency: 24, intent: 'Stock Verification' },
    { pattern: 'Alternative Request', phrase: '"Kung wala, yung..."', frequency: 18, intent: 'Substitution' }
  ]

  const visualBehaviors = [
    { behavior: 'Pointing at Product', frequency: 34, context: 'Behind Counter', decision: 'Direct Purchase' },
    { behavior: 'Looking at Display', frequency: 28, context: 'Counter Area', decision: 'Browse then Buy' },
    { behavior: 'Reading Price Tags', frequency: 22, context: 'Visible Products', decision: 'Price Comparison' },
    { behavior: 'Eye Contact with Staff', frequency: 16, context: 'Uncertainty', decision: 'Ask for Help' }
  ]

  const decisionJourney = [
    { stage: 'Entry', duration: '5s', signals: ['Look around', 'Orient to counter'], completion: 100 },
    { stage: 'Browse', duration: '12s', signals: ['Read displays', 'Eye movement'], completion: 85 },
    { stage: 'Consider', duration: '8s', signals: ['Focus on product', 'Price check'], completion: 67 },
    { stage: 'Decide', duration: '6s', signals: ['Point/speak', 'Confirm choice'], completion: 78 },
    { stage: 'Purchase', duration: '15s', signals: ['Payment', 'Collection'], completion: 95 }
  ]

  const uncertaintySignals = [
    { signal: 'Hesitation Words', examples: '"Hmm", "Ah", "Sige na"', frequency: 42 },
    { signal: 'Repeated Looking', examples: 'Multiple product glances', frequency: 38 },
    { signal: 'Price Double-Check', examples: '"Magkano ulit?"', frequency: 29 },
    { signal: 'Alternative Seeking', examples: '"May mas mura?"', frequency: 25 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-scout-text mb-2">Consumer Behavior Analysis</h2>
        <p className="text-gray-600">Voice patterns, visual cues & purchase decision signals</p>
      </div>

      {/* Filters */}
      <div className="scout-card">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Behavioral Analysis Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Interaction Type</label>
            <select 
              value={filters.interaction}
              onChange={(e) => setFilters({...filters, interaction: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Interactions</option>
              <option value="voice">Voice Only</option>
              <option value="visual">Visual Only</option>
              <option value="mixed">Voice + Visual</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Sentiment</label>
            <select 
              value={filters.sentiment}
              onChange={(e) => setFilters({...filters, sentiment: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Sentiments</option>
              <option value="confident">Confident</option>
              <option value="uncertain">Uncertain</option>
              <option value="browsing">Browsing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Decision Type</label>
            <select 
              value={filters.decision}
              onChange={(e) => setFilters({...filters, decision: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Decisions</option>
              <option value="direct">Direct Purchase</option>
              <option value="comparison">Price Comparison</option>
              <option value="substitution">Substitution</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Timeframe</label>
            <select 
              value={filters.timeframe}
              onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Voice Pattern Analysis */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Voice Pattern Recognition</h3>
        <div className="space-y-4">
          {voicePatterns.map((pattern, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-scout-text">{pattern.pattern}</div>
                <div className="text-sm font-semibold text-scout-secondary">{pattern.frequency}%</div>
              </div>
              <div className="text-sm text-gray-600 mb-2">"{pattern.phrase}"</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Intent: {pattern.intent}</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-scout-secondary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${pattern.frequency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Behavior & Decision Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Visual Behavior Patterns</h3>
          <div className="space-y-3">
            {visualBehaviors.map((behavior, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-scout-text">{behavior.behavior}</div>
                  <div className="text-sm font-semibold text-scout-secondary">{behavior.frequency}%</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Context: {behavior.context}</span>
                  <span>→ {behavior.decision}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Decision Journey Stages</h3>
          <div className="space-y-3">
            {decisionJourney.map((stage, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-scout-text">{stage.stage}</div>
                  <div className="text-sm text-gray-500">Avg: {stage.duration}</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Signals: {stage.signals.join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Completion Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-scout-secondary rounded-full h-2"
                        style={{ width: `${stage.completion}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{stage.completion}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Uncertainty Signals Analysis */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Uncertainty Signals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {uncertaintySignals.map((signal, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-scout-text">{signal.signal}</div>
                <div className="text-sm font-semibold text-red-600">{signal.frequency}%</div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Examples: {signal.examples}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${signal.frequency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Timeline */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Sentiment Flow</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded border-l-4 border-green-500">
            <div>
              <div className="font-medium text-green-800">Confident Customers</div>
              <div className="text-sm text-green-600">Direct requests, quick decisions</div>
            </div>
            <div className="text-2xl font-bold text-green-600">68%</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
            <div>
              <div className="font-medium text-yellow-800">Browsing Customers</div>
              <div className="text-sm text-yellow-600">Exploring options, price-conscious</div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">22%</div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded border-l-4 border-red-500">
            <div>
              <div className="font-medium text-red-800">Uncertain Customers</div>
              <div className="text-sm text-red-600">Hesitation signals, need guidance</div>
            </div>
            <div className="text-2xl font-bold text-red-600">10%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsumerBehavior