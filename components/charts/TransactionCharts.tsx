import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface ChartProps {
  data: any
  filters?: any
}

export function VolumeBarChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    if (!data?.dailyMetrics) return []
    return data.dailyMetrics.slice(-7).map((d: any) => ({
      date: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
      volume: d.count
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          labelStyle={{ color: '#1e293b' }}
        />
        <Bar dataKey="volume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RevenueLineChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    if (!data?.dailyMetrics) return []
    return data.dailyMetrics.slice(-30).map((d: any) => ({
      date: new Date(d.date).toLocaleDateString('en', { day: 'numeric', month: 'short' }),
      revenue: d.revenue
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          labelStyle={{ color: '#1e293b' }}
          formatter={(value: any) => `₱${value.toLocaleString()}`}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function BasketSizeChart({ data }: ChartProps) {
  const chartData = useMemo(() => {
    if (!data?.dailyMetrics) return []
    return data.dailyMetrics.slice(-14).map((d: any) => ({
      date: new Date(d.date).toLocaleDateString('en', { day: 'numeric' }),
      avgBasket: d.revenue / d.count
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickFormatter={(value) => `₱${value.toFixed(0)}`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          labelStyle={{ color: '#1e293b' }}
          formatter={(value: any) => `₱${value.toFixed(2)}`}
        />
        <Line 
          type="monotone" 
          dataKey="avgBasket" 
          stroke="#f59e0b" 
          strokeWidth={2}
          dot={{ fill: '#f59e0b', r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DurationBarChart({ data }: ChartProps) {
  // Mock duration data - replace with actual calculation
  const chartData = [
    { duration: '0-5 min', count: 120 },
    { duration: '5-10 min', count: 200 },
    { duration: '10-20 min', count: 150 },
    { duration: '20-30 min', count: 80 },
    { duration: '30+ min', count: 50 }
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis type="number" stroke="#64748b" fontSize={12} />
        <YAxis type="category" dataKey="duration" stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          labelStyle={{ color: '#1e293b' }}
        />
        <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}