import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function PurchaseFunnelChart({ data }: { data: any }) {
  const funnelData = data?.funnel || []
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={funnelData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="stage" />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function RequestMethodsBar({ data }: { data: any }) {
  const methodsData = data?.methods || []
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={methodsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="method" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AcceptanceRateBar({ data }: { data: any }) {
  const acceptanceRate = data?.acceptance || 0
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-4xl font-bold text-green-600">{(acceptanceRate * 100).toFixed(1)}%</div>
      <div className="text-sm text-gray-500 mt-2">Acceptance Rate</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
        <div 
          className="bg-green-600 h-2 rounded-full" 
          style={{ width: `${acceptanceRate * 100}%` }}
        />
      </div>
    </div>
  )
}

export function BehaviorRadarChart({ data }: { data: any }) {
  return <div className="text-center text-gray-500 py-8">Behavior Radar Chart</div>
}