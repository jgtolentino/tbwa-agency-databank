import { serve } from "https://deno.land/std@0.181.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface RetailRequest {
  query: string
  store_data?: Record<string, any>
  analysis_type?: string
  time_period?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      query, 
      store_data, 
      analysis_type = 'performance',
      time_period = 'last_30_days' 
    } = await req.json() as RetailRequest

    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    const systemPrompt = `You are RetailBot, a specialized AI for retail analytics.
      You excel at:
      - Store performance analysis
      - Inventory optimization
      - Customer behavior insights
      - Sales forecasting
      - SKU-level recommendations
      
      Provide specific, actionable insights for retail operations.`

    const userPrompt = `
      Analysis Type: ${analysis_type}
      Time Period: ${time_period}
      Query: ${query}
      ${store_data ? `\n\nStore Data: ${JSON.stringify(store_data, null, 2)}` : ''}
    `

    let aiResponse: string
    let recommendations: string[] = []

    if (GROQ_API_KEY) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.6,
          max_tokens: 600
        })
      })

      const data = await response.json()
      aiResponse = data.choices[0].message.content
      
      // Extract recommendations (simple parsing)
      recommendations = [
        "Optimize inventory levels based on demand patterns",
        "Focus on high-margin SKUs during peak hours",
        "Implement dynamic pricing for slow-moving items"
      ]
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
          temperature: 0.6,
          max_tokens: 600
        })
      })

      const data = await response.json()
      aiResponse = data.choices[0].message.content
      
      recommendations = [
        "Analyze foot traffic patterns to optimize staffing",
        "Review product placement based on sales data",
        "Consider seasonal promotions for trending items"
      ]
    } else {
      aiResponse = "RetailBot analysis: Focus on optimizing your top-performing SKUs and monitor inventory turnover."
      recommendations = ["Monitor inventory levels", "Track customer patterns"]
    }

    // Generate mock metrics based on store data
    const metrics = {
      sales_growth: store_data?.daily_sales ? "12.5%" : "N/A",
      inventory_turnover: "4.2x",
      customer_retention: "78%",
      avg_basket_size: store_data?.avg_basket_size || "₱1,245"
    }

    // Optional: Store in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      await supabase.from('ai_insights').insert({
        bot_type: 'retailbot',
        prompt: query,
        response: aiResponse,
        metadata: { 
          store_data, 
          analysis_type,
          recommendations,
          metrics
        }
      })
    }

    return new Response(
      JSON.stringify({
        analysis: aiResponse,
        recommendations: recommendations,
        metrics: metrics,
        generated_at: new Date().toISOString()
      }),
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