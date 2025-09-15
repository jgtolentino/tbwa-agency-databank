import React, { useState } from 'react'
import { Clock, MapPin, Calendar, TrendingUp, DollarSign, Timer, ShoppingBag } from 'lucide-react'
import MetricCard from '../cards/MetricCard'

const TransactionTrends = () => {
  const [filters, setFilters] = useState({
    timeOfDay: 'all',
    location: 'all',
    category: 'all',
    weekType: 'all'
  })

  // Mock data - replace with Scout data layer
  const metrics = [
    { title: 'Total Transactions', value: 2847, change: 12.5, icon: ShoppingBag },
    { title: 'Average Value', value: 45.60, change: -2.3, icon: DollarSign, format: 'currency' as const },
    { title: 'Peak Hour Volume', value: 387, change: 8.1, icon: Clock },
    { title: 'Avg Duration', value: 42, change: -5.2, icon: Timer, format: 'time' as const }
  ]

  const timeSlots = [
    { time: '6-8 AM', transactions: 145, percentage: 15 },
    { time: '8-10 AM', transactions: 287, percentage: 30 },
    { time: '10-12 PM', transactions: 198, percentage: 21 },
    { time: '12-2 PM', transactions: 156, percentage: 16 },
    { time: '2-4 PM', transactions: 123, percentage: 13 },
    { time: '4-6 PM', transactions: 234, percentage: 24 },
    { time: '6-8 PM', transactions: 298, percentage: 31 },
    { time: '8-10 PM', transactions: 89, percentage: 9 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-scout-text mb-2">Transaction Trends</h2>
        <p className="text-gray-600">Volume, timing & patterns across locations and time periods</p>
      </div>

      {/* Filters */}
      <div className="scout-card">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Filters & Toggles</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Time of Day</label>
            <select 
              value={filters.timeOfDay}
              onChange={(e) => setFilters({...filters, timeOfDay: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Hours</option>
              <option value="morning">Morning (6-12)</option>
              <option value="afternoon">Afternoon (12-18)</option>
              <option value="evening">Evening (18-22)</option>
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
              <option value="metro">Metro Manila</option>
              <option value="cebu">Cebu</option>
              <option value="davao">Davao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Category</label>
            <select 
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Categories</option>
              <option value="tobacco">Tobacco</option>
              <option value="snacks">Snacks</option>
              <option value="personal-care">Personal Care</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-scout-text mb-2">Week Type</label>
            <select 
              value={filters.weekType}
              onChange={(e) => setFilters({...filters, weekType: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-secondary"
            >
              <option value="all">All Days</option>
              <option value="weekday">Weekdays</option>
              <option value="weekend">Weekends</option>
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

      {/* Time Distribution Chart */}
      <div className="scout-card-chart p-6">
        <h3 className="text-lg font-semibold text-scout-text mb-4">Transaction Volume by Time of Day</h3>
        <div className="space-y-3">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="w-20 text-sm text-scout-text font-medium">{slot.time}</div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-3 relative">
                  <div 
                    className="bg-scout-secondary rounded-full h-3 transition-all duration-300"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right">
                <div className="text-sm font-semibold text-scout-text">{slot.transactions}</div>
                <div className="text-xs text-gray-500">{slot.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Transaction Value Distribution</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">₱1 - ₱25</span>
              <span className="text-sm text-scout-text">45% (1,281 transactions)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">₱26 - ₱50</span>
              <span className="text-sm text-scout-text">32% (910 transactions)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">₱51 - ₱100</span>
              <span className="text-sm text-scout-text">18% (512 transactions)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium">₱100+</span>
              <span className="text-sm text-scout-text">5% (144 transactions)</span>
            </div>
          </div>
        </div>

        <div className="scout-card-chart p-6">
          <h3 className="text-lg font-semibold text-scout-text mb-4">Location Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">Metro Manila</div>
                <div className="text-xs text-gray-500">15 locations</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-scout-text">1,456</div>
                <div className="text-xs text-green-600">+12.3%</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">Cebu</div>
                <div className="text-xs text-gray-500">8 locations</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-scout-text">892</div>
                <div className="text-xs text-green-600">+8.7%</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <div className="font-medium">Davao</div>
                <div className="text-xs text-gray-500">5 locations</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-scout-text">499</div>
                <div className="text-xs text-red-600">-2.1%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionTrends