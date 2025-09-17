import React, { useState, useEffect, useMemo, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { MapPin, TrendingUp, TrendingDown, Info } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

interface RegionData {
  id: string
  name: string
  value: number
  stores: number
  growth: number
  marketShare: number
}

interface MapboxChoroplethMapProps {
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

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiamd0b2xlbnRpbm8iLCJhIjoiY21jMmNycWRiMDc0ajJqcHZoaDYyeTJ1NiJ9.Dns6WOql16BUQ4l7otaeww'

mapboxgl.accessToken = MAPBOX_TOKEN

export const MapboxChoroplethMap: React.FC<MapboxChoroplethMapProps> = ({ 
  title = "Regional Performance Map",
  metric = 'revenue',
  data = defaultRegionData 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'transactions' | 'customers' | 'growth'>(metric)
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null)

  // Create data mapping for choropleth
  const dataMap = useMemo(() => {
    return data.reduce((acc, region) => {
      const value = (() => {
        switch (selectedMetric) {
          case 'revenue': return region.value
          case 'transactions': return region.stores * 1000
          case 'customers': return region.stores * 500
          case 'growth': return region.growth
          default: return region.value
        }
      })()
      acc[region.id] = { ...region, currentValue: value }
      return acc
    }, {} as Record<string, RegionData & { currentValue: number }>)
  }, [data, selectedMetric])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [122.0, 12.5],
      zoom: 5.2
    })

    map.current.on('load', () => {
      // Load Philippines GeoJSON
      fetch('/geo/philippines-regions.json')
        .then(r => r.json())
        .then(geojson => {
          if (!map.current) return

          // Add source
          map.current.addSource('philippines-regions', {
            type: 'geojson',
            data: geojson
          })

          // Add fill layer
          map.current.addLayer({
            id: 'philippines-fill',
            type: 'fill',
            source: 'philippines-regions',
            paint: {
              'fill-color': '#dbeafe',
              'fill-opacity': 0.8
            }
          })

          // Add border layer
          map.current.addLayer({
            id: 'philippines-border',
            type: 'line',
            source: 'philippines-regions',
            paint: {
              'line-color': '#ffffff',
              'line-width': 2
            }
          })

          // Add hover functionality
          map.current.on('mouseenter', 'philippines-fill', (e) => {
            if (map.current) {
              map.current.getCanvasContainer().style.cursor = 'pointer'
              
              if (e.features && e.features[0]?.properties) {
                const regionId = e.features[0].properties.REGION
                const regionData = dataMap[regionId]
                if (regionData) {
                  setHoveredRegion(regionData)
                }
              }
            }
          })

          map.current.on('mouseleave', 'philippines-fill', () => {
            if (map.current) {
              map.current.getCanvasContainer().style.cursor = ''
              setHoveredRegion(null)
            }
          })
        })
        .catch(err => console.error('Failed to load GeoJSON:', err))
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update choropleth colors when data changes
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return

    const values = Object.values(dataMap).map(d => d.currentValue)
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)

    // Create expression for choropleth coloring
    const expression: any[] = [
      'case',
      ['!=', ['get', 'REGION'], null],
      [
        'interpolate',
        ['linear'],
        [
          'case',
          ...Object.keys(dataMap).flatMap(regionId => [
            ['==', ['get', 'REGION'], regionId],
            dataMap[regionId].currentValue
          ]),
          0
        ],
        minValue,
        '#dbeafe',
        minValue + (maxValue - minValue) * 0.25,
        '#93c5fd',
        minValue + (maxValue - minValue) * 0.5,
        '#60a5fa',
        minValue + (maxValue - minValue) * 0.75,
        '#3b82f6',
        maxValue,
        '#1d4ed8'
      ],
      '#e5e7eb'
    ]

    map.current.setPaintProperty('philippines-fill', 'fill-color', expression)
  }, [dataMap])

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


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapbox Map */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
            <div ref={mapContainer} className="w-full h-full" />
          </div>
        </div>

        {/* Region Details Panel */}
        <div className="space-y-4">
          {hoveredRegion && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 text-white">
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
                .map((region) => (
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
                <p className="font-medium mb-1">Mapbox GL Choropleth</p>
                <p>Interactive map with real Philippines boundaries. Hover over regions for detailed metrics.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}