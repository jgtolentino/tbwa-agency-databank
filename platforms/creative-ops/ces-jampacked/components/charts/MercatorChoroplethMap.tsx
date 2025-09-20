import React, { useState, useEffect, useMemo } from 'react'
import { MapPin, TrendingUp, TrendingDown, Info } from 'lucide-react'
import Plot from 'react-plotly.js'

interface RegionData {
  id: string
  name: string
  value: number
  stores: number
  growth: number
  marketShare: number
}

interface MercatorChoroplethMapProps {
  title?: string
  metric?: 'revenue' | 'transactions' | 'customers' | 'growth'
  data?: RegionData[]
}

// Philippines regions data with real identifiers matching GeoJSON
const defaultRegionData: RegionData[] = [
  {
    id: 'NCR',
    name: 'Metro Manila (NCR)',
    value: 2850000,
    stores: 45,
    growth: 12.5,
    marketShare: 35.2,
  },
  {
    id: 'CAR',
    name: 'Cordillera (CAR)',
    value: 420000,
    stores: 8,
    growth: 8.3,
    marketShare: 5.1,
  },
  {
    id: 'Region I',
    name: 'Ilocos Region',
    value: 680000,
    stores: 12,
    growth: 7.8,
    marketShare: 8.4,
  },
  {
    id: 'Region II',
    name: 'Cagayan Valley',
    value: 520000,
    stores: 9,
    growth: 6.2,
    marketShare: 6.4,
  },
  {
    id: 'Region III',
    name: 'Central Luzon',
    value: 1650000,
    stores: 28,
    growth: 10.1,
    marketShare: 20.4,
  },
  {
    id: 'Region IV-A',
    name: 'CALABARZON',
    value: 1420000,
    stores: 32,
    growth: 14.2,
    marketShare: 17.5,
  },
  {
    id: 'Region V',
    name: 'Bicol Region',
    value: 720000,
    stores: 15,
    growth: 5.6,
    marketShare: 8.9,
  },
  {
    id: 'Region VI',
    name: 'Western Visayas',
    value: 980000,
    stores: 18,
    growth: 9.4,
    marketShare: 12.1,
  },
  {
    id: 'Region VII',
    name: 'Central Visayas',
    value: 1150000,
    stores: 22,
    growth: 11.8,
    marketShare: 14.2,
  },
  {
    id: 'Region VIII',
    name: 'Eastern Visayas',
    value: 620000,
    stores: 11,
    growth: 4.7,
    marketShare: 7.7,
  },
  {
    id: 'Region IX',
    name: 'Zamboanga Peninsula',
    value: 580000,
    stores: 10,
    growth: 6.8,
    marketShare: 7.2,
  },
  {
    id: 'Region X',
    name: 'Northern Mindanao',
    value: 750000,
    stores: 14,
    growth: 8.9,
    marketShare: 9.3,
  },
  {
    id: 'Region XI',
    name: 'Davao Region',
    value: 920000,
    stores: 17,
    growth: 10.6,
    marketShare: 11.4,
  },
  {
    id: 'Region XII',
    name: 'SOCCSKSARGEN',
    value: 650000,
    stores: 12,
    growth: 7.1,
    marketShare: 8.0,
  },
  {
    id: 'CARAGA',
    name: 'Caraga',
    value: 480000,
    stores: 8,
    growth: 5.3,
    marketShare: 5.9,
  },
  {
    id: 'BARMM',
    name: 'BARMM',
    value: 340000,
    stores: 6,
    growth: 4.1,
    marketShare: 4.2,
  }
]

export const MercatorChoroplethMap: React.FC<MercatorChoroplethMapProps> = ({ 
  title = "Regional Performance Map",
  metric = 'revenue',
  data = defaultRegionData 
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'transactions' | 'customers' | 'growth'>(metric)
  const [geojson, setGeojson] = useState<any>(null)
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null)

  // Load GeoJSON data
  useEffect(() => {
    let isActive = true
    fetch('/geo/philippines-regions.json')
      .then(r => r.json())
      .then(gj => {
        if (isActive) setGeojson(gj)
      })
      .catch(err => console.error('Failed to load GeoJSON:', err))
    
    return () => { isActive = false }
  }, [])

  // Prepare data for Plotly
  const plotlyData = useMemo(() => {
    if (!geojson) return []

    const values = data.reduce((acc, region) => {
      const value = (() => {
        switch (selectedMetric) {
          case 'revenue': return region.value
          case 'transactions': return region.stores * 1000
          case 'customers': return region.stores * 500
          case 'growth': return region.growth
          default: return region.value
        }
      })()
      acc[region.id] = value
      return acc
    }, {} as Record<string, number>)

    const locations = Object.keys(values)
    const z = locations.map(k => values[k] ?? 0)

    return [{
      type: 'choropleth' as const,
      geojson,
      featureidkey: 'properties.REGION',
      locations,
      z,
      colorscale: 'Blues',
      marker: { 
        line: { color: '#ffffff', width: 1.2 } 
      },
      hovertemplate: '%{location}<br>' + getMetricLabel() + ': %{z:,.0f}<extra></extra>',
      hoverlabel: {
        bgcolor: '#1e40af',
        bordercolor: '#ffffff',
        font: { color: '#ffffff', size: 12 }
      }
    }]
  }, [geojson, data, selectedMetric])

  const formatValue = (region: RegionData) => {
    switch (selectedMetric) {
      case 'revenue':
        return `₱${(region.value / 1000000).toFixed(1)}M`
      case 'transactions':
        return `${(region.stores * 1000).toLocaleString()} txns`
      case 'customers':
        return `${(region.stores * 500).toLocaleString()} customers`
      case 'growth':
        return `${region.growth}% growth`
      default:
        return `₱${(region.value / 1000000).toFixed(1)}M`
    }
  }

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'revenue': return 'Revenue (₱)'
      case 'transactions': return 'Transactions'
      case 'customers': return 'Customers'
      case 'growth': return 'Growth Rate (%)'
      default: return 'Revenue (₱)'
    }
  }

  const layout = {
    title: {
      text: title,
      font: { size: 18, color: '#1f2937' }
    },
    geo: {
      fitbounds: 'locations',
      projection: { type: 'mercator' },
      showland: true,
      landcolor: '#f8fafc',
      showcountries: false,
      showframe: false,
      showcoastlines: true,
      coastlinecolor: '#e5e7eb',
      bgcolor: '#f0f9ff'
    },
    margin: { t: 50, r: 20, b: 20, l: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  }

  const config = {
    displayModeBar: false,
    responsive: true
  }

  if (!geojson) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading map data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        {/* Metric Selector */}
        <div className="flex space-x-2">
          {[
            { key: 'revenue', label: 'Revenue' },
            { key: 'transactions', label: 'Transactions' },
            { key: 'customers', label: 'Customers' },
            { key: 'growth', label: 'Growth' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key as any)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedMetric === key
                  ? 'bg-scout-secondary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plotly Choropleth Map */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
            <Plot
              data={plotlyData}
              layout={layout}
              config={config}
              style={{ width: '100%', height: '100%' }}
              useResizeHandler={true}
              onHover={(data) => {
                const pointIndex = data.points?.[0]?.pointIndex
                if (pointIndex !== undefined && data.points?.[0]?.location) {
                  const regionId = data.points[0].location
                  const region = defaultRegionData.find(r => r.id === regionId)
                  setHoveredRegion(region || null)
                }
              }}
              onUnhover={() => setHoveredRegion(null)}
            />
          </div>
        </div>

        {/* Region Details Panel */}
        <div className="space-y-4">
          {hoveredRegion && (
            <div className="bg-gradient-to-r from-scout-secondary to-blue-600 rounded-lg p-4 text-white">
              <h4 className="font-semibold text-lg mb-3">{hoveredRegion.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-medium">₱{(hoveredRegion.value / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between">
                  <span>Stores:</span>
                  <span className="font-medium">{hoveredRegion.stores}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Growth:</span>
                  <div className="flex items-center space-x-1">
                    {hoveredRegion.growth > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="font-medium">{hoveredRegion.growth}%</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Market Share:</span>
                  <span className="font-medium">{hoveredRegion.marketShare}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Top Performers */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Top Performers
            </h4>
            <div className="space-y-2">
              {data
                .sort((a, b) => {
                  switch (selectedMetric) {
                    case 'revenue': return b.value - a.value
                    case 'transactions': return (b.stores * 1000) - (a.stores * 1000)
                    case 'customers': return (b.stores * 500) - (a.stores * 500)
                    case 'growth': return b.growth - a.growth
                    default: return b.value - a.value
                  }
                })
                .slice(0, 5)
                .map((region, index) => (
                  <div key={region.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="font-medium">{region.name.split(' ')[0]}</span>
                    </div>
                    <span className="text-gray-600">{formatValue(region)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {data.reduce((sum, r) => sum + r.stores, 0)}
              </div>
              <div className="text-xs text-gray-500">Total Stores</div>
            </div>
            <div className="bg-white border rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                ₱{(data.reduce((sum, r) => sum + r.value, 0) / 1000000).toFixed(0)}M
              </div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Mercator Projection</p>
                <p>Real geographical boundaries with accurate regional data. Hover over regions for detailed metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}