// AI Bots Client Library for Supabase Edge Functions
// This provides a clean interface to interact with the deployed edge functions

interface GenieResponse {
  content: string
  metadata: {
    model: string
    user_role: string
    tokens: number
  }
  generated_at: string
}

interface RetailResponse {
  analysis: string
  recommendations: string[]
  metrics: Record<string, any>
  generated_at: string
}

interface AdsResponse {
  analysis: string
  optimization_tips: string[]
  performance_metrics: Record<string, any>
  creative_insights: string
  generated_at: string
}

export const AIBots = {
  /**
   * AI Genie - General purpose business intelligence assistant
   */
  genie: {
    /**
     * Generate business insights
     * @param prompt - The question or request
     * @param context - Optional context data
     * @param userRole - User role (executive, regional_manager, analyst, store_owner)
     */
    generate: async (
      prompt: string, 
      context?: Record<string, any>, 
      userRole: string = 'analyst'
    ): Promise<GenieResponse> => {
      const response = await fetch(import.meta.env.VITE_GENIE_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context, user_role: userRole })
      })
      
      if (!response.ok) {
        throw new Error(`AI Genie error: ${response.statusText}`)
      }
      
      return response.json()
    }
  },

  /**
   * RetailBot - Specialized retail analytics
   */
  retailBot: {
    /**
     * Analyze retail performance
     * @param query - The analysis request
     * @param storeData - Optional store performance data
     * @param analysisType - Type of analysis (performance, inventory, customer, forecast)
     */
    analyze: async (
      query: string, 
      storeData?: Record<string, any>,
      analysisType: string = 'performance'
    ): Promise<RetailResponse> => {
      const response = await fetch(import.meta.env.VITE_RETAILBOT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query, 
          store_data: storeData,
          analysis_type: analysisType
        })
      })
      
      if (!response.ok) {
        throw new Error(`RetailBot error: ${response.statusText}`)
      }
      
      return response.json()
    },

    /**
     * Generate sales forecast
     * @param data - Historical sales data
     */
    forecast: async (data: Record<string, any>): Promise<any> => {
      const response = await fetch(import.meta.env.VITE_RETAILBOT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: "Generate sales forecast",
          store_data: data,
          analysis_type: 'forecast'
        })
      })
      
      if (!response.ok) {
        throw new Error(`RetailBot forecast error: ${response.statusText}`)
      }
      
      return response.json()
    }
  },

  /**
   * AdsBot - Advertising and marketing analytics
   */
  adsBot: {
    /**
     * Analyze advertising campaigns
     * @param campaignData - Campaign performance data
     * @param metricsFocus - Metrics to focus on (ctr, conversion, roi, etc.)
     */
    analyze: async (
      campaignData?: Record<string, any>, 
      metricsFocus: string[] = ['ctr', 'conversion', 'roi']
    ): Promise<AdsResponse> => {
      const response = await fetch(import.meta.env.VITE_ADSBOT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          campaign_data: campaignData, 
          metrics_focus: metricsFocus 
        })
      })
      
      if (!response.ok) {
        throw new Error(`AdsBot error: ${response.statusText}`)
      }
      
      return response.json()
    },

    /**
     * Get creative optimization suggestions
     * @param creativeData - Current creative performance
     */
    optimizeCreative: async (creativeData: Record<string, any>): Promise<any> => {
      const response = await fetch(import.meta.env.VITE_ADSBOT_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          campaign_data: creativeData,
          analysis_type: 'creative',
          metrics_focus: ['engagement', 'conversion']
        })
      })
      
      if (!response.ok) {
        throw new Error(`AdsBot creative optimization error: ${response.statusText}`)
      }
      
      return response.json()
    }
  }
}

// Hook for React components
import { useState, useCallback } from 'react'

export function useAIBot() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const askGenie = useCallback(async (
    prompt: string, 
    context?: Record<string, any>, 
    userRole?: string
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await AIBots.genie.generate(prompt, context, userRole)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeRetail = useCallback(async (
    query: string, 
    storeData?: Record<string, any>
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await AIBots.retailBot.analyze(query, storeData)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeAds = useCallback(async (
    campaignData?: Record<string, any>, 
    metricsFocus?: string[]
  ) => {
    setLoading(true)
    setError(null)
    try {
      const response = await AIBots.adsBot.analyze(campaignData, metricsFocus)
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    askGenie,
    analyzeRetail,
    analyzeAds
  }
}