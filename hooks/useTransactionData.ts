import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { DashboardFilters } from '@/app/dashboard/optimized/page'

interface Transaction {
  transaction_id: string
  store_id: string
  region: string
  timestamp: string
  peso_value: number
  units: number
  category: string
  brand: string
  customer_id?: string
}

export function useTransactionData(filters: DashboardFilters) {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Build query
        let query = supabase
          .from('transactions')
          .select('*')
          .gte('timestamp', filters.dateRange.start.toISOString())
          .lte('timestamp', filters.dateRange.end.toISOString())
          .order('timestamp', { ascending: false })
          .limit(10000) // Limit for performance

        // Apply filters
        if (filters.location) {
          query = query.eq('store_id', filters.location)
        }
        if (filters.region) {
          query = query.eq('region', filters.region)
        }
        if (filters.category) {
          query = query.eq('category', filters.category)
        }
        if (filters.brand) {
          query = query.eq('brand', filters.brand)
        }

        const { data, error } = await query

        if (error) throw error
        setData(data || [])
      } catch (err) {
        console.error('Error fetching transaction data:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters, supabase])

  return { data, loading, error }
}