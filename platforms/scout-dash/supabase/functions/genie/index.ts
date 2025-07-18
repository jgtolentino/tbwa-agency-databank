import { serve } from "https://deno.land/std@0.181.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface GenieRequest {
  prompt: string
  context?: Record<string, any>
  user_role?: string
  max_tokens?: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, context, user_role = 'analyst', max_tokens = 500 } = await req.json() as GenieRequest

    // Initialize Groq client (or OpenAI)
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    let aiResponse: string

    if (GROQ_API_KEY) {
      // Use Groq for fast inference
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are AI Genie, an expert business intelligence assistant. 
                       You provide insights for ${user_role} users. 
                       Be concise, actionable, and data-driven in your responses.`
            },
            {
              role: 'user',
              content: context ? `Context: ${JSON.stringify(context)}\n\n${prompt}` : prompt
            }
          ],
          temperature: 0.7,
          max_tokens: max_tokens
        })
      })

      const data = await response.json()
      aiResponse = data.choices[0].message.content
    } else if (OPENAI_API_KEY) {
      // Fallback to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are AI Genie, an expert business intelligence assistant. 
                       You provide insights for ${user_role} users. 
                       Be concise, actionable, and data-driven in your responses.`
            },
            {
              role: 'user',
              content: context ? `Context: ${JSON.stringify(context)}\n\n${prompt}` : prompt
            }
          ],
          temperature: 0.7,
          max_tokens: max_tokens
        })
      })

      const data = await response.json()
      aiResponse = data.choices[0].message.content
    } else {
      aiResponse = "AI Genie analysis: Based on your query, I recommend focusing on data-driven decision making. Please configure API keys for enhanced insights."
    }

    // Optional: Log to Supabase for analytics
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      
      await supabase.from('ai_insights').insert({
        bot_type: 'genie',
        prompt: prompt,
        response: aiResponse,
        user_role: user_role,
        metadata: { context, model: GROQ_API_KEY ? 'groq' : OPENAI_API_KEY ? 'openai' : 'fallback' }
      })
    }

    return new Response(
      JSON.stringify({
        content: aiResponse,
        metadata: {
          model: GROQ_API_KEY ? 'groq-mixtral' : OPENAI_API_KEY ? 'gpt-4o-mini' : 'fallback',
          user_role: user_role,
          tokens: aiResponse.split(' ').length
        },
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