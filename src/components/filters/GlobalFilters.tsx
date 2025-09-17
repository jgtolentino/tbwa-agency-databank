import React, { useState } from 'react'
import { Calendar, MapPin, Package, Filter, Download, RefreshCw } from 'lucide-react'

export interface FilterState {
  timeframe: string
  location: string
  category: string
  brand: string
}

interface GlobalFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onRefresh: () => void
  onExport: (format: 'pdf' | 'excel') => void
}

export const GlobalFilters = ({ 
  filters, 
  onFilterChange, 
  onRefresh, 
  onExport 
}: GlobalFiltersProps) => {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  return (
    <div className="scout-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-scout-text flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Global Filters & Controls
        </h3>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={onRefresh}
            className="scout-btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="scout-btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            
            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button 
                    onClick={() => {
                      onExport('pdf')
                      setExportDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button 
                    onClick={() => {
                      onExport('excel')
                      setExportDropdownOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Time Period Filter */}
        <div>
          <label className="block text-sm font-medium text-scout-text mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Time Period
          </label>
          <select 
            value={filters.timeframe}
            onChange={(e) => updateFilter('timeframe', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-scout-text mb-2 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Location
          </label>
          <select 
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
          >
            <option value="all">All Locations</option>
            <option value="metro-manila">Metro Manila</option>
            <option value="luzon">Luzon</option>
            <option value="visayas">Visayas</option>
            <option value="mindanao">Mindanao</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-scout-text mb-2 flex items-center">
            <Package className="w-4 h-4 mr-1" />
            Category
          </label>
          <select 
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
          >
            <option value="all">All Categories</option>
            <option value="beverages">Beverages</option>
            <option value="snacks">Snacks</option>
            <option value="personal-care">Personal Care</option>
            <option value="household">Household</option>
            <option value="tobacco">Tobacco</option>
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-scout-text mb-2 flex items-center">
            <Package className="w-4 h-4 mr-1" />
            Brand
          </label>
          <select 
            value={filters.brand}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
          >
            <option value="all">All Brands</option>
            <option value="brand-a">Brand A</option>
            <option value="brand-b">Brand B</option>
            <option value="brand-c">Brand C</option>
            <option value="unbranded">Unbranded</option>
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.timeframe !== 'today' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-scout-secondary text-white">
            {filters.timeframe === '7d' ? 'Last 7 Days' : 
             filters.timeframe === '30d' ? 'Last 30 Days' : 
             filters.timeframe === '90d' ? 'Last 90 Days' : 
             'Custom Range'}
          </span>
        )}
        {filters.location !== 'all' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {filters.location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        )}
        {filters.category !== 'all' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {filters.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        )}
        {filters.brand !== 'all' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {filters.brand.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        )}
      </div>
    </div>
  )
}

// Export utility functions
export const exportToPDF = () => {
  // Mock PDF export functionality
  console.log('Exporting to PDF...')
  // In a real implementation, you would use a library like jsPDF or Puppeteer
  alert('PDF export functionality would be implemented here')
}

export const exportToExcel = () => {
  // Mock Excel export functionality
  console.log('Exporting to Excel...')
  // In a real implementation, you would use a library like xlsx or similar
  alert('Excel export functionality would be implemented here')
}

// Compare toggle component (from Scout dashboard)
export const CompareToggle = ({ 
  enabled, 
  onChange 
}: { 
  enabled: boolean
  onChange: (enabled: boolean) => void 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id="compare-toggle"
        checked={enabled}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-scout-secondary focus:ring-scout-secondary"
      />
      <label htmlFor="compare-toggle" className="text-sm font-medium text-scout-text">
        Compare with previous period
      </label>
    </div>
  )
}