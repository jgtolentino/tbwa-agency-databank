import { serve } from "https://deno.land/std@0.181.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface AladdinRequest {
  prompt: string
  context?: Record<string, any>
  user_role?: string
  analysis_type?: 'summary' | 'anomaly' | 'whatif' | 'trend'
  parameters?: Record<string, any>
}

interface AladdinResponse {
  insights: string
  charts?: any[]
  actions?: Array<{
    label: string
    action: string
    params?: Record<string, any>
  }>
  anomalies?: Array<{
    metric: string
    region?: string
    change: number
    severity: 'low' | 'medium' | 'high'
  }>
  metadata: {
    confidence: number
    model: string
    generated_at: string
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      prompt, 
      context, 
      user_role = 'analyst',
      analysis_type = 'summary',
      parameters 
    } = await req.json() as AladdinRequest

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    // Build system prompt based on analysis type
    let systemPrompt = `You are Aladdin Insights, a data genie specializing in business intelligence.
    You are concise, proactive, and always surface the most critical insights.
    User role: ${user_role}`

    if (analysis_type === 'anomaly') {
      systemPrompt += `\nFocus on identifying anomalies, spikes, and drops in the data.
      Highlight changes > 15% and provide context for why they might have occurred.`
    } else if (analysis_type === 'whatif') {
      systemPrompt += `\nProvide what-if scenario analysis based on the parameters provided.
      Show projected outcomes and confidence levels.`
    } else if (analysis_type === 'trend') {
      systemPrompt += `\nAnalyze trends over time and identify patterns.
      Provide forward-looking insights and recommendations.`
    } else {
      systemPrompt += `\nProvide an executive summary highlighting:
      1. Top 3 wins/achievements
      2. Top 3 risks/concerns
      3. Key recommendations`
    }

    // Construct user prompt
    const userPrompt = context 
      ? `Context: ${JSON.stringify(context)}\n\n${prompt}` 
      : prompt

    let aiResponse: string
    let confidence = 0.9

    if (GROQ_API_KEY) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`Groq API error: ${data.error?.message || 'Unknown error'}`)
      }
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from Groq API')
      }
      
      aiResponse = data.choices[0].message.content
    } else if (OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`)
      }
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response structure from OpenAI API')
      }
      
      aiResponse = data.choices[0].message.content
    } else {
      // Fallback response
      aiResponse = generateFallbackResponse(analysis_type, context)
      confidence = 0.7
    }

    // Generate response components
    const response: AladdinResponse = {
      insights: aiResponse,
      metadata: {
        confidence,
        model: GROQ_API_KEY ? 'groq-llama-3.3-70b' : OPENAI_API_KEY ? 'gpt-4o-mini' : 'fallback',
        generated_at: new Date().toISOString()
      }
    }

    // Add analysis-specific components
    if (analysis_type === 'anomaly') {
      response.anomalies = detectAnomalies(context)
      response.actions = [
        { label: 'Drill into anomalies', action: 'navigate', params: { view: 'anomaly-details' } },
        { label: 'Set alert threshold', action: 'configure', params: { type: 'threshold' } }
      ]
    } else if (analysis_type === 'summary') {
      response.charts = [
        { type: 'kpi-cards', data: extractKPIs(context) },
        { type: 'trend-sparkline', data: extractTrends(context) }
      ]
      response.actions = [
        { label: 'View detailed report', action: 'navigate', params: { view: 'detailed-report' } },
        { label: 'Export summary', action: 'export', params: { format: 'pdf' } }
      ]
    }

    // Audit logging
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      await supabase.from('ai_insights').insert({
        bot_type: 'aladdin',
        prompt: prompt,
        response: aiResponse,
        user_role: user_role,
        analysis_type: analysis_type,
        metadata: {
          context,
          parameters,
          confidence,
          model: response.metadata.model
        }
      })
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

// Helper functions
function generateFallbackResponse(type: string, context?: any): string {
  const metrics = context?.metrics || {}
  
  if (type === 'anomaly') {
    return `Anomaly Detection: Based on the data provided, I've identified potential anomalies that require attention. 
    Monitor metrics showing >15% deviation from baseline.`
  } else if (type === 'whatif') {
    return `What-If Analysis: Projected outcomes based on your parameters suggest moderate impact on key metrics. 
    Further analysis recommended with complete data.`
  } else {
    return `Executive Summary: 
    Key Wins: Performance metrics show positive trends across major categories.
    Areas of Concern: Some regions may require additional attention.
    Recommendations: Focus on data-driven optimization strategies.`
  }
}

function detectAnomalies(context?: any): any[] {
  // Simple anomaly detection logic
  if (!context?.metrics) return []
  
  const anomalies = []
  const threshold = 0.15 // 15% change
  
  // Mock anomaly detection
  if (context.metrics.revenue_change > threshold) {
    anomalies.push({
      metric: 'revenue',
      change: context.metrics.revenue_change,
      severity: context.metrics.revenue_change > 0.3 ? 'high' : 'medium'
    })
  }
  
  return anomalies
}

function extractKPIs(context?: any): any {
  return {
    revenue: context?.metrics?.revenue || '₱0',
    transactions: context?.metrics?.transactions || 0,
    growth: context?.metrics?.growth || '0%',
    satisfaction: context?.metrics?.satisfaction || '0/5'
  }
}

function extractTrends(context?: any): any {
  // Mock trend data
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [100, 120, 115, 130, 125, 140, 135]
  }
}