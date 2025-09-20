/**
 * Strict Production Data Source - Supabase Only
 * NO CSV IMPORTS ALLOWED IN THIS FILE
 *
 * This service enforces strict Supabase-only queries for production.
 * Any attempt to import CSV data will fail build-time checks.
 */

import { supabase } from '../lib/supabase'
import { ensureArray } from '../utils/ensureArray'

// Runtime guard - immediately fail in production if not configured properly
if (import.meta.env.PROD && !import.meta.env.VITE_STRICT_DATASOURCE) {
  throw new Error('🚨 PRODUCTION ERROR: VITE_STRICT_DATASOURCE not enabled. Only Supabase allowed in production.')
}

if (import.meta.env.PROD && !supabase) {
  throw new Error('🚨 PRODUCTION ERROR: Supabase client not initialized. Production requires live database.')
}

/**
 * Production-safe query wrapper
 * Guarantees array response and proper error handling
 */
async function strictSupabaseQuery<T = any>(
  tableName: string,
  query: string = '*',
  filters: any = {}
): Promise<T[]> {
  if (!supabase) {
    throw new Error('🚨 STRICT MODE: Supabase client required')
  }

  try {
    let queryBuilder = supabase.from(tableName).select(query)

    // Apply filters safely
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key.includes('gte_')) {
          queryBuilder = queryBuilder.gte(key.replace('gte_', ''), value)
        } else if (key.includes('lte_')) {
          queryBuilder = queryBuilder.lte(key.replace('lte_', ''), value)
        } else if (key.includes('like_')) {
          queryBuilder = queryBuilder.ilike(key.replace('like_', ''), `%${value}%`)
        } else {
          queryBuilder = queryBuilder.eq(key, value)
        }
      }
    })

    const { data, error } = await queryBuilder

    if (error) {
      console.error(`❌ Supabase query failed for ${tableName}:`, error)
      throw new Error(`Database query failed: ${error.message}`)
    }

    return ensureArray<T>(data)
  } catch (err) {
    console.error(`🚨 STRICT QUERY ERROR [${tableName}]:`, err)
    if (import.meta.env.PROD) {
      throw err // Fail fast in production
    }
    return [] // Graceful fallback in development
  }
}

/**
 * Schema-aware table resolver
 * Tries multiple schema prefixes to find the correct table
 */
async function resolveTable(baseName: string): Promise<string> {
  const schemas = ['scout_geo', 'scout_platform', 'scout_ops', 'public_gold', 'dal', 'public']

  for (const schema of schemas) {
    const tableName = `${schema}.${baseName}`
    try {
      const { error } = await supabase.from(tableName).select('*').limit(1)
      if (!error) {
        return tableName
      }
    } catch {
      // Continue to next schema
    }
  }

  // Fallback to base name
  return baseName
}

/**
 * Strict Data Service - Production-Only Implementation
 */
export class StrictDataService {
  /**
   * Get sales/transaction data
   */
  static async getSalesData(filters: any = {}): Promise<any[]> {
    const tableName = await resolveTable('sales_interactions')
    return strictSupabaseQuery(tableName, '*', filters)
  }

  /**
   * Get geographic/location data
   */
  static async getGeoData(filters: any = {}): Promise<any[]> {
    const tableName = await resolveTable('geo_data')
    return strictSupabaseQuery(tableName, '*', filters)
  }

  /**
   * Get consumer/demographic data
   */
  static async getConsumerData(filters: any = {}): Promise<any[]> {
    const tableName = await resolveTable('consumer_data')
    return strictSupabaseQuery(tableName, '*', filters)
  }

  /**
   * Get product/SKU data
   */
  static async getProductData(filters: any = {}): Promise<any[]> {
    const tableName = await resolveTable('product_data')
    return strictSupabaseQuery(tableName, '*', filters)
  }

  /**
   * Get campaign/marketing data
   */
  static async getCampaignData(filters: any = {}): Promise<any[]> {
    const tableName = await resolveTable('campaign_data')
    return strictSupabaseQuery(tableName, '*', filters)
  }

  /**
   * Generic query method for any table
   */
  static async queryTable(tableName: string, query: string = '*', filters: any = {}): Promise<any[]> {
    const resolvedTable = await resolveTable(tableName)
    return strictSupabaseQuery(resolvedTable, query, filters)
  }

  /**
   * Health check - verify database connectivity
   */
  static async healthCheck(): Promise<{ status: 'healthy' | 'error', message: string, timestamp: string }> {
    try {
      const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1)

      if (error) {
        return {
          status: 'error',
          message: `Database connection failed: ${error.message}`,
          timestamp: new Date().toISOString()
        }
      }

      return {
        status: 'healthy',
        message: 'Supabase connection verified',
        timestamp: new Date().toISOString()
      }
    } catch (err) {
      return {
        status: 'error',
        message: `Health check failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Export singleton instance
export const strictDataSource = StrictDataService

// Production validation
if (import.meta.env.PROD) {
  console.log('✅ STRICT DATASOURCE: Production mode verified - Supabase only')
}