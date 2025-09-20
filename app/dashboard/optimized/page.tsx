'use client'

import { useState, useMemo, useCallback } from 'react'
import { useUser } from '@/hooks/useUser'
import { TabNav } from '@/components/navigation/TabNav'
import { FilterBar } from '@/components/filters/FilterBar'
import { OverviewGrid } from '@/components/grids/OverviewGrid'
import { DatabankGrid } from '@/components/grids/DatabankGrid'
import { TrendsGrid } from '@/components/grids/TrendsGrid'
import { AIInsightsGrid } from '@/components/grids/AIInsightsGrid'
import { useTransactionData } from '@/hooks/useTransactionData'

export interface DashboardFilters {
  dateRange: { start: Date; end: Date }
  location?: string
  category?: string
  brand?: string
  region?: string
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'databank', label: 'Databank', icon: '🗄️' },
  { id: 'trends', label: 'Trends', icon: '📈' },
  { id: 'ai-insights', label: 'AI Insights', icon: '🧞' }
] as const

type TabId = typeof TABS[number]['id']

export default function OptimizedDashboard() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    }
  })

  // Fetch data based on filters
  const { data, loading, error } = useTransactionData(filters)

  // Apply filters with memoization for performance
  const filteredData = useMemo(() => {
    if (!data) return []
    
    return data.filter(item => {
      if (filters.location && item.store_id !== filters.location) return false
      if (filters.category && item.category !== filters.category) return false
      if (filters.brand && item.brand !== filters.brand) return false
      if (filters.region && item.region !== filters.region) return false
      
      const itemDate = new Date(item.timestamp)
      if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) return false
      
      return true
    })
  }, [data, filters])

  // Pre-aggregate data for performance (15,000+ records)
  const aggregatedData = useMemo(() => {
    if (!filteredData.length) return null
    
    return {
      totalRevenue: filteredData.reduce((sum, item) => sum + item.peso_value, 0),
      totalTransactions: filteredData.length,
      avgBasketSize: filteredData.reduce((sum, item) => sum + item.peso_value, 0) / filteredData.length,
      topCategories: aggregateByField(filteredData, 'category'),
      topBrands: aggregateByField(filteredData, 'brand'),
      dailyMetrics: aggregateByDate(filteredData),
      regionMetrics: aggregateByField(filteredData, 'region')
    }
  }, [filteredData])

  const handleFilterChange = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Scout Databank</h1>
              <span className="ml-3 text-sm text-gray-500">
                Welcome, {(user as any)?.full_name || 'User'} ({(user as any)?.role})
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar 
        filters={filters} 
        onChange={handleFilterChange}
        availableFilters={{
          locations: getUniqueValues(data || [], 'store_id'),
          categories: getUniqueValues(data || [], 'category'),
          brands: getUniqueValues(data || [], 'brand'),
          regions: getUniqueValues(data || [], 'region')
        }}
      />

      {/* Tab Navigation */}
      <TabNav 
        tabs={TABS} 
        activeTab={activeTab} 
        onSelect={(tabId) => setActiveTab(tabId as TabId)}
      />

      {/* Main Content Grid */}
      <main className="grid-container">
        {loading && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="col-span-full">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error loading data: {error.message}
            </div>
          </div>
        )}

        {!loading && !error && aggregatedData && (
          <>
            {activeTab === 'overview' && (
              <OverviewGrid 
                data={filteredData} 
                aggregated={aggregatedData}
                filters={filters} 
                userRole={(user as any)?.role}
              />
            )}
            
            {activeTab === 'databank' && (
              <DatabankGrid 
                data={filteredData} 
                aggregated={aggregatedData}
                filters={filters} 
              />
            )}
            
            {activeTab === 'trends' && (
              <TrendsGrid 
                data={filteredData} 
                aggregated={aggregatedData}
                filters={filters} 
              />
            )}
            
            {activeTab === 'ai-insights' && (
              <AIInsightsGrid 
                data={filteredData} 
                aggregated={aggregatedData}
                filters={filters} 
                userRole={(user as any)?.role}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

// Helper functions
function getUniqueValues<T>(data: T[], field: keyof T): string[] {
  return Array.from(new Set(data.map(item => String(item[field]))).values()).filter(Boolean)
}

function aggregateByField(data: any[], field: string) {
  const result: Record<string, { count: number; revenue: number }> = {}
  
  data.forEach(item => {
    const key = item[field] || 'Unknown'
    if (!result[key]) {
      result[key] = { count: 0, revenue: 0 }
    }
    result[key].count++
    result[key].revenue += item.peso_value
  })
  
  return Object.entries(result)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.revenue - a.revenue)
}

function aggregateByDate(data: any[]) {
  const result: Record<string, { count: number; revenue: number }> = {}
  
  data.forEach(item => {
    const date = new Date(item.timestamp).toISOString().split('T')[0]
    if (!result[date]) {
      result[date] = { count: 0, revenue: 0 }
    }
    result[date].count++
    result[date].revenue += item.peso_value
  })
  
  return Object.entries(result)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => a.date.localeCompare(b.date))
}