import { NLPProcessor } from './nlpProcessor'
import { CrossTabAnalyzer } from './crossTabAnalyzer'
import type {
  ScoutAIRequest,
  ScoutAIResponse,
  CrossTabResponse,
  DataCache,
  PerformanceMetrics
} from '../types/crossTab'

export class ScoutAIService {
  private nlpProcessor: NLPProcessor
  private crossTabAnalyzer: CrossTabAnalyzer
  private cache: Map<string, DataCache>
  private performanceMetrics: PerformanceMetrics
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.nlpProcessor = new NLPProcessor()
    this.crossTabAnalyzer = new CrossTabAnalyzer()
    this.cache = new Map()
    this.performanceMetrics = {
      responseTime: 0,
      cacheHitRate: 0,
      queryAccuracy: 0,
      userSatisfaction: 0,
      activeUsers: 0,
      queriesPerMinute: 0
    }
  }

  public async processQuery(request: ScoutAIRequest): Promise<ScoutAIResponse> {
    const startTime = Date.now()

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request)
      const cachedResult = this.getFromCache(cacheKey)

      if (cachedResult) {
        this.updateMetrics(startTime, true)
        return {
          success: true,
          data: cachedResult,
          metadata: {
            processingTime: Date.now() - startTime,
            cacheHit: true,
            confidence: cachedResult.confidence,
            version: '1.0.0'
          }
        }
      }

      // Process new query
      const nlpResult = await this.nlpProcessor.processQuery(request.query, request.context)
      const analysis = this.crossTabAnalyzer.analyze(nlpResult.intent.type, nlpResult.parameters)

      const response: CrossTabResponse = {
        answer: nlpResult.suggestedResponse,
        insights: analysis.insights.map(insight => ({
          type: this.mapInsightType(nlpResult.intent.type),
          title: insight,
          finding: insight,
          context: `Based on ${nlpResult.intent.type} analysis`,
          impact: 'Medium to High impact on business performance',
          priority: 'medium' as const
        })),
        metrics: analysis.keyMetrics.secondary.map(metric => ({
          name: metric,
          value: this.generateMetricValue(metric),
          unit: this.getMetricUnit(metric),
          comparison: {
            period: 'Previous Month',
            change: Math.round((Math.random() - 0.5) * 20),
            direction: Math.random() > 0.5 ? 'up' : 'down'
          }
        })),
        recommendations: this.generateRecommendations(nlpResult.intent.type, analysis),
        visualization: request.options?.includeVisualization ? {
          type: this.getVisualizationType(nlpResult.intent.type),
          title: `${nlpResult.intent.type} Analysis`,
          data: analysis.data.slice(0, 10),
          config: {
            xAxis: 'category',
            yAxis: 'value',
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
          }
        } : undefined,
        confidence: nlpResult.intent.confidence,
        relatedQueries: this.generateRelatedQueries(nlpResult.intent.type)
      }

      // Cache the result
      this.setCache(cacheKey, response)
      this.updateMetrics(startTime, false)

      return {
        success: true,
        data: response,
        metadata: {
          processingTime: Date.now() - startTime,
          cacheHit: false,
          confidence: response.confidence,
          version: '1.0.0'
        }
      }

    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          details: error
        },
        metadata: {
          processingTime: Date.now() - startTime,
          cacheHit: false,
          confidence: 0,
          version: '1.0.0'
        }
      }
    }
  }

  public async getQuickActions() {
    return [
      {
        id: 'popular-times',
        label: 'When are peak shopping hours?',
        query: 'What are the peak shopping hours by product category?',
        icon: 'clock',
        category: 'time' as const,
        popular: true
      },
      {
        id: 'basket-analysis',
        label: 'Basket size by payment method',
        query: 'How does basket size vary by payment method?',
        icon: 'shopping-cart',
        category: 'basket' as const,
        popular: true
      },
      {
        id: 'demographic-trends',
        label: 'Age group preferences',
        query: 'Which products do different age groups prefer?',
        icon: 'users',
        category: 'demographics' as const,
        popular: true
      },
      {
        id: 'store-performance',
        label: 'Top performing stores',
        query: 'Which stores have the highest revenue per transaction?',
        icon: 'bar-chart',
        category: 'performance' as const,
        popular: false
      }
    ]
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics }
  }

  public clearCache(): void {
    this.cache.clear()
  }

  private generateCacheKey(request: ScoutAIRequest): string {
    const contextHash = request.context ? JSON.stringify(request.context) : ''
    const optionsHash = request.options ? JSON.stringify(request.options) : ''
    return `${request.query}:${contextHash}:${optionsHash}`
  }

  private getFromCache(key: string): CrossTabResponse | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp.getTime() > this.CACHE_TTL) {
      this.cache.delete(key)
      return null
    }

    cached.hitCount++
    return cached.data
  }

  private setCache(key: string, data: CrossTabResponse): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: new Date(),
      ttl: this.CACHE_TTL,
      hitCount: 0
    })
  }

  private mapInsightType(analysisType: string): 'time_pattern' | 'basket_behavior' | 'substitution_pattern' | 'demographic_trend' {
    if (analysisType.startsWith('time_')) return 'time_pattern'
    if (analysisType.startsWith('basket_')) return 'basket_behavior'
    if (analysisType.includes('substitution') || analysisType.includes('suggestion')) return 'substitution_pattern'
    return 'demographic_trend'
  }

  private generateMetricValue(metric: string): number | string {
    const baseValues: Record<string, any> = {
      'Average Transaction Value': '₱847.50',
      'Peak Hour Revenue Share': '34.2%',
      'Conversion Rate': '12.5%',
      'Basket Size': 4.2,
      'Customer Retention': '68%',
      'Revenue Growth': '15.3%'
    }

    return baseValues[metric] || `₱${(Math.random() * 1000 + 100).toFixed(2)}`
  }

  private getMetricUnit(metric: string): string {
    if (metric.includes('Rate') || metric.includes('Share') || metric.includes('Growth')) return '%'
    if (metric.includes('Value') || metric.includes('Revenue')) return '₱'
    if (metric.includes('Size') || metric.includes('Count')) return 'items'
    return 'units'
  }

  private generateRecommendations(analysisType: string, analysis: any) {
    const recommendations = [
      {
        action: `Optimize ${analysisType.replace('_', ' ')} strategy`,
        impact: 'Increase revenue by 8-12% through targeted improvements',
        effort: 'medium' as const,
        roi: {
          monthly: '₱150,000 - ₱230,000',
          confidence: 0.85
        },
        timeline: '2-3 weeks implementation',
        priority: 1
      },
      {
        action: 'Implement real-time monitoring',
        impact: 'Improve decision-making speed and accuracy',
        effort: 'low' as const,
        roi: {
          monthly: '₱50,000 - ₱80,000',
          confidence: 0.75
        },
        timeline: '1 week setup',
        priority: 2
      }
    ]

    return recommendations
  }

  private getVisualizationType(analysisType: string): 'bar' | 'line' | 'pie' | 'heatmap' | 'scatter' | 'table' {
    if (analysisType.startsWith('time_')) return 'line'
    if (analysisType.startsWith('basket_')) return 'bar'
    if (analysisType.includes('demographics')) return 'pie'
    return 'bar'
  }

  private generateRelatedQueries(analysisType: string): string[] {
    const queryMap: Record<string, string[]> = {
      'time_product_category': [
        'What time do beverage sales peak?',
        'Which categories sell best in the morning?',
        'How do weekend patterns differ from weekdays?'
      ],
      'basket_payment_method': [
        'Do credit card users buy more expensive items?',
        'What payment method has the highest average basket?',
        'How does payment method affect purchase frequency?'
      ],
      'age_product_category': [
        'What products appeal to millennials?',
        'Which age group spends the most on snacks?',
        'How do purchase patterns change with age?'
      ]
    }

    return queryMap[analysisType] || [
      'Show me related insights',
      'What are the key trends?',
      'How can we improve performance?'
    ]
  }

  private updateMetrics(startTime: number, cacheHit: boolean): void {
    const processingTime = Date.now() - startTime
    this.performanceMetrics.responseTime =
      (this.performanceMetrics.responseTime + processingTime) / 2

    // Update cache hit rate
    const totalRequests = this.performanceMetrics.queriesPerMinute * 60 // Approximate
    this.performanceMetrics.cacheHitRate =
      ((this.performanceMetrics.cacheHitRate * totalRequests) + (cacheHit ? 1 : 0)) /
      (totalRequests + 1)

    this.performanceMetrics.queriesPerMinute++
  }
}

// Export singleton instance
export const scoutAI = new ScoutAIService()