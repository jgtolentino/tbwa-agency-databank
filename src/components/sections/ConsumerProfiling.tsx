import React, { useState } from 'react'
import { Users, MapPin, Calendar, Percent, User, Clock } from 'lucide-react'
import MetricCard from '../cards/MetricCard'

const ConsumerProfiling = () => {
  const [filters, setFilters] = useState({
    demographic: 'all',
    location: 'all',
    timeSegment: 'all',
    loyaltyTier: 'all'
  })

  // Mock data - replace with Scout data layer
  const metrics = [
    { title: 'Unique Customers', value: 1196, change: 8.3, icon: Users },
    { title: 'Repeat Rate', value: 73, change: 4.7, icon: Percent, format: 'percent' as const },
    { title: 'Avg Visit Frequency', value: 3.2, change: 12.1, icon: Calendar },
    { title: 'Catchment Radius', value: 850, change: 2.3, icon: MapPin }
  ]

  const demographicBreakdown = [
    { segment: 'Male 25-34', percentage: 28, transactions: 1245, avgSpend: 45 },
    { segment: 'Male 35-44', percentage: 22, transactions: 987, avgSpend: 52 },
    { segment: 'Female 25-34', percentage: 18, transactions: 756, avgSpend: 38 },
    { segment: 'Male 45-54', percentage: 15, transactions: 543, avgSpend: 48 },
    { segment: 'Female 35-44', percentage: 12, transactions: 432, avgSpend: 41 },
    { segment: 'Other', percentage: 5, transactions: 189, avgSpend: 35 }
  ]

  const locationAnalysis = [
    { area: 'Within 200m', customers: 456, percentage: 38, frequency: 4.2, loyalty: 'High' },
    { area: '200-500m', customers: 342, percentage: 29, frequency: 3.1, loyalty: 'Medium' },
    { area: '500m-1km', customers: 287, percentage: 24, frequency: 2.4, loyalty: 'Medium' },
    { area: '1km+', customers: 111, percentage: 9, frequency: 1.8, loyalty: 'Low' }
  ]

  const timeBasedProfiles = [
    { timeSlot: '6-9 AM', profile: 'Commuters', characteristics: 'Quick purchases, tobacco focus', volume: 25 },
    { timeSlot: '9-12 PM', profile: 'Daily Shoppers', characteristics: 'Mix purchases, price conscious', volume: 20 },
    { timeSlot: '12-2 PM', profile: 'Lunch Break', characteristics: 'Snacks, beverages, quick', volume: 18 },
    { timeSlot: '2-5 PM', profile: 'Casual Shoppers', characteristics: 'Browse, personal care', volume: 15 },
    { timeSlot: '5-8 PM', profile: 'After Work', characteristics: 'Higher spend, comfort items', volume: 22 }
  ]

  const loyaltySegments = [
    { tier: 'VIP (Daily)', customers: 89, revenue: 45600, characteristics: 'High frequency, brand loyal' },
    { tier: 'Regular (3-5x/week)', customers: 234, revenue: 67800, characteristics: 'Consistent, price aware' },
    { tier: 'Occasional (Weekly)', customers: 456, revenue: 52300, characteristics: 'Weekend shoppers, bulk' },
    { tier: 'Infrequent (<Weekly)', customers: 417, revenue: 23100, characteristics: 'Tourists, one-time visits' }
  ]

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
    </div>
  )
}

export default ConsumerProfiling