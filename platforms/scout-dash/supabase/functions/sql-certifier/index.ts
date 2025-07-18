import { serve } from "https://deno.land/std@0.181.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface SQLTemplate {
  id: string
  name: string
  description: string
  template: string
  parameters: Array<{
    name: string
    type: 'string' | 'number' | 'date' | 'array'
    required: boolean
    validation?: {
      min?: number
      max?: number
      pattern?: string
      enum?: any[]
    }
  }>
  scopes: string[]
}

interface CertifyRequest {
  intent: string
  parameters?: Record<string, any>
  user_role?: string
  context?: Record<string, any>
}

interface CertifyResponse {
  approved: boolean
  sql?: string
  template_used?: string
  parameters_validated?: Record<string, any>
  error?: string
  audit_id?: string
}

// Pre-approved SQL templates
const SQL_TEMPLATES: SQLTemplate[] = [
  {
    id: 'daily_metrics_summary',
    name: 'Daily Metrics Summary',
    description: 'Get aggregated metrics for a date range',
    template: `
      SELECT 
        date,
        region,
        SUM(total_transactions) as transactions,
        SUM(total_revenue) as revenue,
        AVG(avg_transaction_value) as avg_value
      FROM daily_metrics
      WHERE date BETWEEN $1 AND $2
        {{region_filter}}
      GROUP BY date, region
      ORDER BY date DESC
      LIMIT $3
    `,
    parameters: [
      { name: 'start_date', type: 'date', required: true },
      { name: 'end_date', type: 'date', required: true },
      { name: 'limit', type: 'number', required: false, validation: { min: 1, max: 1000 } },
      { name: 'region', type: 'string', required: false }
    ],
    scopes: ['daily_metrics:read']
  },
  {
    id: 'top_products',
    name: 'Top Products Analysis',
    description: 'Get top performing products by revenue',
    template: `
      SELECT 
        category,
        brand,
        COUNT(DISTINCT transaction_id) as transaction_count,
        SUM(units) as total_units,
        SUM(peso_value) as total_revenue
      FROM transactions
      WHERE timestamp >= $1
        {{category_filter}}
        {{brand_filter}}
      GROUP BY category, brand
      ORDER BY total_revenue DESC
      LIMIT $2
    `,
    parameters: [
      { name: 'start_date', type: 'date', required: true },
      { name: 'limit', type: 'number', required: false, validation: { min: 1, max: 100 } },
      { name: 'category', type: 'string', required: false },
      { name: 'brand', type: 'string', required: false }
    ],
    scopes: ['transactions:read']
  },
  {
    id: 'anomaly_detection',
    name: 'Anomaly Detection Query',
    description: 'Detect anomalies in metrics',
    template: `
      WITH baseline AS (
        SELECT 
          region,
          AVG(total_revenue) as avg_revenue,
          STDDEV(total_revenue) as stddev_revenue
        FROM daily_metrics
        WHERE date BETWEEN $1 AND $2
        GROUP BY region
      ),
      current AS (
        SELECT 
          region,
          date,
          total_revenue
        FROM daily_metrics
        WHERE date = $3
      )
      SELECT 
        c.region,
        c.date,
        c.total_revenue,
        b.avg_revenue,
        ((c.total_revenue - b.avg_revenue) / NULLIF(b.stddev_revenue, 0)) as z_score,
        ((c.total_revenue - b.avg_revenue) / NULLIF(b.avg_revenue, 0) * 100) as pct_change
      FROM current c
      JOIN baseline b ON c.region = b.region
      WHERE ABS((c.total_revenue - b.avg_revenue) / NULLIF(b.avg_revenue, 0)) > $4
    `,
    parameters: [
      { name: 'baseline_start', type: 'date', required: true },
      { name: 'baseline_end', type: 'date', required: true },
      { name: 'check_date', type: 'date', required: true },
      { name: 'threshold', type: 'number', required: false, validation: { min: 0.1, max: 1.0 } }
    ],
    scopes: ['daily_metrics:read']
  }
]

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { intent, parameters = {}, user_role, context } = await req.json() as CertifyRequest

    // Find matching template based on intent
    const template = findMatchingTemplate(intent, context)
    
    if (!template) {
      return new Response(
        JSON.stringify({
          approved: false,
          error: 'No approved SQL template matches your request'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate parameters
    const validation = validateParameters(template, parameters)
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          approved: false,
          error: `Parameter validation failed: ${validation.error}`,
          template_used: template.id
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Build SQL with validated parameters
    const sql = buildSQL(template, validation.parameters)

    // Audit logging
    const auditId = await logAudit({
      template_id: template.id,
      parameters: validation.parameters,
      user_role,
      context,
      sql
    })

    return new Response(
      JSON.stringify({
        approved: true,
        sql,
        template_used: template.id,
        parameters_validated: validation.parameters,
        audit_id: auditId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        approved: false,
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

function findMatchingTemplate(intent: string, context?: any): SQLTemplate | null {
  // Simple intent matching - in production, use NLP or more sophisticated matching
  const intentLower = intent.toLowerCase()
  
  if (intentLower.includes('daily') || intentLower.includes('metrics') || intentLower.includes('summary')) {
    return SQL_TEMPLATES.find(t => t.id === 'daily_metrics_summary') || null
  }
  
  if (intentLower.includes('product') || intentLower.includes('top') || intentLower.includes('best')) {
    return SQL_TEMPLATES.find(t => t.id === 'top_products') || null
  }
  
  if (intentLower.includes('anomaly') || intentLower.includes('spike') || intentLower.includes('unusual')) {
    return SQL_TEMPLATES.find(t => t.id === 'anomaly_detection') || null
  }
  
  return null
}

function validateParameters(template: SQLTemplate, provided: Record<string, any>): {
  valid: boolean
  error?: string
  parameters?: Record<string, any>
} {
  const validated: Record<string, any> = {}
  
  for (const param of template.parameters) {
    const value = provided[param.name]
    
    // Check required parameters
    if (param.required && (value === undefined || value === null)) {
      return { valid: false, error: `Missing required parameter: ${param.name}` }
    }
    
    if (value !== undefined && value !== null) {
      // Type validation
      if (param.type === 'number' && typeof value !== 'number') {
        return { valid: false, error: `Parameter ${param.name} must be a number` }
      }
      
      if (param.type === 'date') {
        const date = new Date(value)
        if (isNaN(date.getTime())) {
          return { valid: false, error: `Parameter ${param.name} must be a valid date` }
        }
        validated[param.name] = date.toISOString().split('T')[0]
      } else {
        validated[param.name] = value
      }
      
      // Additional validation rules
      if (param.validation) {
        if (param.validation.min !== undefined && value < param.validation.min) {
          return { valid: false, error: `Parameter ${param.name} must be >= ${param.validation.min}` }
        }
        if (param.validation.max !== undefined && value > param.validation.max) {
          return { valid: false, error: `Parameter ${param.name} must be <= ${param.validation.max}` }
        }
        if (param.validation.enum && !param.validation.enum.includes(value)) {
          return { valid: false, error: `Parameter ${param.name} must be one of: ${param.validation.enum.join(', ')}` }
        }
      }
    }
  }
  
  // Set defaults
  if (!validated.limit) validated.limit = 100
  if (!validated.threshold) validated.threshold = 0.15
  
  return { valid: true, parameters: validated }
}

function buildSQL(template: SQLTemplate, parameters: Record<string, any>): string {
  let sql = template.template
  
  // Replace conditional filters
  if (parameters.region) {
    sql = sql.replace('{{region_filter}}', `AND region = '${parameters.region}'`)
  } else {
    sql = sql.replace('{{region_filter}}', '')
  }
  
  if (parameters.category) {
    sql = sql.replace('{{category_filter}}', `AND category = '${parameters.category}'`)
  } else {
    sql = sql.replace('{{category_filter}}', '')
  }
  
  if (parameters.brand) {
    sql = sql.replace('{{brand_filter}}', `AND brand = '${parameters.brand}'`)
  } else {
    sql = sql.replace('{{brand_filter}}', '')
  }
  
  // Clean up extra whitespace
  sql = sql.replace(/\s+/g, ' ').trim()
  
  return sql
}

async function logAudit(data: any): Promise<string> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  
  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const { data: result, error } = await supabase
      .from('ai_sql_audit')
      .insert({
        template_id: data.template_id,
        parameters: data.parameters,
        user_role: data.user_role,
        context: data.context,
        generated_sql: data.sql,
        created_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    return result?.id || 'no-audit'
  }
  
  return 'no-audit'
}