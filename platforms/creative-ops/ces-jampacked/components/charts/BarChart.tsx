import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { formatNumber } from '@/utils/exportUtils'

interface BarChartProps {
  data: any[]
  dataKey: string
  xAxisKey: string
  color?: string
  stacked?: boolean
  stackedKeys?: string[]
  colors?: string[]
}

export const BarChart = ({
  data,
  dataKey,
  xAxisKey,
  color = '#3B82F6',
  stacked = false,
  stackedKeys = [],
  colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE']
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={xAxisKey}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={formatNumber}
        />
        <Tooltip formatter={(value: any) => formatNumber(Number(value))} />
        <Legend />
        
        {stacked && stackedKeys.length > 0 ? (
          stackedKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="stack"
              fill={colors[index % colors.length]}
            />
          ))
        ) : (
          <Bar dataKey={dataKey} fill={color} />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
