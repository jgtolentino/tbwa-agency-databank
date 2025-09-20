// Data Service for Scout Dashboard - Supabase Only (No CSV)
import { createClient } from '@supabase/supabase-js'
import { validateDataSource } from '../utils/runtimeGuard'

// Environment configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cxzllzyxwpyptfretryc.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.TKvgUGWOUPPYgqGmSLlYCy1LfkqpLhTg8jQ38h_TjeE'

// Singleton Supabase client
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (_client) return _client;

  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });

  console.log('✅ Supabase client initialized for production datasource');
  return _client;
}

// Interface definitions
export interface FlatTxn {
  category: string;
  brand: string;
  brand_raw: string;
  product: string;
  qty: number;
  unit: string;
  unit_price: number;
  total_price: number;
  device: string;
  store: number;
  storename: string;
  storelocationmaster: string;
  storedeviceid: string | null;
  storedevicename: string | null;
  location: string;
  transaction_id: string;
  date_ph: string;
  time_ph: string;
  day_of_week: string;
  weekday_weekend: string;
  time_of_day: string;
  payment_method: string | null;
  bought_with_other_brands: string | null;
  transcript_audio: string | null;
  edge_version: string | null;
  sku: string | null;
  ts_ph: string;
  facialid: string | null;
  gender: string | null;
  emotion: string | null;
  age: number | null;
  agebracket: string | null;
  storeid: number;
  interactionid: string | null;
  productid: string | null;
  transactiondate: string;
  deviceid: string;
  sex: string | null;
  age__query_4_1: number | null;
  emotionalstate: string | null;
  transcriptiontext: string | null;
  gender__query_4_1: string | null;
  barangay: string | null;
  storename__query_10: string | null;
  location__query_10: string | null;
  size: number | null;
  geolatitude: number | null;
  geolongitude: number | null;
  storegeometry: string | null;
  managername: string | null;
  managercontactinfo: string | null;
  devicename: string | null;
  deviceid__query_10: string | null;
  barangay__query_10: string | null;
}

export interface KpiSummary {
  totalRows: number;
  uniqueStores: number;
  uniqueDevices: number;
  uniqueBrands: number;
  totalRevenue: number;
  dateMin: string | null;
  dateMax: string | null;
}

export interface Paged<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Safe array validation
function ensureArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.rows)) return data.rows;
  if (data && typeof data === 'object' && Array.isArray(data.items)) return data.items;
  console.warn('Data is not an array, returning empty array:', typeof data);
  return [];
}

// Core data fetching - SUPABASE ONLY
export async function fetchTx(limit = 10000): Promise<FlatTxn[]> {
  validateDataSource('fetchTx', false); // Not CSV

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('scout_gold_transactions_flat')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('Supabase query failed:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    const safeData = ensureArray<FlatTxn>(data);
    console.log(`✅ Fetched ${safeData.length} transactions from Supabase`);

    return safeData;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}

// Paginated fetch
export async function fetchTxPaged(page = 1, pageSize = 1000): Promise<Paged<FlatTxn>> {
  validateDataSource('fetchTxPaged', false);

  const supabase = getSupabaseClient();
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  try {
    // Get total count
    const { count } = await supabase
      .from('scout_gold_transactions_flat')
      .select('*', { count: 'exact', head: true });

    // Get page data
    const { data, error } = await supabase
      .from('scout_gold_transactions_flat')
      .select('*')
      .range(start, end);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    const safeData = ensureArray<FlatTxn>(data);

    return {
      rows: safeData,
      total: count || 0,
      page,
      pageSize
    };
  } catch (error) {
    console.error('Failed to fetch paginated transactions:', error);
    throw error;
  }
}

// KPI Summary
export async function fetchKpiSummary(): Promise<KpiSummary> {
  validateDataSource('fetchKpiSummary', false);

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase.rpc('get_kpi_summary');

    if (error) {
      throw new Error(`KPI summary error: ${error.message}`);
    }

    return data || {
      totalRows: 0,
      uniqueStores: 0,
      uniqueDevices: 0,
      uniqueBrands: 0,
      totalRevenue: 0,
      dateMin: null,
      dateMax: null
    };
  } catch (error) {
    console.error('Failed to fetch KPI summary:', error);
    throw error;
  }
}

// Brand performance
export async function fetchBrandPerformance(limit = 50): Promise<any[]> {
  validateDataSource('fetchBrandPerformance', false);

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('scout_gold_transactions_flat')
      .select('brand, total_price')
      .not('brand', 'is', null)
      .limit(limit);

    if (error) {
      throw new Error(`Brand performance error: ${error.message}`);
    }

    return ensureArray(data);
  } catch (error) {
    console.error('Failed to fetch brand performance:', error);
    throw error;
  }
}

// Store performance
export async function fetchStorePerformance(limit = 50): Promise<any[]> {
  validateDataSource('fetchStorePerformance', false);

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from('scout_gold_transactions_flat')
      .select('storeid, storename, total_price')
      .not('storeid', 'is', null)
      .limit(limit);

    if (error) {
      throw new Error(`Store performance error: ${error.message}`);
    }

    return ensureArray(data);
  } catch (error) {
    console.error('Failed to fetch store performance:', error);
    throw error;
  }
}

// Consumer data
export async function fetchConsumerData(filters: any = {}): Promise<any[]> {
  validateDataSource('fetchConsumerData', false);

  const supabase = getSupabaseClient();

  try {
    let query = supabase
      .from('scout_gold_transactions_flat')
      .select('age, gender, emotion, agebracket, total_price');

    // Apply filters if provided
    if (filters.ageMin) query = query.gte('age', filters.ageMin);
    if (filters.ageMax) query = query.lte('age', filters.ageMax);
    if (filters.gender) query = query.eq('gender', filters.gender);

    const { data, error } = await query.limit(10000);

    if (error) {
      throw new Error(`Consumer data error: ${error.message}`);
    }

    return ensureArray(data);
  } catch (error) {
    console.error('Failed to fetch consumer data:', error);
    throw error;
  }
}

// Geographic data
export async function fetchGeoData(filters: any = {}): Promise<any[]> {
  validateDataSource('fetchGeoData', false);

  const supabase = getSupabaseClient();

  try {
    let query = supabase
      .from('scout_gold_transactions_flat')
      .select('location, barangay, geolatitude, geolongitude, total_price')
      .not('geolatitude', 'is', null)
      .not('geolongitude', 'is', null);

    if (filters.region) query = query.eq('location', filters.region);

    const { data, error } = await query.limit(10000);

    if (error) {
      throw new Error(`Geographic data error: ${error.message}`);
    }

    return ensureArray(data);
  } catch (error) {
    console.error('Failed to fetch geographic data:', error);
    throw error;
  }
}

// Export all data fetch functions
export const dataService = {
  fetchTx,
  fetchTxPaged,
  fetchKpiSummary,
  fetchBrandPerformance,
  fetchStorePerformance,
  fetchConsumerData,
  fetchGeoData,
  getSupabaseClient
};