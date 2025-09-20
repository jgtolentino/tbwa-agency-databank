import React, { useMemo } from 'react'
import { Mic, Volume2, MessageSquare, TrendingUp, Users } from 'lucide-react'

interface VoicePattern {
  pattern: string
  keywords: string[]
  intent: string
  frequency: number
  examples: string[]
  confidence: number
}

interface VoicePatternAnalysisProps {
  transcripts: any[]
  className?: string
}

const VoicePatternAnalysis: React.FC<VoicePatternAnalysisProps> = ({ transcripts, className = '' }) => {
  const voiceAnalysis = useMemo(() => {
    if (!transcripts.length) return { patterns: [], totalVoice: 0, insights: [] }

    const validTranscripts = transcripts.filter(t => t.transcript_audio && t.transcript_audio.trim())

    const patterns = [
      {
        pattern: 'Brand Request',
        keywords: ['marlboro', 'lucky', 'philip', 'coca', 'pepsi', 'kopiko'],
        intent: 'Specific Brand Preference',
        examples: [],
        frequency: 0,
        confidence: 0
      },
      {
        pattern: 'Price Inquiry',
        keywords: ['magkano', 'presyo', 'price', 'how much'],
        intent: 'Price Comparison Shopping',
        examples: [],
        frequency: 0,
        confidence: 0
      },
      {
        pattern: 'Quantity Request',
        keywords: ['isa', 'dalawa', 'tatlo', 'one', 'two', 'three', 'pcs', 'pieces'],
        intent: 'Quantity Specification',
        examples: [],
        frequency: 0,
        confidence: 0
      },
      {
        pattern: 'Hesitation Signal',
        keywords: ['hmm', 'ah', 'uhm', 'ano', 'wait'],
        intent: 'Decision Uncertainty',
        examples: [],
        frequency: 0,
        confidence: 0
      },
      {
        pattern: 'Satisfaction Expression',
        keywords: ['salamat', 'thanks', 'ok', 'sige', 'good'],
        intent: 'Purchase Satisfaction',
        examples: [],
        frequency: 0,
        confidence: 0
      }
    ]

    // Analyze each transcript for patterns
    validTranscripts.forEach(transcript => {
      const text = transcript.transcript_audio.toLowerCase()

      patterns.forEach(pattern => {
        const matches = pattern.keywords.filter(keyword => text.includes(keyword))
        if (matches.length > 0) {
          pattern.frequency += 1
          if (pattern.examples.length < 3) {
            pattern.examples.push(transcript.transcript_audio.substring(0, 50) + '...')
          }
        }
      })
    })

    // Calculate confidence and filter relevant patterns
    const analyzedPatterns = patterns
      .map(pattern => ({
        ...pattern,
        frequency: (pattern.frequency / validTranscripts.length) * 100,
        confidence: Math.min(95, Math.max(60, (pattern.frequency / validTranscripts.length) * 100 + 40))
      }))
      .filter(pattern => pattern.frequency > 5)
      .sort((a, b) => b.frequency - a.frequency)

    // Generate insights
    const insights = []

    const brandRequestRate = analyzedPatterns.find(p => p.pattern === 'Brand Request')?.frequency || 0
    if (brandRequestRate > 30) {
      insights.push({
        type: 'Brand Loyalty',
        message: `${brandRequestRate.toFixed(1)}% of customers request specific brands`,
        action: 'Optimize inventory for top-requested brands'
      })
    }

    const hesitationRate = analyzedPatterns.find(p => p.pattern === 'Hesitation Signal')?.frequency || 0
    if (hesitationRate > 15) {
      insights.push({
        type: 'Decision Support',
        message: `${hesitationRate.toFixed(1)}% show hesitation patterns`,
        action: 'Train staff to provide proactive assistance'
      })
    }

    const priceInquiryRate = analyzedPatterns.find(p => p.pattern === 'Price Inquiry')?.frequency || 0
    if (priceInquiryRate > 20) {
      insights.push({
        type: 'Price Transparency',
        message: `${priceInquiryRate.toFixed(1)}% inquire about pricing`,
        action: 'Improve price visibility and display'
      })
    }

    return {
      patterns: analyzedPatterns,
      totalVoice: validTranscripts.length,
      totalTransactions: transcripts.length,
      voiceRate: (validTranscripts.length / transcripts.length) * 100,
      insights
    }
  }, [transcripts])

  if (!transcripts.length) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Mic className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Voice Pattern Analysis</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Volume2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No voice data available for analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`scout-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Voice Pattern Analysis</h3>
        </div>
        <div className="text-sm text-gray-500">
          {voiceAnalysis.totalVoice} voice transactions ({voiceAnalysis.voiceRate.toFixed(1)}%)
        </div>
      </div>

      {/* Voice Coverage Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-scout-text">{voiceAnalysis.totalVoice}</div>
          <div className="text-xs text-gray-600">Voice Captured</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-scout-text">{voiceAnalysis.voiceRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Coverage Rate</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-scout-text">{voiceAnalysis.patterns.length}</div>
          <div className="text-xs text-gray-600">Patterns Found</div>
        </div>
      </div>

      {/* Voice Patterns */}
      {voiceAnalysis.patterns.length > 0 ? (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-scout-text">Detected Speech Patterns</h4>
          {voiceAnalysis.patterns.map((pattern, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-scout-secondary" />
                  <span className="font-medium text-scout-text">{pattern.pattern}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-scout-text">
                    {pattern.frequency.toFixed(1)}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {pattern.confidence.toFixed(0)}% confidence
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-2">{pattern.intent}</div>

              <div className="flex flex-wrap gap-1 mb-3">
                {pattern.keywords.slice(0, 6).map((keyword, i) => (
                  <span key={i} className="px-2 py-1 bg-scout-secondary/10 text-scout-secondary text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>

              {pattern.examples.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Sample phrases:</div>
                  <div className="space-y-1">
                    {pattern.examples.slice(0, 2).map((example, i) => (
                      <div key={i} className="text-xs text-gray-700 bg-gray-50 p-2 rounded italic">
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 mb-6">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No significant voice patterns detected</p>
          <p className="text-sm">Need more voice data for analysis</p>
        </div>
      )}

      {/* Insights */}
      {voiceAnalysis.insights.length > 0 && (
        <div>
          <h4 className="font-medium text-scout-text mb-3">Voice Intelligence Insights</h4>
          <div className="space-y-3">
            {voiceAnalysis.insights.map((insight, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">{insight.type}</div>
                    <div className="text-sm text-blue-800">{insight.message}</div>
                    <div className="text-xs text-blue-600 mt-1">→ {insight.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Volume2 className="w-3 h-3" />
          <span>Filipino + English voice pattern recognition powered by real customer audio data</span>
        </div>
      </div>
    </div>
  )
}

export default VoicePatternAnalysis