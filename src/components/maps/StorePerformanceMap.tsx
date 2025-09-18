import React, { useMemo } from 'react'
import { MapPin, TrendingUp, DollarSign, BarChart3, Users } from 'lucide-react'
import { useStoreData } from '../../hooks/useStoreData'

interface StorePerformanceMapProps {
  className?: string
}

const StorePerformanceMap: React.FC<StorePerformanceMapProps> = ({ className = '' }) => {
  const { stores, loading, error } = useStoreData()

  // Performance summary calculations
  const performanceStats = useMemo(() => {
    if (!stores.length) return { top: 0, medium: 0, low: 0, analyzed: 0 }

    return {
      top: stores.filter(s => s.performance_tier === 'Top').length,
      medium: stores.filter(s => s.performance_tier === 'Medium').length,
      low: stores.filter(s => s.performance_tier === 'Low').length,
      analyzed: stores.filter(s => s.analyzed).length
    }
  }, [stores])

  if (loading) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Store Performance Map</h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
            <p className="text-gray-500">Loading store locations...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Store Performance Map</h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <p className="text-red-600">Error loading map: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`scout-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Store Performance Analysis</h3>
        </div>
        <div className="text-sm text-gray-500">
          {stores.length} stores analyzed
        </div>
      </div>

      {/* Store Performance List */}
      <div className="space-y-3 mb-6">
        {stores.slice(0, 10).map((store) => (
          <div key={store.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  store.performance_tier === 'Top' ? 'bg-green-500' :
                  store.performance_tier === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
              />
              <div>
                <div className="font-medium text-scout-text">{store.name}</div>
                <div className="text-sm text-gray-600">
                  {store.transactions.toLocaleString()} transactions • ₱{store.avg_transaction_value} avg
                  {store.analyzed && <span className="ml-2 text-blue-600 text-xs">• Analytics enabled</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-scout-text">₱{store.revenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{store.revenue_share.toFixed(1)}% share</div>
            </div>
          </div>
        ))}
        {stores.length > 10 && (
          <div className="text-center text-sm text-gray-500 py-2">
            ... and {stores.length - 10} more stores
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-xl font-bold text-green-600">
            {performanceStats.top}
          </div>
          <div className="text-green-700">Top Performers</div>
        </div>

        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-xl font-bold text-yellow-600">
            {performanceStats.medium}
          </div>
          <div className="text-yellow-700">Medium Performance</div>
        </div>

        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-xl font-bold text-red-600">
            {performanceStats.low}
          </div>
          <div className="text-red-700">Need Improvement</div>
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-xl font-bold text-blue-600">
            {performanceStats.analyzed}
          </div>
          <div className="text-blue-700">Analyzed Stores</div>
        </div>
      </div>

      {/* Geographic Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
        <h4 className="font-medium text-scout-text mb-2">Geographic Distribution</h4>
        <p className="text-sm text-gray-600">
          Stores concentrated in Quezon City area with Store 108 (Quezon Ave) as the flagship location.
          {performanceStats.analyzed} stores have advanced analytics capabilities enabling deeper performance insights.
        </p>
      </div>
    </div>
  )
}

export default StorePerformanceMap