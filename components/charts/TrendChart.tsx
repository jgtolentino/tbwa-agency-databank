import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendChartProps {
  data: any[]
  metric: string
  color?: string
}

export function TrendChart({ data, metric, color = '#3b82f6' }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          stroke="#64748b" 
          fontSize={12}
          tickFormatter={(value) => new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
        />
        <YAxis 
          stroke="#64748b" 
          fontSize={12}
          tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0' }}
          labelStyle={{ color: '#1e293b' }}
          formatter={(value: any) => [`₱${value.toLocaleString()}`, metric]}
        />
        <Line 
          type="monotone" 
          dataKey={metric} 
          stroke={color} 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}