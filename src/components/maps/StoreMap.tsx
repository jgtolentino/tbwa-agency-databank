import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { GeographicalData } from '../../services/realDataService'

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface StoreLocation {
  id: string
  name: string
  lat: number
  lng: number
  revenueShare: number
  isAnalyzed: boolean
  totalSales: number
  transactionCount: number
  avgBasketSize: number
}

interface StoreMapProps {
  geographicalData: GeographicalData[]
  className?: string
}

const StoreMap: React.FC<StoreMapProps> = ({ geographicalData, className = '' }) => {
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Transform geographical data into store locations with coordinates
    const generateStoreLocations = () => {
      const locations: StoreLocation[] = geographicalData.map((region, index) => {
        // Generate realistic coordinates for Philippines regions
        const coordinates = getRegionCoordinates(region.region)

        return {
          id: `store-${index + 1}`,
          name: `Store ${index + 108}`, // Starting from 108 like your example
          lat: coordinates.lat + (Math.random() - 0.5) * 0.1, // Add slight variation
          lng: coordinates.lng + (Math.random() - 0.5) * 0.1,
          revenueShare: region.revenueShare,
          isAnalyzed: region.revenueShare > 20, // Mark high-revenue stores as analyzed
          totalSales: region.totalSales,
          transactionCount: Math.floor(region.totalSales / 45), // Estimate transactions
          avgBasketSize: 45 + Math.random() * 10 // Realistic basket size
        }
      })

      setStoreLocations(locations)
      setLoading(false)
    }

    generateStoreLocations()
  }, [geographicalData])

  const getRegionCoordinates = (region: string) => {
    // Basic coordinates for major Philippine regions
    const regionCoords: { [key: string]: { lat: number; lng: number } } = {
      'Metro Manila': { lat: 14.5995, lng: 120.9842 },
      'Cebu': { lat: 10.3157, lng: 123.8854 },
      'Davao': { lat: 7.1907, lng: 125.4553 },
      'Baguio': { lat: 16.4023, lng: 120.5960 },
      'Iloilo': { lat: 10.7202, lng: 122.5621 },
      'Cagayan de Oro': { lat: 8.4542, lng: 124.6319 },
      'Bacolod': { lat: 10.6764, lng: 122.9515 },
      'General Santos': { lat: 6.1164, lng: 125.1716 },
      'Zamboanga': { lat: 6.9214, lng: 122.0790 },
      'Angeles': { lat: 15.1450, lng: 120.5950 }
    }

    return regionCoords[region] || { lat: 14.5995, lng: 120.9842 } // Default to Manila
  }

  const createCustomIcon = (isAnalyzed: boolean, revenueShare: number) => {
    const size = Math.max(20, Math.min(40, revenueShare * 2))
    const color = isAnalyzed ? '#e74c3c' : '#3498db'

    return L.divIcon({
      html: `<div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 10px;
      ">${Math.round(revenueShare)}%</div>`,
      className: 'custom-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    })
  }

  const getHeatCircleRadius = (revenueShare: number) => {
    return revenueShare * 1000 // Scale for visual impact
  }

  if (loading) {
    return (
      <div className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading store map...</div>
      </div>
    )
  }

  // Find the top performing store (like Store 108 in your example)
  const topStore = storeLocations.reduce((prev, current) =>
    prev.revenueShare > current.revenueShare ? prev : current
  )

  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <MapContainer
        center={[12.8797, 121.7740]} // Center of Philippines
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>

          <LayersControl.Overlay checked name="Revenue Heat Map">
            <div>
              {storeLocations.map((store) => (
                <Circle
                  key={`heat-${store.id}`}
                  center={[store.lat, store.lng]}
                  radius={getHeatCircleRadius(store.revenueShare)}
                  fillColor={store.id === topStore.id ? "#e74c3c" : "#3498db"}
                  fillOpacity={0.1 + (store.revenueShare / 100) * 0.3}
                  stroke={false}
                />
              ))}
            </div>
          </LayersControl.Overlay>

          <LayersControl.Overlay checked name="Store Locations">
            <div>
              {storeLocations.map((store) => (
                <Marker
                  key={store.id}
                  position={[store.lat, store.lng]}
                  icon={createCustomIcon(store.isAnalyzed, store.revenueShare)}
                >
                  <Popup>
                    <div className="min-w-48 p-2">
                      <h3 className="font-bold text-lg mb-2 text-gray-800">
                        {store.name}
                        {store.id === topStore.id && (
                          <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                            TOP PERFORMER
                          </span>
                        )}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Revenue Share:</span>
                          <span className="font-semibold text-blue-600">
                            {store.revenueShare.toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Sales:</span>
                          <span className="font-semibold">
                            ₱{store.totalSales.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Transactions:</span>
                          <span className="font-semibold">
                            {store.transactionCount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Basket:</span>
                          <span className="font-semibold">
                            ₱{store.avgBasketSize.toFixed(0)}
                          </span>
                        </div>

                        <div className="mt-3 pt-2 border-t">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-semibold ${
                              store.isAnalyzed ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {store.isAnalyzed ? 'Analyzed Store' : 'Network Store'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </div>
          </LayersControl.Overlay>
        </LayersControl>

        {/* Custom Legend */}
        <div className="leaflet-bottom leaflet-left">
          <div className="leaflet-control leaflet-bar" style={{
            background: 'white',
            padding: '10px',
            margin: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <div className="text-sm font-semibold mb-2">Store Legend</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                <span className="text-xs">Analyzed Store</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                <span className="text-xs">Network Store</span>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Circle size = Revenue share %
              </div>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  )
}

export default StoreMap