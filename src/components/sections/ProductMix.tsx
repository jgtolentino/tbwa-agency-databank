import React, { useState } from 'react'
import { Package, TrendingUp, BarChart3, Percent, ShoppingCart, Star } from 'lucide-react'
import MetricCard from '../cards/MetricCard'

const ProductMix = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: 'all',
    timeframe: '7d'
  })

  // Mock data - replace with Scout data layer
  const metrics = [
    { title: 'Total SKUs', value: 1247, change: 5.2, icon: Package },
    { title: 'Avg Items/Transaction', value: 2.3, change: 8.7, icon: ShoppingCart },
    { title: 'Category Diversity', value: 85, change: 3.1, icon: BarChart3, format: 'percent' as const },
    { title: 'Brand Loyalty', value: 67, change: -1.4, icon: Star, format: 'percent' as const }
  ]

  const categoryData = [
    { category: 'Tobacco Products', transactions: 2847, revenue: 142350, percentage: 45 },
    { category: 'Snacks & Beverages', transactions: 1923, revenue: 67305, percentage: 30 },
    { category: 'Personal Care', transactions: 1156, revenue: 34680, percentage: 18 },
    { category: 'Household Items', transactions: 445, revenue: 11125, percentage: 7 }
  ]

  const brandPerformance = [
    { brand: 'Marlboro', category: 'Tobacco', sales: 1245, margin: 15.2 },
    { brand: 'Lucky Strike', category: 'Tobacco', sales: 987, margin: 14.8 },
    { brand: 'Coca-Cola', category: 'Beverages', sales: 756, margin: 22.5 },
    { brand: 'Pringles', category: 'Snacks', sales: 543, margin: 18.7 },
    { brand: 'Colgate', category: 'Personal Care', sales: 432, margin: 25.3 }
  ]

  const bundleAnalysis = [
    { primary: 'Marlboro', secondary: 'Energy Drink', frequency: 23, lift: 45 },
    { primary: 'Snacks', secondary: 'Soft Drinks', frequency: 18, lift: 32 },
    { primary: 'Shampoo', secondary: 'Conditioner', frequency: 15, lift: 67 },
    { primary: 'Chips', secondary: 'Beer', frequency: 12, lift: 28 }
  ]

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
              <option value="tobacco">Tobacco Products</option>
              <option value="snacks">Snacks & Beverages</option>
              <option value="personal-care">Personal Care</option>
              <option value="household">Household Items</option>
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
              <option value="marlboro">Marlboro</option>
              <option value="coca-cola">Coca-Cola</option>
              <option value="pringles">Pringles</option>
              <option value="colgate">Colgate</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Category Performance */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Category Performance Overview</h3>
        <div className="space-y-4">
          {categoryData.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-scout-text">{category.category}</div>
                <div className="text-sm text-gray-500">{category.transactions} transactions</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3 relative">
                  <div 
                    className="bg-scout-secondary rounded-full h-3 transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-scout-text">₱{category.revenue.toLocaleString()}</div>
                <div className="text-sm text-gray-500">{category.percentage}% of sales</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Performance & Bundle Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Top Brand Performance</h3>
          <div className="space-y-3">
            {brandPerformance.map((brand, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-scout-text">{brand.brand}</div>
                  <div className="text-xs text-gray-500">{brand.category}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-scout-text">{brand.sales}</div>
                  <div className="text-xs text-gray-500">units sold</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${brand.margin > 20 ? 'text-green-600' : 'text-scout-text'}`}>
                    {brand.margin}%
                  </div>
                  <div className="text-xs text-gray-500">margin</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Product Bundle Analysis</h3>
          <div className="space-y-3">
            {bundleAnalysis.map((bundle, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-scout-text">
                    {bundle.primary} + {bundle.secondary}
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    +{bundle.lift}% lift
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Bundle frequency: {bundle.frequency}%</span>
                  <span>Cross-sell opportunity</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SKU Performance Details */}
      <div className="scout-card-chart p-6">
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
              <tr className="border-b border-gray-100">
                <td className="py-3 px-2 font-medium">Marlboro Red</td>
                <td className="py-3 px-2 text-gray-600">Tobacco</td>
                <td className="py-3 px-2 text-right">1,245</td>
                <td className="py-3 px-2 text-right">₱87,150</td>
                <td className="py-3 px-2 text-right">15.2%</td>
                <td className="py-3 px-2 text-right">
                  <TrendingUp className="w-4 h-4 text-green-600 inline" />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-2 font-medium">Coca-Cola 350ml</td>
                <td className="py-3 px-2 text-gray-600">Beverages</td>
                <td className="py-3 px-2 text-right">756</td>
                <td className="py-3 px-2 text-right">₱22,680</td>
                <td className="py-3 px-2 text-right">22.5%</td>
                <td className="py-3 px-2 text-right">
                  <TrendingUp className="w-4 h-4 text-green-600 inline" />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-2 font-medium">Pringles Original</td>
                <td className="py-3 px-2 text-gray-600">Snacks</td>
                <td className="py-3 px-2 text-right">543</td>
                <td className="py-3 px-2 text-right">₱32,580</td>
                <td className="py-3 px-2 text-right">18.7%</td>
                <td className="py-3 px-2 text-right">
                  <TrendingUp className="w-4 h-4 text-green-600 inline" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductMix