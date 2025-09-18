// Data Service for Scout Dashboard - Toggle between CSV and Supabase
import { createClient } from '@supabase/supabase-js'
import Papa from 'papaparse'

const DATA_MODE = import.meta.env.VITE_DATA_MODE || 'mock_csv'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Guard against missing environment variables with clear error message
function validateSupabaseConfig() {
  if (DATA_MODE === 'supabase') {
    const missing = [
      !SUPABASE_URL && 'VITE_SUPABASE_URL',
      !SUPABASE_ANON_KEY && 'VITE_SUPABASE_ANON_KEY',
    ].filter(Boolean);

    if (missing.length > 0) {
      throw new Error(`[Supabase] Missing required env(s): ${missing.join(', ')}`);
    }

    if (SUPABASE_URL === 'https://your-project.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
      throw new Error('[Supabase] Environment variables contain placeholder values');
    }
  }
}

// Initialize Supabase client only if in supabase mode and credentials are available
let supabase: any = null;
if (DATA_MODE === 'supabase') {
  try {
    validateSupabaseConfig();
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
    console.log('✅ Supabase client initialized for trusted data mode');
  } catch (error) {
    console.warn('⚠️ Supabase initialization failed, falling back to CSV mode:', error);
    supabase = null;
  }
} else {
  console.log('📁 Using CSV data mode');
}

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

// Mock CSV data loader (simulated for now)
let mockData: FlatTxn[] | null = null;

async function loadMockData(): Promise<FlatTxn[]> {
  if (mockData) return mockData;

  try {
    // Try to load CSV file from public folder
    const response = await fetch('/data/full_flat.csv');
    if (response.ok) {
      const csvText = await response.text();
      const result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value, field) => {
          // Convert numeric fields
          if (['qty', 'unit_price', 'total_price', 'store', 'age', 'storeid', 'age__query_4_1', 'size', 'geolatitude', 'geolongitude'].includes(field)) {
            const num = Number(value);
            return isNaN(num) ? (value === '' ? null : value) : num;
          }
          // Convert empty strings to null for nullable fields
          return value === '' ? null : value;
        }
      });

      if (result.errors.length > 0) {
        console.warn('CSV parsing errors:', result.errors);
      }

      mockData = result.data as FlatTxn[];
      console.log(`Loaded ${mockData.length} transactions from CSV`);
      return mockData;
    }
  } catch (error) {
    console.warn('Failed to load CSV file:', error);
  }

  // Fallback to sample data if CSV loading fails
  const sampleData: FlatTxn[] = [
    {
      category: "Beverages",
      brand: "Coca-Cola",
      brand_raw: "Coca-Cola",
      product: "Coke 500ml",
      qty: 2,
      unit: "bottles",
      unit_price: 25.00,
      total_price: 50.00,
      device: "POS-001",
      store: 1,
      storename: "SM Mall of Asia",
      storelocationmaster: "Metro Manila",
      storedeviceid: "DEV-001",
      storedevicename: "Main Counter",
      location: "Pasay City",
      transaction_id: "TXN-001",
      date_ph: "2024-01-15",
      time_ph: "14:30:00",
      day_of_week: "Monday",
      weekday_weekend: "Weekday",
      time_of_day: "Afternoon",
      payment_method: "Cash",
      bought_with_other_brands: null,
      transcript_audio: null,
      edge_version: "v1.0",
      sku: "COK500",
      ts_ph: "2024-01-15T14:30:00Z",
      facialid: null,
      gender: "Male",
      emotion: "Neutral",
      age: 25,
      agebracket: "25-34",
      storeid: 1,
      interactionid: null,
      productid: "P001",
      transactiondate: "2024-01-15",
      deviceid: "DEV-001",
      sex: "M",
      age__query_4_1: 25,
      emotionalstate: "Neutral",
      transcriptiontext: null,
      gender__query_4_1: "Male",
      barangay: "Tambo",
      storename__query_10: "SM Mall of Asia",
      location__query_10: "Pasay City",
      size: 500,
      geolatitude: 14.5352,
      geolongitude: 120.9822,
      storegeometry: null,
      managername: "Juan Dela Cruz",
      managercontactinfo: "juan@smmoa.com",
      devicename: "Main POS",
      deviceid__query_10: "DEV-001",
      barangay__query_10: "Tambo"
    }
  ];

  console.log('Using fallback sample data');
  mockData = sampleData;
  return mockData;
}

async function fetchFromSupabase(endpoint: string, options: RequestInit = {}): Promise<any> {
  if (!supabase) {
    throw new Error('Supabase not configured for supabase mode');
  }

  // Use Supabase client for data fetching
  // This is a simplified implementation - you'd use proper Supabase queries
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.statusText}`);
  }

  return response.json();
}

export async function getTransactions(page: number = 1, pageSize: number = 50): Promise<Paged<FlatTxn>> {
  if (DATA_MODE === 'supabase' && supabase) {
    try {
      const offset = (page - 1) * pageSize;
      const rows = await fetchFromSupabase(
        `scout_gold_transactions_flat?select=*&offset=${offset}&limit=${pageSize}`
      );

      // Get total count with HEAD request
      const totalResponse = await fetch(`${SUPABASE_URL}/rest/v1/scout_gold_transactions_flat?select=transaction_id`, {
        method: 'HEAD',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'count=exact'
        }
      });

      const contentRange = totalResponse.headers.get('content-range') || '';
      const total = Number((contentRange.includes('/') ? contentRange.split('/')[1] : '') || rows.length);

      return {
        rows,
        total,
        page,
        pageSize
      };
    } catch (error) {
      console.warn('Supabase fetch failed, falling back to CSV data:', error);
    }
  }

  // Default to CSV mode (fallback for supabase errors or mock_csv mode)
  const data = await loadMockData();
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    rows: data.slice(start, end),
    total: data.length,
    page,
    pageSize
  };
}

export async function getKpis(): Promise<KpiSummary> {
  if (DATA_MODE === 'supabase' && supabase) {
    try {
      const rows = await fetchFromSupabase(
        'scout_gold_transactions_flat?select=brand,store,storeid,device,deviceid,total_price,transactiondate,ts_ph,date_ph&limit=200000'
      );

      const uniqueStores = new Set(rows.map((r: any) => r.store || r.storeid)).size;
      const uniqueDevices = new Set(rows.map((r: any) => r.device || r.deviceid)).size;
      const uniqueBrands = new Set(rows.map((r: any) => r.brand)).size;
      const totalRevenue = rows.reduce((sum: number, r: any) => sum + (Number(r.total_price) || 0), 0);
      const dates = rows.map((r: any) => r.transactiondate || r.ts_ph || r.date_ph).filter(Boolean).sort();

      return {
        totalRows: rows.length,
        uniqueStores,
        uniqueDevices,
        uniqueBrands,
        totalRevenue,
        dateMin: dates[0] || null,
        dateMax: dates[dates.length - 1] || null
      };
    } catch (error) {
      console.warn('Supabase KPIs fetch failed, falling back to CSV data:', error);
    }
  }

  // Default to CSV mode (fallback for supabase errors or mock_csv mode)
  const data = await loadMockData();
  const uniqueStores = new Set(data.map(r => r.store)).size;
  const uniqueDevices = new Set(data.map(r => r.device)).size;
  const uniqueBrands = new Set(data.map(r => r.brand)).size;
  const totalRevenue = data.reduce((sum, r) => sum + (r.total_price || 0), 0);
  const dates = data.map(r => r.date_ph).filter(Boolean).sort();

  return {
    totalRows: data.length,
    uniqueStores,
    uniqueDevices,
    uniqueBrands,
    totalRevenue,
    dateMin: dates[0] || null,
    dateMax: dates[dates.length - 1] || null
  };
}

// Utility function to get current data mode for display
export function getDataMode(): string {
  return DATA_MODE;
}

// Utility function to get data source badge text
export function getDataSourceBadge(): string {
  switch (DATA_MODE) {
    case 'mock_csv':
      return 'Mock Data';
    case 'supabase':
      return 'Trusted';
    default:
      return 'Unknown';
  }
}