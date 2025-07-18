import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export function TrendLineChart({ data, metric }: { data: any; metric: string }) {
  const chartData = data[metric === 'revenue' ? 'daily' : 'weekly'] || []
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={metric === 'revenue' ? 'date' : 'week'} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={metric} stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MovingAverageChart({ data, periods = [7, 14, 30] }: { data: any[]; periods?: number[] }) {
  return <div className="text-center text-gray-500 py-8">Moving Average Chart</div>
}

export function SeasonalityChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="avgRevenue" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function GrowthRateChart({ data }: { data: any }) {
  return <div className="text-center text-gray-500 py-8">Growth Rate Analysis</div>
}

import { BarChart, Bar } from 'recharts'