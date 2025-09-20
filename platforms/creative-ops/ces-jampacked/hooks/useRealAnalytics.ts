import { useState, useEffect } from 'react'
import { getRealAnalytics, type RealAnalytics, type FilterOptions } from '../services/realDataService'

export const useRealAnalytics = (filters?: FilterOptions) => {
  const [data, setData] = useState<RealAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const analytics = await getRealAnalytics(filters)
        setData(analytics)
        setError(null)
      } catch (err) {
        console.error('Failed to load analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filters])

  const refresh = async () => {
    try {
      setLoading(true)
      const analytics = await getRealAnalytics(filters)
      setData(analytics)
      setError(null)
    } catch (err) {
      console.error('Failed to refresh analytics:', err)
      setError('Failed to refresh analytics data')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refresh }
}