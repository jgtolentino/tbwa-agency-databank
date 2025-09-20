import { createClient } from '@supabase/supabase-js'

// FOR VITE PROJECTS - Use import.meta.env with VITE_ prefix
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
                    import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
                    'https://cxzllzyxwpyptfretryc.supabase.co'  // Your actual URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
                        import.meta.env.VITE_ANON_API_KEY ||
                        import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.TKvgUGWOUPPYgqGmSLlYCy1LfkqpLhTg8jQ38h_TjeE'

// Debug logging for development
console.log('🔧 Supabase Environment Check:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0,
  allEnvVars: import.meta.env,
  mode: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
})

// Validate configuration
if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('❌ Supabase URL is not configured properly')
  throw new Error('Supabase URL is required. Please set VITE_SUPABASE_URL in your environment variables.')
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key' || supabaseAnonKey === 'YOUR_ANON_KEY_HERE') {
  console.error('❌ Supabase Anon Key is not configured properly')
  throw new Error('Supabase Anon Key is required. Please set VITE_SUPABASE_ANON_KEY in your environment variables.')
}

console.log('✅ Supabase client initialized successfully')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Data fetching functions
export const fetchSalesData = async (filters?: any) => {
  let query = supabase.from('sales_data').select('*')
  
  if (filters?.dateRange?.start) {
    query = query.gte('date', filters.dateRange.start.toISOString())
  }
  if (filters?.dateRange?.end) {
    query = query.lte('date', filters.dateRange.end.toISOString())
  }
  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  if (filters?.city) {
    query = query.eq('city', filters.city)
  }
  if (filters?.barangay) {
    query = query.eq('barangay', filters.barangay)
  }
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.brand) {
    query = query.eq('brand', filters.brand)
  }
  if (filters?.sku) {
    query = query.eq('sku', filters.sku)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching sales data:', error)
    return []
  }
  
  return data || []
}

export const fetchConsumerData = async (filters?: any) => {
  let query = supabase.from('consumer_data').select('*')
  
  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching consumer data:', error)
    return []
  }
  
  return data || []
}

export const fetchRegions = async () => {
  const { data, error } = await supabase
    .from('sales_data')
    .select('region')
    .order('region')
  
  if (error) {
    console.error('Error fetching regions:', error)
    return []
  }
  
  const uniqueRegions = [...new Set(data?.map(d => d.region) || [])]
  return uniqueRegions.map(r => ({ value: r, label: r }))
}

export const fetchCities = async (region: string) => {
  const { data, error } = await supabase
    .from('sales_data')
    .select('city')
    .eq('region', region)
    .order('city')
  
  if (error) {
    console.error('Error fetching cities:', error)
    return []
  }
  
  const uniqueCities = [...new Set(data?.map(d => d.city) || [])]
  return uniqueCities.map(c => ({ value: c, label: c }))
}

export const fetchBarangays = async (city: string) => {
  const { data, error } = await supabase
    .from('sales_data')
    .select('barangay')
    .eq('city', city)
    .order('barangay')
  
  if (error) {
    console.error('Error fetching barangays:', error)
    return []
  }
  
  const uniqueBarangays = [...new Set(data?.map(d => d.barangay) || [])]
  return uniqueBarangays.map(b => ({ value: b, label: b }))
}

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('sales_data')
    .select('category')
    .order('category')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  const uniqueCategories = [...new Set(data?.map(d => d.category) || [])]
  return uniqueCategories.map(c => ({ value: c, label: c }))
}

export const fetchBrands = async (category: string) => {
  const { data, error } = await supabase
    .from('sales_data')
    .select('brand')
    .eq('category', category)
    .order('brand')
  
  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }
  
  const uniqueBrands = [...new Set(data?.map(d => d.brand) || [])]
  return uniqueBrands.map(b => ({ value: b, label: b }))
}

export const fetchSKUs = async (brand: string) => {
  const { data, error } = await supabase
    .from('sales_data')
    .select('sku')
    .eq('brand', brand)
    .order('sku')
  
  if (error) {
    console.error('Error fetching SKUs:', error)
    return []
  }
  
  const uniqueSKUs = [...new Set(data?.map(d => d.sku) || [])]
  return uniqueSKUs.map(s => ({ value: s, label: s }))
}

// Execute custom SQL query (for Assistant)
export const executeQuery = async (sql: string) => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { query: sql })
    
    if (error) {
      console.error('Error executing query:', error)
      return { error: error.message }
    }
    
    return { data }
  } catch (err) {
    console.error('Error:', err)
    return { error: 'Failed to execute query' }
  }
}
