'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Users, Package, Activity } from 'lucide-react'

interface KPIData {
  revenue: number
  revenueChange: number
  customerSatisfaction: number
  projectDeliveryRate: number
  clientRetention: number
  creativePerformance: number
}

interface TrendData {
  date: string
  revenue: number
  transactions: number
  avgTransactionValue: number
}

export default function ExecutiveDashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      // Load daily metrics for KPIs
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const { data: metrics } = await supabase
        .from('daily_metrics')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString())
        .order('date', { ascending: true })

      if (metrics && metrics.length > 0) {
        // Calculate KPIs
        const totalRevenue = metrics.reduce((sum, m) => sum + Number(m.total_revenue), 0)
        const previousRevenue = metrics
          .slice(0, 15)
          .reduce((sum, m) => sum + Number(m.total_revenue), 0)
        const currentRevenue = metrics
          .slice(15)
          .reduce((sum, m) => sum + Number(m.total_revenue), 0)
        
        const revenueChange = previousRevenue > 0 
          ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
          : 0

        setKpiData({
          revenue: totalRevenue,
          revenueChange,
          customerSatisfaction: 87.5,
          projectDeliveryRate: 94.2,
          clientRetention: 91.8,
          creativePerformance: 88.9
        })

        // Prepare trend data
        const trends = metrics.map(m => ({
          date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: Number(m.total_revenue),
          transactions: m.total_transactions,
          avgTransactionValue: Number(m.avg_transaction_value || 0)
        }))
        setTrendData(trends)
      }

      // Load AI summary
      const { data: insights } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('insight_type', 'executive_summary')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (insights) {
        setAiSummary(insights.content)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading executive insights...</div>
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

  return (
    <div className="space-y-6">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold mt-1">
                ₱{kpiData?.revenue.toLocaleString() || '0'}
              </p>
              <div className="flex items-center mt-2">
                {kpiData?.revenueChange && kpiData.revenueChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+{kpiData.revenueChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-red-500 text-sm">{kpiData?.revenueChange.toFixed(1)}%</span>
                  </>
                )}
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Customer Satisfaction</p>
              <p className="text-3xl font-bold mt-1">{kpiData?.customerSatisfaction}%</p>
              <p className="text-green-500 text-sm mt-2">+2.3% from last month</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Project Delivery Rate</p>
              <p className="text-3xl font-bold mt-1">{kpiData?.projectDeliveryRate}%</p>
              <p className="text-yellow-500 text-sm mt-2">3 projects at risk</p>
            </div>
            <Package className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Creative Performance</p>
              <p className="text-3xl font-bold mt-1">{kpiData?.creativePerformance}%</p>
              <p className="text-purple-500 text-sm mt-2">Above industry avg</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
            Executive AI Summary
          </h3>
          <p className="text-gray-300 leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {/* Revenue Trend Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Revenue Trend (30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Transaction Volume</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="transactions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Category Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Electronics', value: 35 },
                    { name: 'Groceries', value: 25 },
                    { name: 'Fashion', value: 20 },
                    { name: 'Other', value: 20 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}