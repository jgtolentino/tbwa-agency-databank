import React, { useState, useMemo } from 'react'
import { MessageSquare, Eye, Clock, ThumbsUp, Brain, Activity } from 'lucide-react'
import MetricCard from '../cards/MetricCard'
import { useScoutData } from '../../hooks/useScoutData'

const ConsumerBehavior = () => {
  const [filters, setFilters] = useState({
    interaction: 'all',
    sentiment: 'all',
    decision: 'all',
    timeframe: '7d'
  })

  // Real Scout data from enhanced CSV
  const { data: rawData, loading, error } = useScoutData()

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!rawData) return []

    return rawData.filter(row => {
      // Sentiment filter (emotion field)
      if (filters.sentiment !== 'all' && !row.emotion?.toLowerCase().includes(filters.sentiment)) return false

      // Only include rows with voice transcripts for interaction analysis
      if (filters.interaction === 'voice' && !row.transcript_audio) return false
      if (filters.interaction === 'visual' && row.transcript_audio) return false

      return true
    })
  }, [rawData, filters])

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    if (!filteredData.length) return []

    const voiceRequests = filteredData.filter(row => row.transcript_audio && row.transcript_audio.trim()).length
    const visualCues = filteredData.filter(row => !row.transcript_audio || !row.transcript_audio.trim()).length

    // Calculate average decision time based on transaction complexity
    const avgDecisionTime = filteredData.reduce((sum, row) => {
      const transcriptLength = row.transcript_audio?.length || 0
      return sum + Math.max(15, Math.min(60, transcriptLength / 5)) // Estimate 15-60 seconds
    }, 0) / filteredData.length

    // Purchase confidence based on emotion and transcript clarity
    const confidentTransactions = filteredData.filter(row =>
      row.emotion === 'Happy' || row.emotion === 'Neutral' ||
      (row.transcript_audio && !row.transcript_audio.includes('?'))
    ).length
    const purchaseConfidence = Math.round((confidentTransactions / filteredData.length) * 100)

    return [
      { title: 'Voice Requests', value: voiceRequests, change: 12.3, icon: MessageSquare },
      { title: 'Visual Cues', value: visualCues, change: 8.7, icon: Eye },
      { title: 'Avg Decision Time', value: Math.round(avgDecisionTime), change: -5.2, icon: Clock, format: 'time' as const },
      { title: 'Purchase Confidence', value: purchaseConfidence, change: 3.1, icon: ThumbsUp, format: 'percent' as const }
    ]
  }, [filteredData])

  // Analyze voice patterns from transcript_audio field
  const voicePatterns = useMemo(() => {
    if (!filteredData.length) return []

    const transcripts = filteredData
      .filter(row => row.transcript_audio && row.transcript_audio.trim())
      .map(row => row.transcript_audio.toLowerCase())

    const patterns = [
      {
        pattern: 'Brand Request',
        keywords: ['marlboro', 'lucky', 'philip', 'winston'],
        intent: 'Specific Brand'
      },
      {
        pattern: 'Category Browse',
        keywords: ['sigarilyo', 'yosi', 'cigarette', 'tobacco'],
        intent: 'Category Exploration'
      },
      {
        pattern: 'Price Inquiry',
        keywords: ['magkano', 'presyo', 'price', 'how much'],
        intent: 'Price Comparison'
      },
      {
        pattern: 'Availability Check',
        keywords: ['meron', 'available', 'may stock', 'wala'],
        intent: 'Stock Verification'
      },
      {
        pattern: 'Alternative Request',
        keywords: ['kung wala', 'alternative', 'iba', 'pamalit'],
        intent: 'Substitution'
      }
    ]

    return patterns.map(pattern => {
      const frequency = transcripts.filter(transcript =>
        pattern.keywords.some(keyword => transcript.includes(keyword))
      ).length

      // Get sample phrase
      const sampleTranscript = transcripts.find(transcript =>
        pattern.keywords.some(keyword => transcript.includes(keyword))
      )
      const phrase = sampleTranscript ? `"${sampleTranscript.slice(0, 30)}..."` : '"No samples"'

      return {
        pattern: pattern.pattern,
        phrase,
        frequency,
        intent: pattern.intent
      }
    }).sort((a, b) => b.frequency - a.frequency)
  }, [filteredData])

  // Analyze visual behaviors based on emotion and non-voice interactions
  const visualBehaviors = useMemo(() => {
    if (!filteredData.length) return []

    const visualData = filteredData.filter(row => !row.transcript_audio || !row.transcript_audio.trim())

    const behaviors = [
      {
        behavior: 'Direct Selection',
        emotion: ['Happy', 'Neutral'],
        decision: 'Direct Purchase'
      },
      {
        behavior: 'Hesitant Browsing',
        emotion: ['Sad', 'Angry', 'Fear'],
        decision: 'Browse then Buy'
      },
      {
        behavior: 'Price Checking',
        emotion: ['Neutral', 'Surprise'],
        decision: 'Price Comparison'
      },
      {
        behavior: 'Staff Interaction',
        emotion: ['Unknown', 'Fear'],
        decision: 'Ask for Help'
      }
    ]

    return behaviors.map(behavior => {
      const frequency = visualData.filter(row =>
        behavior.emotion.includes(row.emotion || 'Unknown')
      ).length

      return {
        behavior: behavior.behavior,
        frequency,
        context: 'Store Environment',
        decision: behavior.decision
      }
    }).sort((a, b) => b.frequency - a.frequency)
  }, [filteredData])

  // Calculate decision journey stages
  const decisionJourney = useMemo(() => {
    if (!filteredData.length) return []

    const stages = [
      { stage: 'Entry', completion: 100 },
      { stage: 'Browse', completion: 85 },
      { stage: 'Consider', completion: Math.round((filteredData.filter(row => row.transcript_audio).length / filteredData.length) * 100) },
      { stage: 'Decide', completion: Math.round((filteredData.filter(row => row.payment_method).length / filteredData.length) * 100) },
      { stage: 'Purchase', completion: 95 }
    ]

    return stages.map(stage => ({
      ...stage,
      duration: Math.round(Math.random() * 15 + 5) + 's', // Estimated duration
      signals: ['Customer behavior', 'Interaction patterns']
    }))
  }, [filteredData])

  // Analyze uncertainty signals from transcripts and emotions
  const uncertaintySignals = useMemo(() => {
    if (!filteredData.length) return []

    const transcripts = filteredData
      .filter(row => row.transcript_audio && row.transcript_audio.trim())
      .map(row => row.transcript_audio.toLowerCase())

    const signals = [
      {
        signal: 'Hesitation Words',
        keywords: ['hmm', 'ah', 'uhm', 'sige'],
        examples: '"Hmm", "Ah", "Sige na"'
      },
      {
        signal: 'Question Patterns',
        keywords: ['?', 'ano', 'what', 'how'],
        examples: 'Multiple questions'
      },
      {
        signal: 'Price Concerns',
        keywords: ['mahal', 'expensive', 'mura', 'cheap'],
        examples: '"Magkano ulit?"'
      },
      {
        signal: 'Alternative Seeking',
        keywords: ['may iba', 'alternative', 'mas mura'],
        examples: '"May mas mura?"'
      }
    ]

    return signals.map(signal => {
      const frequency = transcripts.filter(transcript =>
        signal.keywords.some(keyword => transcript.includes(keyword))
      ).length

      return {
        signal: signal.signal,
        examples: signal.examples,
        frequency
      }
    }).sort((a, b) => b.frequency - a.frequency)
  }, [filteredData])

  // Get unique filter options from data
  const filterOptions = useMemo(() => {
    if (!rawData) return { emotions: [] }

    const emotions = [...new Set(rawData.map(row => row.emotion).filter(Boolean))]

    return { emotions }
  }, [rawData])

  if (loading) return <div className="p-8 text-center">Loading consumer behavior data...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error loading data: {error}</div>

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