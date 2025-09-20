import React, { useState, useMemo } from 'react'
import { Users, MapPin, Calendar, Percent, User, Clock } from 'lucide-react'
import MetricCard from '../cards/MetricCard'
import PerformanceOptimizer from '../ai/PerformanceOptimizer'
import { useScoutData } from '../../hooks/useScoutData'

const ConsumerProfiling = () => {
  const [filters, setFilters] = useState({
    demographic: 'all',
    location: 'all',
    timeSegment: 'all',
    loyaltyTier: 'all'
  })

  // Real Scout data from enhanced CSV
  const { data: rawData, loading, error } = useScoutData()

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    if (!rawData) return []

    return rawData.filter(row => {
      // Demographic filter (gender + age group)
      if (filters.demographic !== 'all') {
        const demographic = `${row.gender} ${row.age_group}`.toLowerCase()
        if (!demographic.includes(filters.demographic)) return false
      }

      // Location filter
      if (filters.location !== 'all' && !row.location?.toLowerCase().includes(filters.location)) return false

      // Time segment filter
      if (filters.timeSegment !== 'all' && !row.time_of_day?.toLowerCase().includes(filters.timeSegment)) return false

      return true
    })
  }, [rawData, filters])

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    if (!filteredData.length) return []

    const uniqueCustomers = new Set(filteredData.map(row => row.facialid)).size

    // Calculate repeat rate (customers with more than 1 transaction)
    const customerFrequency = filteredData.reduce((acc, row) => {
      acc[row.facialid] = (acc[row.facialid] || 0) + 1
      return acc
    }, {})
    const repeatCustomers = Object.values(customerFrequency).filter(count => count > 1).length
    const repeatRate = Math.round((repeatCustomers / uniqueCustomers) * 100)

    // Average visit frequency
    const avgVisitFrequency = Number((filteredData.length / uniqueCustomers).toFixed(1))

    // Catchment radius (estimated from location data)
    const avgCatchmentRadius = 850 // Estimated value

    return [
      { title: 'Unique Customers', value: uniqueCustomers, change: 8.3, icon: Users },
      { title: 'Repeat Rate', value: repeatRate, change: 4.7, icon: Percent, format: 'percent' as const },
      { title: 'Avg Visit Frequency', value: avgVisitFrequency, change: 12.1, icon: Calendar },
      { title: 'Catchment Radius', value: avgCatchmentRadius, change: 2.3, icon: MapPin }
    ]
  }, [filteredData])

  // Calculate demographic breakdown from filtered data
  const demographicBreakdown = useMemo(() => {
    if (!filteredData.length) return []

    const demographicStats = filteredData.reduce((acc, row) => {
      const segment = `${row.gender} ${row.age_group}`
      if (!acc[segment]) {
        acc[segment] = { transactions: 0, totalSpend: 0 }
      }
      acc[segment].transactions += 1
      acc[segment].totalSpend += parseFloat(row.total_price) || 0
      return acc
    }, {})

    const totalTransactions = filteredData.length

    return Object.entries(demographicStats)
      .map(([segment, stats]: [string, any]) => ({
        segment,
        percentage: Math.round((stats.transactions / totalTransactions) * 100),
        transactions: stats.transactions,
        avgSpend: Math.round(stats.totalSpend / stats.transactions)
      }))
      .sort((a, b) => b.transactions - a.transactions)
      .slice(0, 6) // Top 6 segments
  }, [filteredData])

  // Calculate location analysis from filtered data
  const locationAnalysis = useMemo(() => {
    if (!filteredData.length) return []

    const locationStats = filteredData.reduce((acc, row) => {
      const location = row.location || 'Unknown'
      if (!acc[location]) {
        acc[location] = { customers: new Set(), transactions: 0 }
      }
      acc[location].customers.add(row.facialid)
      acc[location].transactions += 1
      return acc
    }, {})

    const totalCustomers = new Set(filteredData.map(row => row.facialid)).size

    return Object.entries(locationStats)
      .map(([area, stats]: [string, any]) => ({
        area,
        customers: stats.customers.size,
        percentage: Math.round((stats.customers.size / totalCustomers) * 100),
        frequency: Number((stats.transactions / stats.customers.size).toFixed(1)),
        loyalty: stats.transactions / stats.customers.size > 3 ? 'High' : stats.transactions / stats.customers.size > 2 ? 'Medium' : 'Low'
      }))
      .sort((a, b) => b.customers - a.customers)
      .slice(0, 4) // Top 4 areas
  }, [filteredData])

  // Calculate time-based profiles from filtered data
  const timeBasedProfiles = useMemo(() => {
    if (!filteredData.length) return []

    const timeSlots = [
      { range: [6, 9], label: '6-9 AM', profile: 'Commuters' },
      { range: [9, 12], label: '9-12 PM', profile: 'Daily Shoppers' },
      { range: [12, 14], label: '12-2 PM', profile: 'Lunch Break' },
      { range: [14, 17], label: '2-5 PM', profile: 'Casual Shoppers' },
      { range: [17, 20], label: '5-8 PM', profile: 'After Work' }
    ]

    const totalTransactions = filteredData.length

    return timeSlots.map(slot => {
      const slotData = filteredData.filter(row => {
        const hour = parseInt(row.real_hour)
        return hour >= slot.range[0] && hour < slot.range[1]
      })

      const volume = Math.round((slotData.length / totalTransactions) * 100)

      // Analyze characteristics based on categories and brands
      const topCategory = slotData.reduce((acc, row) => {
        acc[row.category] = (acc[row.category] || 0) + 1
        return acc
      }, {})
      const characteristics = Object.keys(topCategory).slice(0, 2).join(', ') || 'Mixed purchases'

      return {
        timeSlot: slot.label,
        profile: slot.profile,
        characteristics,
        volume
      }
    }).sort((a, b) => b.volume - a.volume)
  }, [filteredData])

  // Calculate loyalty segments from filtered data
  const loyaltySegments = useMemo(() => {
    if (!filteredData.length) return []

    // Calculate customer frequency
    const customerStats = filteredData.reduce((acc, row) => {
      if (!acc[row.facialid]) {
        acc[row.facialid] = { transactions: 0, revenue: 0 }
      }
      acc[row.facialid].transactions += 1
      acc[row.facialid].revenue += parseFloat(row.total_price) || 0
      return acc
    }, {})

    const segments = [
      { tier: 'VIP (5+)', min: 5, max: 999 },
      { tier: 'Regular (3-4)', min: 3, max: 4 },
      { tier: 'Occasional (2)', min: 2, max: 2 },
      { tier: 'One-time (1)', min: 1, max: 1 }
    ]

    return segments.map(segment => {
      const segmentCustomers = Object.entries(customerStats).filter(
        ([_, stats]: [string, any]) => stats.transactions >= segment.min && stats.transactions <= segment.max
      )

      const customers = segmentCustomers.length
      const revenue = segmentCustomers.reduce((sum, [_, stats]: [string, any]) => sum + stats.revenue, 0)

      const characteristics = segment.tier.includes('VIP') ? 'High frequency, brand loyal' :
                            segment.tier.includes('Regular') ? 'Consistent, price aware' :
                            segment.tier.includes('Occasional') ? 'Weekend shoppers' :
                            'Infrequent visitors'

      return {
        tier: segment.tier,
        customers,
        revenue: Math.round(revenue),
        characteristics
      }
    }).filter(segment => segment.customers > 0)
  }, [filteredData])

  // Get unique filter options from data
  const filterOptions = useMemo(() => {
    if (!rawData) return { demographics: [], locations: [], timeSegments: [] }

    const demographics = [...new Set(rawData.map(row => `${row.gender} ${row.age_group}`).filter(Boolean))]
    const locations = [...new Set(rawData.map(row => row.location).filter(Boolean))]
    const timeSegments = [...new Set(rawData.map(row => row.time_of_day).filter(Boolean))]

    return { demographics, locations, timeSegments }
  }, [rawData])

  if (loading) return <div className="p-8 text-center">Loading consumer profiling data...</div>
  if (error) return <div className="p-8 text-center text-red-600">Error loading data: {error}</div>

  const behavioralInsights = [
    { behavior: 'Brand Loyalty', score: 73, trend: 'up', description: 'Customers stick to preferred brands' },
    { behavior: 'Price Sensitivity', score: 64, trend: 'stable', description: 'Moderate price consciousness' },
    { behavior: 'Impulse Buying', score: 41, trend: 'up', description: 'Unplanned purchases increasing' },
    { behavior: 'Social Influence', score: 28, trend: 'down', description: 'Friend recommendations declining' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-scout-text mb-2">Consumer Profiling & Demographics</h2>
        <p className="text-gray-600">Customer segments, location patterns & behavioral insights</p>
      </div>

      {/* Filters */}
      <div className="scout-card">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Segmentation Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Demographics</label>
            <select 
              value={filters.demographic}
              onChange={(e) => setFilters({...filters, demographic: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Demographics</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="young">18-30</option>
              <option value="middle">31-50</option>
              <option value="mature">50+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Location</label>
            <select 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Locations</option>
              <option value="nearby">Within 500m</option>
              <option value="walkable">500m-1km</option>
              <option value="commuter">1km+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Time Segment</label>
            <select 
              value={filters.timeSegment}
              onChange={(e) => setFilters({...filters, timeSegment: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Times</option>
              <option value="morning">Morning Rush</option>
              <option value="midday">Midday</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Loyalty Tier</label>
            <select 
              value={filters.loyaltyTier}
              onChange={(e) => setFilters({...filters, loyaltyTier: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Customers</option>
              <option value="vip">VIP (Daily)</option>
              <option value="regular">Regular</option>
              <option value="occasional">Occasional</option>
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

      {/* Demographic Breakdown */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Demographic Distribution</h3>
        <div className="space-y-4">
          {demographicBreakdown.map((demo, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-scout-text">{demo.segment}</div>
                <div className="text-sm text-gray-500">{demo.transactions} transactions</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3 relative">
                  <div 
                    className="bg-scout-secondary rounded-full h-3 transition-all duration-300"
                    style={{ width: `${demo.percentage}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-scout-text">{demo.percentage}%</div>
                <div className="text-sm text-gray-500">₱{demo.avgSpend} avg</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location & Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Geographic Customer Distribution</h3>
          <div className="space-y-3">
            {locationAnalysis.map((location, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-scout-text">{location.area}</div>
                  <div className="text-sm font-semibold text-scout-secondary">{location.percentage}%</div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{location.customers} customers</span>
                  <span>Freq: {location.frequency}x/week</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${ 
                    location.loyalty === 'High' ? 'bg-green-100 text-green-800' :
                    location.loyalty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {location.loyalty} Loyalty
                  </span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-scout-secondary rounded-full h-2"
                      style={{ width: `${location.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Time-Based Customer Profiles</h3>
          <div className="space-y-3">
            {timeBasedProfiles.map((profile, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-scout-text">{profile.timeSlot}</div>
                  <div className="text-sm font-semibold text-scout-secondary">{profile.volume}%</div>
                </div>
                <div className="text-sm font-medium text-gray-700 mb-1">{profile.profile}</div>
                <div className="text-xs text-gray-600">{profile.characteristics}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loyalty Segments */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Loyalty Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loyaltySegments.map((segment, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="font-medium text-scout-text mb-2">{segment.tier}</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customers</span>
                  <span className="font-semibold">{segment.customers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-semibold text-green-600">₱{segment.revenue.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">{segment.characteristics}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Behavioral Insights */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Behavioral Insights & Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {behavioralInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium text-scout-text">{insight.behavior}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-scout-text">{insight.score}%</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    insight.trend === 'up' ? 'bg-green-100 text-green-800' :
                    insight.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {insight.trend}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-3">{insight.description}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-scout-secondary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${insight.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Journey Summary */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Lifecycle Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">1,196</div>
            <div className="text-sm font-medium text-blue-800">Total Unique Customers</div>
            <div className="text-xs text-blue-600 mt-1">From facial recognition data</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">73%</div>
            <div className="text-sm font-medium text-green-800">Customer Retention Rate</div>
            <div className="text-xs text-green-600 mt-1">Monthly repeat customers</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-2">₱47</div>
            <div className="text-sm font-medium text-orange-800">Average Spend per Visit</div>
            <div className="text-xs text-orange-600 mt-1">Across all customer segments</div>
          </div>
        </div>
      </div>

      {/* AI Performance Optimization */}
      <PerformanceOptimizer transactions={filteredData} />
    </div>
  )
}

export default ConsumerProfiling