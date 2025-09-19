import { getRealAnalytics, type RealAnalytics } from './realDataService'

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface ScoutAnalysisRequest {
  query: string
  analytics?: RealAnalytics
  context?: string[]
}

export interface ScoutAnalysisResponse {
  answer: string
  insights: string[]
  recommendations: Array<{
    action: string
    priority: 'high' | 'medium' | 'low'
    impact: string
  }>
  metrics: Array<{
    name: string
    value: string
    trend: 'up' | 'down' | 'stable'
  }>
  confidence: number
}

class GroqService {
  private readonly apiKey: string
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions'
  private readonly model = 'llama3-8b-8192'
  private analytics: RealAnalytics | null = null
  private lastAnalyticsUpdate: Date | null = null

  constructor() {
    // Get the API key from environment variables (try both naming conventions)
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY || ''

    if (!this.apiKey) {
      console.warn('Groq API key not found in environment variables. Please set VITE_GROQ_API_KEY.')
    }
  }

  private async getSystemPrompt(): Promise<string> {
    // Ensure we have fresh analytics data
    if (!this.analytics || !this.lastAnalyticsUpdate ||
        Date.now() - this.lastAnalyticsUpdate.getTime() > 5 * 60 * 1000) {
      try {
        this.analytics = await getRealAnalytics()
        this.lastAnalyticsUpdate = new Date()
      } catch (error) {
        console.error('Failed to load analytics for AI:', error)
      }
    }

    const analyticsContext = this.analytics ? `
CURRENT SCOUT ANALYTICS DATA:

Executive Metrics:
- Total Revenue: ₱${this.analytics.executiveMetrics.totalRevenue.toLocaleString()}
- Total Transactions: ${this.analytics.executiveMetrics.totalTransactions.toLocaleString()}
- Average Order Value: ₱${this.analytics.executiveMetrics.avgOrderValue.toFixed(2)}
- Unique Customers: ${this.analytics.executiveMetrics.uniqueCustomers.toLocaleString()}
- Top Store: ${this.analytics.executiveMetrics.topPerformingStore}
- Revenue Growth: ${this.analytics.executiveMetrics.revenueGrowth.toFixed(1)}%
- Basket Size Growth: ${this.analytics.executiveMetrics.basketSizeGrowth.toFixed(1)}%

Top Product Categories:
${this.analytics.productMix.slice(0, 5).map(p =>
  `- ${p.name}: ${p.percentage.toFixed(1)}% (₱${p.revenue.toLocaleString()}, Growth: ${p.growth.toFixed(1)}%)`
).join('\n')}

Consumer Behavior:
${this.analytics.consumerBehavior.map(b =>
  `- Conversion Rate: ${b.conversionRate.toFixed(1)}%
- Satisfaction Score: ${b.satisfactionScore.toFixed(1)}%
- Loyalty Score: ${b.loyaltyScore.toFixed(1)}%
- Purchase Frequency: ${b.frequency.toFixed(1)}x/month`
).join('\n')}

Top Store Locations:
${this.analytics.geographicalIntelligence.slice(0, 3).map(g =>
  `- ${g.region}: ${g.percentage.toFixed(1)}% (₱${g.revenue.toLocaleString()}, Growth: ${g.growth.toFixed(1)}%)`
).join('\n')}

Transaction Trends (Recent):
${this.analytics.transactionTrends.slice(-7).map(t =>
  `- ${t.period}: ${t.volume} transactions, ₱${t.revenue.toLocaleString()}`
).join('\n')}
` : 'Analytics data not available.'

    return `You are Scout AI, an expert retail analytics assistant for the Scout Dashboard platform. You analyze transaction data, customer behavior, and store performance to provide actionable insights.

${analyticsContext}

CAPABILITIES:
- Analyze transaction trends and patterns
- Provide customer behavior insights
- Recommend business strategies
- Explain retail metrics and KPIs
- Identify growth opportunities
- Suggest operational improvements

RESPONSE FORMAT:
Always provide responses in this structure:
1. Direct answer to the user's question
2. Key insights based on current data
3. Actionable recommendations with priority levels
4. Relevant metrics with trends

TONE: Professional, data-driven, and actionable. Focus on business impact and specific recommendations based on the real Scout data provided above.

CONSTRAINTS:
- Only use data provided in the analytics context
- Always cite specific numbers when making claims
- Provide 2-3 actionable recommendations maximum
- Keep responses concise but comprehensive
- If data is insufficient, clearly state limitations`
  }

  public async analyzeQuery(request: ScoutAnalysisRequest): Promise<ScoutAnalysisResponse> {
    try {
      const systemPrompt = await this.getSystemPrompt()

      const messages: GroqChatMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.query }
      ]

      if (request.context && request.context.length > 0) {
        messages.splice(1, 0, {
          role: 'user',
          content: `Previous context: ${request.context.join(', ')}`
        })
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.3,
          max_tokens: 800,
          top_p: 1,
          stream: false
        })
      })

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`)
      }

      const data: GroqResponse = await response.json()
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I cannot process your request at this time.'

      // Parse the AI response into structured format
      return this.parseAIResponse(aiResponse, request.query)

    } catch (error) {
      console.error('Groq API error:', error)

      // Return fallback response with real data
      return {
        answer: 'I apologize for the technical difficulty. Based on your Scout data, I can provide some general insights.',
        insights: this.generateFallbackInsights(),
        recommendations: this.generateFallbackRecommendations(),
        metrics: this.generateFallbackMetrics(),
        confidence: 0.7
      }
    }
  }

  private parseAIResponse(aiResponse: string, originalQuery: string): ScoutAnalysisResponse {
    // Extract insights and recommendations from AI response
    const lines = aiResponse.split('\n').filter(line => line.trim())

    const insights: string[] = []
    const recommendations: Array<{ action: string; priority: 'high' | 'medium' | 'low'; impact: string }> = []
    const metrics: Array<{ name: string; value: string; trend: 'up' | 'down' | 'stable' }> = []

    // Parse insights (look for bullet points or numbered items)
    lines.forEach(line => {
      if (line.includes('insight') || line.includes('finding') || line.includes('•') || line.includes('-')) {
        insights.push(line.replace(/^\s*[-•]\s*/, '').trim())
      }

      // Parse recommendations
      if (line.includes('recommend') || line.includes('suggest') || line.includes('should')) {
        const priority = line.includes('urgent') || line.includes('critical') ? 'high' :
                        line.includes('consider') || line.includes('optional') ? 'low' : 'medium'

        recommendations.push({
          action: line.replace(/^\s*[-•]\s*/, '').trim(),
          priority,
          impact: 'Revenue optimization'
        })
      }

      // Parse metrics (look for percentages, numbers)
      const metricMatch = line.match(/(\w+):\s*([\d.]+%?)/g)
      if (metricMatch) {
        metricMatch.forEach(match => {
          const [name, value] = match.split(':').map(s => s.trim())
          metrics.push({
            name,
            value,
            trend: 'stable'
          })
        })
      }
    })

    // Add analytics-based metrics if not found in response
    if (metrics.length === 0 && this.analytics) {
      metrics.push(
        { name: 'Revenue Growth', value: `${this.analytics.executiveMetrics.revenueGrowth.toFixed(1)}%`, trend: this.analytics.executiveMetrics.revenueGrowth > 0 ? 'up' : 'down' },
        { name: 'Total Revenue', value: `₱${this.analytics.executiveMetrics.totalRevenue.toLocaleString()}`, trend: 'up' },
        { name: 'Avg Basket Size', value: this.analytics.executiveMetrics.avgBasketSize.toFixed(1), trend: this.analytics.executiveMetrics.basketSizeGrowth > 0 ? 'up' : 'down' }
      )
    }

    return {
      answer: aiResponse,
      insights: insights.slice(0, 3),
      recommendations: recommendations.slice(0, 3),
      metrics: metrics.slice(0, 4),
      confidence: 0.85
    }
  }

  private generateFallbackInsights(): string[] {
    if (!this.analytics) return ['Analytics data is currently unavailable.']

    return [
      `Revenue is ${this.analytics.executiveMetrics.totalRevenue.toLocaleString()} with ${this.analytics.executiveMetrics.revenueGrowth.toFixed(1)}% growth`,
      `Top category ${this.analytics.productMix[0]?.name} represents ${this.analytics.productMix[0]?.percentage.toFixed(1)}% of sales`,
      `Average basket size is ${this.analytics.executiveMetrics.avgBasketSize.toFixed(1)} items`
    ]
  }

  private generateFallbackRecommendations(): Array<{ action: string; priority: 'high' | 'medium' | 'low'; impact: string }> {
    if (!this.analytics) return []

    const recommendations = []

    if (this.analytics.executiveMetrics.avgBasketSize < 3) {
      recommendations.push({
        action: 'Implement bundle pricing to increase basket size',
        priority: 'high' as const,
        impact: 'Increase average order value by 15-20%'
      })
    }

    if (this.analytics.executiveMetrics.topStoreConcentration > 40) {
      recommendations.push({
        action: 'Diversify revenue sources across more locations',
        priority: 'medium' as const,
        impact: 'Reduce business risk and increase growth potential'
      })
    }

    return recommendations
  }

  private generateFallbackMetrics(): Array<{ name: string; value: string; trend: 'up' | 'down' | 'stable' }> {
    if (!this.analytics) return []

    return [
      { name: 'Total Revenue', value: `₱${this.analytics.executiveMetrics.totalRevenue.toLocaleString()}`, trend: 'up' },
      { name: 'Revenue Growth', value: `${this.analytics.executiveMetrics.revenueGrowth.toFixed(1)}%`, trend: this.analytics.executiveMetrics.revenueGrowth > 0 ? 'up' : 'down' },
      { name: 'Basket Size', value: this.analytics.executiveMetrics.avgBasketSize.toFixed(1), trend: this.analytics.executiveMetrics.basketSizeGrowth > 0 ? 'up' : 'down' }
    ]
  }

  public async getQuickActions(): Promise<Array<{ id: string; label: string; query: string; icon: string }>> {
    return [
      {
        id: 'peak_hours',
        label: 'Peak Shopping Hours',
        query: 'What are our peak shopping hours and transaction patterns?',
        icon: 'clock'
      },
      {
        id: 'basket_analysis',
        label: 'Basket Analysis',
        query: 'Analyze customer basket sizes and recommend improvements',
        icon: 'shopping-cart'
      },
      {
        id: 'customer_segments',
        label: 'Customer Segments',
        query: 'What are our main customer segments and their behavior?',
        icon: 'users'
      },
      {
        id: 'revenue_opportunities',
        label: 'Revenue Growth',
        query: 'Identify the biggest revenue growth opportunities',
        icon: 'bar-chart'
      },
      {
        id: 'store_performance',
        label: 'Store Performance',
        query: 'Compare store performance and identify top performers',
        icon: 'map-pin'
      },
      {
        id: 'product_trends',
        label: 'Product Trends',
        query: 'What product categories are trending and why?',
        icon: 'trending-up'
      }
    ]
  }
}

export const groqService = new GroqService()