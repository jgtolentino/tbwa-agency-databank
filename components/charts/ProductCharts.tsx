import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function CategoryPieChart({ data }: { data: any }) {
  const chartData = data?.slice(0, 6) || []
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="revenue"
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
        >
          {chartData.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function ParetoBarLineChart({ data }: { data: any }) {
  // Mock Pareto implementation
  return <div className="text-center text-gray-500 py-8">Pareto Analysis Chart</div>
}

export function SubstitutionTable({ data }: { data: any }) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Product</th>
            <th className="text-right py-2">Substitution Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2">Product A → Product B</td>
            <td className="text-right">23%</td>
          </tr>
          <tr>
            <td className="py-2">Product C → Product D</td>
            <td className="text-right">18%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function BasketTimeHeatmap({ data }: { data: any }) {
  return <div className="text-center text-gray-500 py-8">Basket Time Heatmap</div>
}