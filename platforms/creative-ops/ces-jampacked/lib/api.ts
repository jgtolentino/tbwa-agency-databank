/**
 * API utilities with production guards and telemetry
 * Prevents fallback to mock data in production
 */

import { createClient } from '@supabase/supabase-js';
import { ENV, isFallbackAllowed } from './env';
import { logMockFallback, logDataSourceError } from './telemetry';

// Initialize Supabase client
export const supabase = createClient(
  ENV.SUPABASE_URL || '',
  ENV.SUPABASE_ANON_KEY || ''
);

/**
 * Fetch data with fallback protection
 * In production, throws errors instead of falling back to mocks
 */
export async function fetchOrFallback<T>(
  fn: () => Promise<T>,
  fallback: () => T,
  tag: string,
  widget?: string
): Promise<T> {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    // Log the error for monitoring
    logDataSourceError(tag, error, widget);

    if (!isFallbackAllowed()) {
      // In production without explicit fallback permission, re-throw
      throw new Error(
        `Data fetch failed in production (${tag}): ${error}. ` +
        'Set VITE_ALLOW_FALLBACK_IN_PROD=1 to enable fallbacks.'
      );
    }

    // Log mock fallback usage
    logMockFallback(tag, widget, error?.toString());

    return fallback();
  }
}

/**
 * Get data source status from Scout
 */
export async function getDataSourceStatus(): Promise<{ source_status: string }> {
  const { data, error } = await supabase
    .rpc('get_data_source_status');

  if (error) {
    throw new Error(`Failed to get data source status: ${error.message}`);
  }

  return data;
}

/**
 * Fetch geographic summary data
 */
export async function getGeoSummary(filters: Record<string, any> = {}): Promise<any> {
  return fetchOrFallback(
    async () => {
      const { data, error } = await supabase
        .rpc('get_geo_summary', { p_filters: filters });

      if (error) throw error;
      return data;
    },
    () => ({
      total_stores: 0,
      total_transactions: 0,
      total_revenue: 0,
      avg_revenue_per_store: 0,
      top_performing_store: 'Mock Store',
      store_distribution: {}
    }),
    'geo_summary',
    'geographic_dashboard'
  );
}

/**
 * Fetch brand performance data
 */
export async function getBrandPerformance(filters: Record<string, any> = {}): Promise<any> {
  return fetchOrFallback(
    async () => {
      const { data, error } = await supabase
        .rpc('get_brand_performance', { p_filters: filters });

      if (error) throw error;
      return data;
    },
    () => [],
    'brand_performance',
    'brand_dashboard'
  );
}

/**
 * Fetch transaction trends data
 */
export async function getTransactionTrends(filters: Record<string, any> = {}): Promise<any> {
  return fetchOrFallback(
    async () => {
      const { data, error } = await supabase
        .rpc('get_transaction_trends', { p_filters: filters });

      if (error) throw error;
      return data;
    },
    () => [],
    'transaction_trends',
    'transaction_dashboard'
  );
}

/**
 * Fetch consumer behavior data
 */
export async function getConsumerBehavior(filters: Record<string, any> = {}): Promise<any> {
  return fetchOrFallback(
    async () => {
      const { data, error } = await supabase
        .rpc('get_consumer_behavior', { p_filters: filters });

      if (error) throw error;
      return data;
    },
    () => [],
    'consumer_behavior',
    'consumer_dashboard'
  );
}

/**
 * Export data (no fallback - always use real data)
 */
export async function exportData(type: string, filters: Record<string, any> = {}): Promise<any> {
  let rpcName = '';
  switch (type) {
    case 'geographic':
      rpcName = 'get_geo_summary';
      break;
    case 'brands':
      rpcName = 'get_brand_performance';
      break;
    case 'transactions':
      rpcName = 'get_transaction_trends';
      break;
    case 'consumer':
      rpcName = 'get_consumer_behavior';
      break;
    default:
      throw new Error(`Unknown export type: ${type}`);
  }

  const { data, error } = await supabase
    .rpc(rpcName, { p_filters: filters });

  if (error) {
    logDataSourceError(`export_${type}`, error);
    throw error;
  }

  return data;
}