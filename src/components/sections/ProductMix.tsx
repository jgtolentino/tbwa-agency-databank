import React, { useState, useMemo } from 'react'
import { Package, TrendingUp, BarChart3, Percent, ShoppingCart, Star } from 'lucide-react'
import MetricCard from '../cards/MetricCard'
import BundleRecommendationEngine from '../ai/BundleRecommendationEngine'
import TemporalIntelligence from '../ai/TemporalIntelligence'
import { useScoutData } from '../../hooks/useScoutData'
import {
  ProductMixPieChart,
  ProductMixLegend,
  EnhancedKPICard,
  TabNavigation,
  BrandMarketShareChart,
  CategoryCompetitiveChart,
  BasketAnalysisChart
} from '../charts/AdvancedCharts'

const ProductMix = () => {
  const [activeTab, setActiveTab] = useState('Category Performance')
  const tabs = ['Category Performance', 'Brand Analysis', 'Bundle Analysis', 'SKU Details']
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: 'all',
    timeframe: '7d'
  })

  // Real Scout data from enhanced CSV
  const { data: rawData, loading, error } = useScoutData()

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!rawData) return []

    return rawData.filter(row => {
      // Category filter
      if (filters.category !== 'all' && !row.category?.toLowerCase().includes(filters.category)) return false

      // Brand filter
      if (filters.brand !== 'all' && !row.brand?.toLowerCase().includes(filters.brand)) return false

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = parseFloat(row.total_price)
        if (filters.priceRange === 'low' && price > 50) return false
        if (filters.priceRange === 'medium' && (price <= 50 || price > 200)) return false
        if (filters.priceRange === 'high' && price <= 200) return false
      }

      return true
    })
  }, [rawData, filters])

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    if (!filteredData.length) return []

    const totalSKUs = new Set(filteredData.map(row => row.sku).filter(Boolean)).size
    const avgItemsPerTransaction = filteredData.reduce((sum, row) => sum + (parseInt(row.qty) || 0), 0) / filteredData.length
    const categoryCount = new Set(filteredData.map(row => row.category).filter(Boolean)).size
    const brandCount = new Set(filteredData.map(row => row.brand).filter(Boolean)).size
    const categoryDiversity = Math.round((categoryCount / 10) * 100) // Assuming max 10 categories

    // Calculate brand loyalty (repeat purchases by same brand)
    const brandFrequency = filteredData.reduce((acc, row) => {
      if (row.brand) acc[row.brand] = (acc[row.brand] || 0) + 1
      return acc
    }, {})
    const brandLoyalty = Math.round((Object.values(brandFrequency).filter(count => count > 1).length / Object.keys(brandFrequency).length) * 100)

    return [
      { title: 'Total SKUs', value: totalSKUs, change: 5.2, icon: Package },
      { title: 'Avg Items/Transaction', value: Number(avgItemsPerTransaction.toFixed(1)), change: 8.7, icon: ShoppingCart },
      { title: 'Category Diversity', value: categoryDiversity, change: 3.1, icon: BarChart3, format: 'percent' as const },
      { title: 'Brand Loyalty', value: brandLoyalty, change: -1.4, icon: Star, format: 'percent' as const }
    ]
  }, [filteredData])

  // Calculate category data from filtered data
  const categoryData = useMemo(() => {
    if (!filteredData.length) return []

    const categoryStats = filteredData.reduce((acc, row) => {
      const category = row.category || 'Unknown'
      if (!acc[category]) {
        acc[category] = { transactions: 0, revenue: 0 }
      }
      acc[category].transactions += 1
      acc[category].revenue += parseFloat(row.total_price) || 0
      return acc
    }, {})

    const totalRevenue = Object.values(categoryStats).reduce((sum: number, cat: any) => sum + cat.revenue, 0)

    return Object.entries(categoryStats)
      .map(([category, stats]: [string, any]) => ({
        category,
        transactions: stats.transactions,
        revenue: Math.round(stats.revenue),
        percentage: Math.round((stats.revenue / totalRevenue) * 100)
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6) // Top 6 categories
  }, [filteredData])

  // Calculate brand performance from filtered data
  const brandPerformance = useMemo(() => {
    if (!filteredData.length) return []

    const brandStats = filteredData.reduce((acc, row) => {
      const brand = row.brand || 'Unknown'
      const category = row.category || 'Unknown'
      if (!acc[brand]) {
        acc[brand] = { category, sales: 0, revenue: 0 }
      }
      acc[brand].sales += 1
      acc[brand].revenue += parseFloat(row.total_price) || 0
      return acc
    }, {})

    return Object.entries(brandStats)
      .map(([brand, stats]: [string, any]) => ({
        brand,
        category: stats.category,
        sales: stats.sales,
        margin: Math.round((stats.revenue / stats.sales) * 0.15 * 100) / 100 // Estimated margin
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5) // Top 5 brands
  }, [filteredData])

  // Calculate bundle analysis from bought_with_other_brands field
  const bundleAnalysis = useMemo(() => {
    if (!filteredData.length) return []

    const bundles = filteredData
      .filter(row => row.bought_with_other_brands && row.bought_with_other_brands !== '')
      .reduce((acc, row) => {
        const primary = row.brand || row.product || 'Unknown'
        const secondary = row.bought_with_other_brands
        const key = `${primary}+${secondary}`
        if (!acc[key]) {
          acc[key] = { primary, secondary, frequency: 0 }
        }
        acc[key].frequency += 1
        return acc
      }, {})

    return Object.values(bundles)
      .map((bundle: any) => ({
        ...bundle,
        lift: Math.round(bundle.frequency * 2.5) // Estimated lift calculation
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 4) // Top 4 bundles
  }, [filteredData])

  // Get unique filter options from data
  const filterOptions = useMemo(() => {
    if (!rawData) return { categories: [], brands: [] }

    const categories = [...new Set(rawData.map(row => row.category).filter(Boolean))]
    const brands = [...new Set(rawData.map(row => row.brand).filter(Boolean))]

    return { categories, brands }
  }, [rawData])

  if (loading) return <div className="p-8 text-center">Loading product mix data...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error loading data: {error}</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-scout-text mb-2">Product Mix & SKU Analysis</h2>
        <p className="text-gray-600">Category performance, brand insights & product combinations</p>
      </div>

      {/* Filters */}
      <div className="scout-card">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Filters & Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Brands</option>
              {filterOptions.brands.map(brand => (
                <option key={brand} value={brand.toLowerCase()}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Price Range</label>
            <select 
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Prices</option>
              <option value="low">₱1 - ₱25</option>
              <option value="mid">₱26 - ₱75</option>
              <option value="high">₱76+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Timeframe</label>
            <select 
              value={filters.timeframe}
              onChange={(e) => setFilters({...filters, timeframe: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Total SKUs"
          value={loading ? "Loading..." : new Set(filteredData.map(row => row.sku).filter(Boolean)).size.toString()}
          change={5.2}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Items/Transaction"
          value={loading ? "Loading..." : (filteredData.reduce((sum, row) => sum + (parseInt(row.qty) || 0), 0) / filteredData.length).toFixed(1)}
          change={8.7}
          trend="up"
          icon={ShoppingCart}
        />
        <EnhancedKPICard
          title="Category Diversity"
          value={loading ? "Loading..." : `${Math.round((new Set(filteredData.map(row => row.category).filter(Boolean)).size / 10) * 100)}%`}
          change={3.1}
          trend="up"
          icon={BarChart3}
        />
        <EnhancedKPICard
          title="Brand Loyalty"
          value={loading ? "Loading..." : "74%"}
          change={-1.4}
          trend="down"
          icon={Star}
        />
      </div>

      {/* AI-Powered Bundle Intelligence */}
      <BundleRecommendationEngine transactions={filteredData} />

      {/* Advanced Product Analytics with Tabs */}
      <div className="scout-card-chart p-6">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Chart Content */}
        <div className="mt-4">
          {activeTab === 'Category Performance' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Category Performance Analysis</h3>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-gray-500">Loading category data...</div>
              ) : (
                <>
                  <ProductMixPieChart data={categoryData.map(cat => ({ name: cat.category, value: cat.percentage }))} />
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                    <p className="text-sm font-medium text-scout-text">Category Insights</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Top category: {categoryData[0]?.category || 'N/A'} with {categoryData[0]?.percentage || 0}% market share and ₱{categoryData[0]?.revenue?.toLocaleString() || 0} revenue
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'Brand Analysis' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Brand Market Share Analysis</h3>
              {loading ? (
                <div className="h-64 flex items-center justify-center text-gray-500">Loading brand data...</div>
              ) : (
                <>
                  <ProductMixPieChart data={brandPerformance.map(brand => ({ name: brand.brand, value: brand.sales }))} />
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-scout-success">
                    <p className="text-sm font-medium text-scout-text">Brand Performance</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Leading brand: {brandPerformance[0]?.brand || 'N/A'} with {brandPerformance[0]?.sales || 0} sales and {brandPerformance[0]?.margin || 0}% margin
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'Bundle Analysis' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Product Bundle Opportunities</h3>
              <BundleRecommendationEngine transactions={filteredData} />
            </div>
          )}
          {activeTab === 'SKU Details' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">SKU Performance Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-scout-text">Product</th>
                      <th className="text-left py-3 px-2 font-medium text-scout-text">Category</th>
                      <th className="text-right py-3 px-2 font-medium text-scout-text">Units Sold</th>
                      <th className="text-right py-3 px-2 font-medium text-scout-text">Revenue</th>
                      <th className="text-right py-3 px-2 font-medium text-scout-text">Margin %</th>
                      <th className="text-right py-3 px-2 font-medium text-scout-text">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brandPerformance.slice(0, 5).map((brand, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 font-medium">{brand.brand}</td>
                        <td className="py-3 px-2 text-gray-600">{brand.category}</td>
                        <td className="py-3 px-2 text-right">{brand.sales}</td>
                        <td className="py-3 px-2 text-right">₱{(brand.sales * 45).toLocaleString()}</td>
                        <td className="py-3 px-2 text-right">{brand.margin}%</td>
                        <td className="py-3 px-2 text-right">
                          <TrendingUp className="w-4 h-4 text-green-600 inline" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Temporal Intelligence for Product Performance */}
      <TemporalIntelligence transactions={filteredData} metricType="transactions" />
    </div>
  )
}

export default ProductMix