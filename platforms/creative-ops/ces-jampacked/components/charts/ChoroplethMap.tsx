import React, { useState } from 'react'
import { MapPin, TrendingUp, TrendingDown, Info } from 'lucide-react'

interface RegionData {
  id: string
  name: string
  value: number
  stores: number
  growth: number
  marketShare: number
  coordinates: { x: number; y: number; width: number; height: number }
}

interface ChoroplethMapProps {
  title?: string
  metric?: 'revenue' | 'transactions' | 'customers' | 'growth'
  data?: RegionData[]
}

// Philippines regions data with approximate SVG coordinates
const defaultRegionData: RegionData[] = [
  {
    id: 'ncr',
    name: 'Metro Manila (NCR)',
    value: 2850000,
    stores: 45,
    growth: 12.5,
    marketShare: 35.2,
    coordinates: { x: 270, y: 280, width: 40, height: 30 }
  },
  {
    id: 'car',
    name: 'Cordillera (CAR)',
    value: 420000,
    stores: 8,
    growth: 8.3,
    marketShare: 5.1,
    coordinates: { x: 260, y: 200, width: 50, height: 60 }
  },
  {
    id: 'region1',
    name: 'Ilocos Region',
    value: 680000,
    stores: 12,
    growth: 7.8,
    marketShare: 8.4,
    coordinates: { x: 240, y: 160, width: 60, height: 80 }
  },
  {
    id: 'region2',
    name: 'Cagayan Valley',
    value: 520000,
    stores: 9,
    growth: 6.2,
    marketShare: 6.4,
    coordinates: { x: 300, y: 140, width: 70, height: 60 }
  },
  {
    id: 'region3',
    name: 'Central Luzon',
    value: 1650000,
    stores: 28,
    growth: 10.1,
    marketShare: 20.4,
    coordinates: { x: 250, y: 240, width: 70, height: 50 }
  },
  {
    id: 'region4a',
    name: 'CALABARZON',
    value: 1420000,
    stores: 32,
    growth: 14.2,
    marketShare: 17.5,
    coordinates: { x: 260, y: 290, width: 60, height: 70 }
  },
  {
    id: 'region5',
    name: 'Bicol Region',
    value: 720000,
    stores: 15,
    growth: 5.6,
    marketShare: 8.9,
    coordinates: { x: 290, y: 360, width: 80, height: 90 }
  },
  {
    id: 'region6',
    name: 'Western Visayas',
    value: 980000,
    stores: 18,
    growth: 9.4,
    marketShare: 12.1,
    coordinates: { x: 230, y: 450, width: 70, height: 60 }
  },
  {
    id: 'region7',
    name: 'Central Visayas',
    value: 1150000,
    stores: 22,
    growth: 11.8,
    marketShare: 14.2,
    coordinates: { x: 290, y: 480, width: 90, height: 70 }
  },
  {
    id: 'region8',
    name: 'Eastern Visayas',
    value: 620000,
    stores: 11,
    growth: 4.7,
    marketShare: 7.7,
    coordinates: { x: 350, y: 450, width: 70, height: 80 }
  },
  {
    id: 'region9',
    name: 'Zamboanga Peninsula',
    value: 580000,
    stores: 10,
    growth: 6.8,
    marketShare: 7.2,
    coordinates: { x: 200, y: 580, width: 80, height: 60 }
  },
  {
    id: 'region10',
    name: 'Northern Mindanao',
    value: 750000,
    stores: 14,
    growth: 8.9,
    marketShare: 9.3,
    coordinates: { x: 280, y: 560, width: 70, height: 50 }
  },
  {
    id: 'region11',
    name: 'Davao Region',
    value: 920000,
    stores: 17,
    growth: 10.6,
    marketShare: 11.4,
    coordinates: { x: 320, y: 600, width: 80, height: 70 }
  },
  {
    id: 'region12',
    name: 'SOCCSKSARGEN',
    value: 650000,
    stores: 12,
    growth: 7.1,
    marketShare: 8.0,
    coordinates: { x: 260, y: 620, width: 60, height: 50 }
  },
  {
    id: 'caraga',
    name: 'Caraga',
    value: 480000,
    stores: 8,
    growth: 5.3,
    marketShare: 5.9,
    coordinates: { x: 360, y: 560, width: 60, height: 80 }
  },
  {
    id: 'barmm',
    name: 'BARMM',
    value: 340000,
    stores: 6,
    growth: 4.1,
    marketShare: 4.2,
    coordinates: { x: 200, y: 640, width: 100, height: 60 }
  }
]

export const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ 
  title = "Regional Performance Map",
  metric = 'revenue',
  data = defaultRegionData 
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'transactions' | 'customers' | 'growth'>(metric)

  // Calculate color intensity based on metric value
  const getRegionColor = (region: RegionData) => {
    const maxValue = Math.max(...data.map(r => {
      switch (selectedMetric) {
        case 'revenue': return r.value
        case 'transactions': return r.stores * 1000
        case 'customers': return r.stores * 500
        case 'growth': return r.growth
        default: return r.value
      }
    }))
    
    const currentValue = (() => {
      switch (selectedMetric) {
        case 'revenue': return region.value
        case 'transactions': return region.stores * 1000
        case 'customers': return region.stores * 500
        case 'growth': return region.growth
        default: return region.value
      }
    })()
    
    const intensity = currentValue / maxValue
    
    if (intensity > 0.8) return '#1e40af' // Dark blue
    if (intensity > 0.6) return '#3b82f6' // Blue
    if (intensity > 0.4) return '#60a5fa' // Light blue
    if (intensity > 0.2) return '#93c5fd' // Very light blue
    return '#dbeafe' // Lightest blue
  }

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
      case 'revenue': return 'Revenue'
      case 'transactions': return 'Transactions'
      case 'customers': return 'Customers'
      case 'growth': return 'Growth Rate'
      default: return 'Revenue'
    }
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
        {/* Map */}
        <div className="lg:col-span-2 relative">
          <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden border">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 500 800"
              className="w-full h-full"
            >
              {/* Philippines outline */}
              <defs>
                <pattern id="water" patternUnits="userSpaceOnUse" width="4" height="4">
                  <rect width="4" height="4" fill="#f0f9ff"/>
                  <circle cx="2" cy="2" r="0.5" fill="#bfdbfe" opacity="0.3"/>
                </pattern>
              </defs>
              
              {/* Background */}
              <rect width="500" height="800" fill="url(#water)" />
              
              {/* Regions */}
              {data.map((region) => (
                <rect
                  key={region.id}
                  x={region.coordinates.x}
                  y={region.coordinates.y}
                  width={region.coordinates.width}
                  height={region.coordinates.height}
                  fill={getRegionColor(region)}
                  stroke="#ffffff"
                  strokeWidth="2"
                  rx="4"
                  className="cursor-pointer transition-all duration-200 hover:stroke-gray-400 hover:opacity-80"
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              ))}
              
              {/* Region labels for major areas */}
              {data.filter(r => ['ncr', 'region3', 'region7', 'region11'].includes(r.id)).map((region) => (
                <text
                  key={`label-${region.id}`}
                  x={region.coordinates.x + region.coordinates.width / 2}
                  y={region.coordinates.y + region.coordinates.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-white"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                >
                  {region.id === 'ncr' ? 'NCR' : 
                   region.id === 'region3' ? 'C.LUZ' :
                   region.id === 'region7' ? 'C.VIS' :
                   region.id === 'region11' ? 'DAVAO' : ''}
                </text>
              ))}
            </svg>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 border">
            <div className="text-xs font-medium text-gray-700 mb-2">{getMetricLabel()}</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Low</span>
              <div className="flex space-x-1">
                {['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#1e40af'].map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-3 rounded-sm border border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">High</span>
            </div>
          </div>
        </div>

        {/* Region Details */}
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
                      <div 
                        className="w-3 h-3 rounded-full border border-white"
                        style={{ backgroundColor: getRegionColor(region) }}
                      />
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
              <div className="text-2xl font-bold text-scout-secondary">
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
                <p className="font-medium mb-1">Interactive Map</p>
                <p>Hover over regions to see detailed metrics. Use the metric buttons to change the visualization focus.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}