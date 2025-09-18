import { useState, useEffect } from 'react'
import geographicInsights from '../data/geographical_insights.json'

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

function parseCSV(csvText: string): StoreLocation[] {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',')
      const row: any = {}

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || ''
        row[header.trim()] = value
      })

      return {
        id: parseInt(row.id),
        name: row.name,
        lat: parseFloat(row.lat),
        lng: parseFloat(row.lng),
        revenue: parseInt(row.revenue),
        transactions: parseInt(row.transactions),
        performance: parseInt(row.performance),
        analyzed: row.analyzed === 'True',
        revenue_share: parseFloat(row.revenue_share),
        avg_transaction_value: parseFloat(row.avg_transaction_value),
        performance_tier: row.performance_tier as 'Top' | 'Medium' | 'Low',
        morning_revenue_est: parseFloat(row.morning_revenue_est),
        single_item_txns_est: parseInt(row.single_item_txns_est),
        bundle_opportunity: parseInt(row.bundle_opportunity)
      } as StoreLocation
    })
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

        // Fetch store analytics CSV
        const response = await fetch('/data/store_analytics.csv')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const csvText = await response.text()
        const parsedStores = parseCSV(csvText)

        if (isMounted) {
          setStores(parsedStores)
          setLoading(false)
        }
      } catch (err) {
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