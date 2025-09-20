import { useState, useMemo } from 'react'

interface CardWithSwitcherProps {
  title: string
  views: Record<string, React.ComponentType<any>>
  data: any
  filters: any
  className?: string
}

export function CardWithSwitcher({ 
  title, 
  views, 
  data, 
  filters,
  className = ''
}: CardWithSwitcherProps) {
  const viewKeys = Object.keys(views)
  const [viewKey, setViewKey] = useState(viewKeys[0])
  
  // Get the current view component
  const ChartComponent = views[viewKey]
  
  // Get human-readable labels for the select options
  const viewLabels = useMemo(() => {
    return {
      // Transaction Trends views
      volume: 'Transaction Volume',
      revenue: 'Revenue Trend',
      basket: 'Basket Size',
      duration: 'Shopping Duration',
      
      // Product Mix views
      mix: 'Category Mix',
      pareto: 'Pareto Analysis',
      subs: 'Substitutions',
      basketHeat: 'Basket Heatmap',
      
      // Consumer Behavior views
      funnel: 'Purchase Funnel',
      methods: 'Request Methods',
      acceptance: 'Acceptance Rate',
      traits: 'Behavior Traits',
      
      // Consumer Profiling views
      demographics: 'Demographics',
      ageGender: 'Age & Gender',
      location: 'Location',
      segment: 'Segments',
      
      // Default to key if no label found
      ...Object.fromEntries(viewKeys.map(k => [k, k]))
    }
  }, [viewKeys])
  
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h4>{title}</h4>
        {viewKeys.length > 1 && (
          <select 
            value={viewKey} 
            onChange={e => setViewKey(e.target.value)}
            className="text-sm px-2 py-1 border rounded"
          >
            {viewKeys.map(key => (
              <option key={key} value={key}>
                {(viewLabels as any)[key]}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="card-body">
        <div className="chart-container">
          <ChartComponent data={data} filters={filters} />
        </div>
      </div>
    </div>
  )
}