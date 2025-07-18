import { DashboardFilters } from '@/app/dashboard/optimized/page'

interface FilterBarProps {
  filters: DashboardFilters
  onChange: (filters: Partial<DashboardFilters>) => void
  availableFilters: {
    locations: string[]
    categories: string[]
    brands: string[]
    regions: string[]
  }
}

export function FilterBar({ filters, onChange, availableFilters }: FilterBarProps) {
  return (
    <div className="filter-bar">
      {/* Date Range */}
      <div className="filter-group">
        <label className="filter-label">Date Range</label>
        <input
          type="date"
          value={filters.dateRange.start.toISOString().split('T')[0]}
          onChange={e => onChange({
            dateRange: { ...filters.dateRange, start: new Date(e.target.value) }
          })}
          className="filter-select"
        />
        <span className="mx-2 text-gray-500">to</span>
        <input
          type="date"
          value={filters.dateRange.end.toISOString().split('T')[0]}
          onChange={e => onChange({
            dateRange: { ...filters.dateRange, end: new Date(e.target.value) }
          })}
          className="filter-select"
        />
      </div>

      {/* Region Filter */}
      <div className="filter-group">
        <label className="filter-label">Region</label>
        <select
          value={filters.region || ''}
          onChange={e => onChange({ region: e.target.value || undefined })}
          className="filter-select"
        >
          <option value="">All Regions</option>
          {availableFilters.regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select
          value={filters.category || ''}
          onChange={e => onChange({ category: e.target.value || undefined })}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {availableFilters.categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="filter-group">
        <label className="filter-label">Brand</label>
        <select
          value={filters.brand || ''}
          onChange={e => onChange({ brand: e.target.value || undefined })}
          className="filter-select"
        >
          <option value="">All Brands</option>
          {availableFilters.brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onChange({
          location: undefined,
          category: undefined,
          brand: undefined,
          region: undefined
        })}
        className="ml-auto text-sm text-blue-600 hover:text-blue-700"
      >
        Clear Filters
      </button>
    </div>
  )
}