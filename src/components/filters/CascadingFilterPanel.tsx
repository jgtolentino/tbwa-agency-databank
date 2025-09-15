import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Filter, X, Calendar, MapPin, Package, Target, Clock, RefreshCw } from 'lucide-react'

export interface CascadingFilterState {
  // Comparison Mode
  comparisonMode: 'single' | 'between' | 'among'
  
  // Brands
  selectedBrands: string[]
  brandComparison: 'vs' | 'and' | 'or'
  
  // Categories  
  selectedCategories: string[]
  categoryComparison: 'vs' | 'and' | 'or'
  
  // Locations
  selectedRegions: string[]
  selectedStores: string[]
  locationComparison: 'vs' | 'and' | 'or'
  
  // Time Periods
  timePeriod: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
  dateRange: {
    start: string
    end: string
  }
  temporalComparison: 'current' | 'previous' | 'delta' | 'trend'
  
  // Advanced Filters
  customerSegment: string[]
  transactionType: string[]
  priceRange: [number, number]
  
  // Display Options
  showTrends: boolean
  showDeltas: boolean
  showPercentages: boolean
}

interface CascadingFilterPanelProps {
  isCollapsed: boolean
  onToggle: () => void
  filters: CascadingFilterState
  onFilterChange: (filters: CascadingFilterState) => void
  onReset: () => void
  onApply: () => void
}

const mockData = {
  brands: ['Coca-Cola', 'Pepsi', 'Sprite', 'Fanta', 'Mountain Dew', 'Dr Pepper', 'Red Bull', 'Monster'],
  categories: ['Beverages', 'Snacks', 'Dairy', 'Bakery', 'Meat', 'Produce', 'Household', 'Personal Care'],
  regions: ['Metro Manila', 'Cebu', 'Davao', 'Baguio', 'Iloilo', 'Cagayan de Oro', 'Bacolod', 'General Santos'],
  stores: ['Store 001 - BGC', 'Store 002 - Makati', 'Store 003 - Ortigas', 'Store 004 - QC', 'Store 005 - Manila'],
  customerSegments: ['Premium', 'Regular', 'Budget', 'VIP', 'New Customer', 'Loyal Customer'],
  transactionTypes: ['Cash', 'Card', 'E-wallet', 'Points', 'Combo Payment']
}

export const CascadingFilterPanel: React.FC<CascadingFilterPanelProps> = ({
  isCollapsed,
  onToggle,
  filters,
  onFilterChange,
  onReset,
  onApply
}) => {
  const [expandedSections, setExpandedSections] = useState({
    comparison: true,
    brands: true,
    categories: false,
    locations: false,
    time: false,
    advanced: false,
    display: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilter = (key: keyof CascadingFilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    })
  }

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const ComparisonModeSelector = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium text-tbwa-black">
        <Target className="w-4 h-4" />
        <span>Analysis Mode</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: 'single', label: 'Single', desc: 'One entity' },
          { value: 'between', label: 'Between', desc: 'Two entities' },
          { value: 'among', label: 'Among', desc: 'Multiple entities' }
        ].map(mode => (
          <button
            key={mode.value}
            onClick={() => updateFilter('comparisonMode', mode.value)}
            className={`p-2 text-xs rounded-md border transition-colors ${
              filters.comparisonMode === mode.value
                ? 'bg-scout-secondary text-white border-scout-secondary'
                : 'bg-white text-tbwa-black text-opacity-80 border-tbwa-yellow border-opacity-30 hover:bg-tbwa-yellow bg-opacity-5'
            }`}
          >
            <div className="font-medium">{mode.label}</div>
            <div className="text-xs opacity-75">{mode.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )

  const MultiSelectWithComparison = ({ 
    title, 
    icon, 
    items, 
    selected, 
    onSelectionChange, 
    comparison, 
    onComparisonChange 
  }: {
    title: string
    icon: React.ReactNode
    items: string[]
    selected: string[]
    onSelectionChange: (selected: string[]) => void
    comparison: 'vs' | 'and' | 'or'
    onComparisonChange: (comparison: 'vs' | 'and' | 'or') => void
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm font-medium text-tbwa-black">
          {icon}
          <span>{title}</span>
        </div>
        <div className="text-xs text-tbwa-black text-opacity-70">
          {selected.length} selected
        </div>
      </div>

      {/* Comparison Type */}
      {selected.length > 1 && (
        <div className="flex space-x-1">
          {[
            { value: 'vs', label: 'VS', desc: 'Compare against' },
            { value: 'and', label: 'AND', desc: 'Include all' },
            { value: 'or', label: 'OR', desc: 'Include any' }
          ].map(comp => (
            <button
              key={comp.value}
              onClick={() => onComparisonChange(comp.value as 'vs' | 'and' | 'or')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                comparison === comp.value
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-tbwa-lightGray text-tbwa-black text-opacity-80 hover:bg-tbwa-yellow hover:bg-opacity-20'
              }`}
              title={comp.desc}
            >
              {comp.label}
            </button>
          ))}
        </div>
      )}

      {/* Selection Grid */}
      <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
        {items.map(item => (
          <label key={item} className="flex items-center space-x-2 text-sm hover:bg-tbwa-yellow bg-opacity-5 p-1 rounded">
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onSelectionChange(toggleArrayItem(selected, item))}
              className="rounded border-tbwa-yellow text-scout-secondary focus:ring-scout-secondary"
            />
            <span className="flex-1">{item}</span>
          </label>
        ))}
      </div>
    </div>
  )

  const TimePeriodSelector = () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium text-tbwa-black">
        <Calendar className="w-4 h-4" />
        <span>Time Period</span>
      </div>

      {/* Period Selection */}
      <div className="grid grid-cols-2 gap-1 text-xs">
        {[
          { value: 'realtime', label: 'Real-time' },
          { value: 'hourly', label: 'Hourly' },
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'yearly', label: 'Yearly' },
          { value: 'custom', label: 'Custom' }
        ].map(period => (
          <button
            key={period.value}
            onClick={() => updateFilter('timePeriod', period.value)}
            className={`p-2 rounded border transition-colors ${
              filters.timePeriod === period.value
                ? 'bg-scout-secondary text-white border-scout-secondary'
                : 'bg-white text-tbwa-black text-opacity-80 border-tbwa-yellow border-opacity-30 hover:bg-tbwa-yellow bg-opacity-5'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      {filters.timePeriod === 'custom' && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-tbwa-black text-opacity-80 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                className="w-full text-xs border border-tbwa-yellow border-opacity-30 rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-xs text-tbwa-black text-opacity-80 mb-1">End Date</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                className="w-full text-xs border border-tbwa-yellow border-opacity-30 rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Temporal Comparison */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-tbwa-black text-opacity-80">Temporal Analysis</div>
        <div className="grid grid-cols-2 gap-1">
          {[
            { value: 'current', label: 'Current' },
            { value: 'previous', label: 'vs Previous' },
            { value: 'delta', label: 'Show Delta' },
            { value: 'trend', label: 'Trend Analysis' }
          ].map(temp => (
            <button
              key={temp.value}
              onClick={() => updateFilter('temporalComparison', temp.value)}
              className={`p-1 text-xs rounded border transition-colors ${
                filters.temporalComparison === temp.value
                  ? 'bg-orange-100 text-orange-700 border-orange-200'
                  : 'bg-white text-tbwa-black text-opacity-80 border-tbwa-yellow border-opacity-30 hover:bg-tbwa-yellow bg-opacity-5'
              }`}
            >
              {temp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const FilterSection = ({ title, isExpanded, onToggle, children }: {
    title: string
    isExpanded: boolean
    onToggle: () => void
    children: React.ReactNode
  }) => (
    <div className="border border-tbwa-yellow border-opacity-30 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-tbwa-yellow bg-opacity-5"
      >
        <span className="font-medium text-tbwa-black">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-tbwa-black text-opacity-70" />
        ) : (
          <ChevronDown className="w-4 h-4 text-tbwa-black text-opacity-70" />
        )}
      </button>
      {isExpanded && (
        <div className="p-3 border-t border-tbwa-yellow border-opacity-30">
          {children}
        </div>
      )}
    </div>
  )

  if (isCollapsed) {
    return (
      <div className="w-12 bg-white border-l border-tbwa-yellow border-opacity-30 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 text-tbwa-black text-opacity-70 hover:text-scout-secondary hover:bg-tbwa-yellow bg-opacity-5 rounded-lg transition-colors"
          title="Expand Filters"
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white border-l border-tbwa-yellow border-opacity-30 flex flex-col max-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-tbwa-yellow border-opacity-30">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-scout-secondary" />
          <h3 className="font-semibold text-tbwa-black">Advanced Filters</h3>
        </div>
        <button
          onClick={onToggle}
          className="p-1 text-tbwa-black text-opacity-70 hover:text-tbwa-black rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Comparison Mode */}
        <FilterSection
          title="Analysis Mode"
          isExpanded={expandedSections.comparison}
          onToggle={() => toggleSection('comparison')}
        >
          <ComparisonModeSelector />
        </FilterSection>

        {/* Brands */}
        <FilterSection
          title="Brands"
          isExpanded={expandedSections.brands}
          onToggle={() => toggleSection('brands')}
        >
          <MultiSelectWithComparison
            title="Brand Selection"
            icon={<Package className="w-4 h-4" />}
            items={mockData.brands}
            selected={filters.selectedBrands}
            onSelectionChange={(selected) => updateFilter('selectedBrands', selected)}
            comparison={filters.brandComparison}
            onComparisonChange={(comparison) => updateFilter('brandComparison', comparison)}
          />
        </FilterSection>

        {/* Categories */}
        <FilterSection
          title="Categories"
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <MultiSelectWithComparison
            title="Category Selection"
            icon={<Package className="w-4 h-4" />}
            items={mockData.categories}
            selected={filters.selectedCategories}
            onSelectionChange={(selected) => updateFilter('selectedCategories', selected)}
            comparison={filters.categoryComparison}
            onComparisonChange={(comparison) => updateFilter('categoryComparison', comparison)}
          />
        </FilterSection>

        {/* Locations */}
        <FilterSection
          title="Locations"
          isExpanded={expandedSections.locations}
          onToggle={() => toggleSection('locations')}
        >
          <div className="space-y-4">
            <MultiSelectWithComparison
              title="Regions"
              icon={<MapPin className="w-4 h-4" />}
              items={mockData.regions}
              selected={filters.selectedRegions}
              onSelectionChange={(selected) => updateFilter('selectedRegions', selected)}
              comparison={filters.locationComparison}
              onComparisonChange={(comparison) => updateFilter('locationComparison', comparison)}
            />
            <MultiSelectWithComparison
              title="Stores"
              icon={<MapPin className="w-4 h-4" />}
              items={mockData.stores}
              selected={filters.selectedStores}
              onSelectionChange={(selected) => updateFilter('selectedStores', selected)}
              comparison={filters.locationComparison}
              onComparisonChange={(comparison) => updateFilter('locationComparison', comparison)}
            />
          </div>
        </FilterSection>

        {/* Time Period */}
        <FilterSection
          title="Time & Temporal Analysis"
          isExpanded={expandedSections.time}
          onToggle={() => toggleSection('time')}
        >
          <TimePeriodSelector />
        </FilterSection>

        {/* Advanced Filters */}
        <FilterSection
          title="Advanced Filters"
          isExpanded={expandedSections.advanced}
          onToggle={() => toggleSection('advanced')}
        >
          <div className="space-y-4">
            <MultiSelectWithComparison
              title="Customer Segments"
              icon={<Target className="w-4 h-4" />}
              items={mockData.customerSegments}
              selected={filters.customerSegment}
              onSelectionChange={(selected) => updateFilter('customerSegment', selected)}
              comparison="and"
              onComparisonChange={() => {}}
            />
            <MultiSelectWithComparison
              title="Transaction Types"
              icon={<Clock className="w-4 h-4" />}
              items={mockData.transactionTypes}
              selected={filters.transactionType}
              onSelectionChange={(selected) => updateFilter('transactionType', selected)}
              comparison="or"
              onComparisonChange={() => {}}
            />
            
            {/* Price Range */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-tbwa-black">Price Range (₱)</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                  className="text-xs border border-tbwa-yellow border-opacity-30 rounded px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  className="text-xs border border-tbwa-yellow border-opacity-30 rounded px-2 py-1"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Display Options */}
        <FilterSection
          title="Display Options"
          isExpanded={expandedSections.display}
          onToggle={() => toggleSection('display')}
        >
          <div className="space-y-3">
            {[
              { key: 'showTrends', label: 'Show Trends', desc: 'Display trend indicators' },
              { key: 'showDeltas', label: 'Show Deltas', desc: 'Display change values' },
              { key: 'showPercentages', label: 'Show Percentages', desc: 'Display percentage values' }
            ].map(option => (
              <label key={option.key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={filters[option.key as keyof CascadingFilterState] as boolean}
                  onChange={(e) => updateFilter(option.key as keyof CascadingFilterState, e.target.checked)}
                  className="rounded border-tbwa-yellow text-scout-secondary focus:ring-scout-secondary"
                />
                <div>
                  <div className="text-sm font-medium text-tbwa-black">{option.label}</div>
                  <div className="text-xs text-tbwa-black text-opacity-70">{option.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Actions */}
      <div className="border-t border-tbwa-yellow border-opacity-30 p-4 space-y-3">
        <div className="flex space-x-2">
          <button
            onClick={onApply}
            className="flex-1 bg-scout-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 font-medium text-sm"
          >
            Apply Filters
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 border border-tbwa-yellow text-tbwa-black rounded-lg hover:bg-tbwa-yellow bg-opacity-5 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        
        {/* Filter Summary */}
        <div className="text-xs text-tbwa-black text-opacity-70 space-y-1">
          <div>Mode: <span className="font-medium">{filters.comparisonMode}</span></div>
          <div>Brands: <span className="font-medium">{filters.selectedBrands.length}</span></div>
          <div>Categories: <span className="font-medium">{filters.selectedCategories.length}</span></div>
          <div>Locations: <span className="font-medium">{filters.selectedRegions.length + filters.selectedStores.length}</span></div>
          <div>Period: <span className="font-medium">{filters.timePeriod}</span></div>
        </div>
      </div>
    </div>
  )
}