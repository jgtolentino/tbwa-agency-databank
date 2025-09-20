import { useState, useEffect } from 'react'
import geographicInsights from '../data/geographical_insights.json'
import { dataService } from '../services/dataService'

interface StoreLocation {
  id: number
  name: string
  lat: number
  lng: number
  revenue: number
  transactions: number
  performance: number
  analyzed: boolean
  revenue_share: number
  avg_transaction_value: number
  performance_tier: 'Top' | 'Medium' | 'Low'
  morning_revenue_est: number
  single_item_txns_est: number
  bundle_opportunity: number
}

interface GeographicInsights {
  concentration_risk: {
    store_108_dominance: number
    top_3_stores_share: number
    geographic_spread: string
    recommendation: string
  }
  performance_clusters: {
    high_performance_zone: string
    underperforming_areas: string[]
    expansion_opportunities: string[]
  }
  analyzed_vs_network: {
    analyzed_avg_revenue: number
    network_avg_revenue: number
    performance_gap: number
  }
  optimization_priorities: Array<{
    area: string
    action: string
    impact: string
  }>
}

interface UseStoreDataReturn {
  stores: StoreLocation[]
  insights: GeographicInsights
  loading: boolean
  error: string | null
}

export function useStoreData(): UseStoreDataReturn {
  const [stores, setStores] = useState<StoreLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchStoreData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch store performance from Supabase
        const storePerformance = await dataService.fetchStorePerformance(100)

        // Transform to expected format
        const transformedStores: StoreLocation[] = storePerformance.map((store, index) => {
          const revenue = Number(store.total_price) || 0
          const transactions = 1 // Placeholder, should aggregate
          const performance = revenue > 1000 ? 90 : revenue > 500 ? 70 : 50

          return {
            id: store.storeid || index + 1,
            name: store.storename || `Store ${store.storeid || index + 1}`,
            lat: Math.random() * 0.5 + 14.5, // Placeholder coordinates (Philippines region)
            lng: Math.random() * 0.5 + 121.0,
            revenue,
            transactions,
            performance,
            analyzed: true,
            revenue_share: revenue / 10000, // Placeholder calculation
            avg_transaction_value: revenue / Math.max(transactions, 1),
            performance_tier: performance > 80 ? 'Top' : performance > 60 ? 'Medium' : 'Low',
            morning_revenue_est: revenue * 0.3,
            single_item_txns_est: transactions * 0.7,
            bundle_opportunity: revenue * 0.2
          }
        })

        if (isMounted) {
          setStores(transformedStores)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch store data from Supabase:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch store data')
          setLoading(false)
        }
      }
    }

    fetchStoreData()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    stores,
    insights: geographicInsights as GeographicInsights,
    loading,
    error
  }
}