import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts'

// Amazon color palette for charts
const AMAZON_COLORS = {
  primary: '#3a4552',
  secondary: '#f79500', 
  accent: '#60A5FA',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6'
}

const CHART_COLORS = [
  AMAZON_COLORS.secondary,
  AMAZON_COLORS.accent, 
  AMAZON_COLORS.success,
  AMAZON_COLORS.warning,
  AMAZON_COLORS.error,
  AMAZON_COLORS.purple,
  '#EC4899'
]

// Transaction Trends Area Chart (from Scout dashboard)
export const TransactionAreaChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AMAZON_COLORS.secondary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={AMAZON_COLORS.secondary} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="transactions" 
            stroke={AMAZON_COLORS.secondary}
            strokeWidth={2}
            fill="url(#transactionGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Product Mix Pie Chart (from Scout dashboard) 
export const ProductMixPieChart = ({ data }: { data: any[] }) => {
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any) => [`${value}%`, name]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// Product Mix Legend
export const ProductMixLegend = ({ data }: { data: any[] }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
          />
          <span className="text-sm text-scout-text">{item.name}</span>
          <span className="text-sm font-semibold text-scout-text">{item.value}%</span>
        </div>
      ))}
    </div>
  )
}

// Customer Journey Funnel Chart (from Scout dashboard)
export const CustomerJourneyFunnel = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6B7280" fontSize={12} />
          <YAxis 
            dataKey="stage" 
            type="category" 
            stroke="#6B7280" 
            fontSize={12}
            width={80}
          />
          <Tooltip 
            formatter={(value: any) => [`${value} customers`, 'Count']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="count" fill={AMAZON_COLORS.secondary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Income Distribution Chart (from Scout dashboard)
export const IncomeDistributionChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="income" 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Percentage']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="percentage" fill={AMAZON_COLORS.accent} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Urban vs Rural Donut Chart
export const UrbanRuralChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Percentage']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// Enhanced KPI Card with Scout styling
export const EnhancedKPICard = ({ 
  title, 
  value, 
  change, 
  changeType = 'percentage',
  icon: Icon,
  trend = 'neutral'
}: {
  title: string
  value: string | number
  change?: number
  changeType?: 'percentage' | 'absolute'
  icon?: any
  trend?: 'up' | 'down' | 'neutral'
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-gray-500'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return '↗'
    if (trend === 'down') return '↘'
    return '→'
  }

  return (
    <div className="scout-card p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-scout-text">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-scout-secondary" />}
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold text-scout-text">{value}</p>
        
        {change !== undefined && (
          <div className={`flex items-center text-sm ${getTrendColor()}`}>
            <span className="mr-1">{getTrendIcon()}</span>
            <span>
              {changeType === 'percentage' ? `${Math.abs(change)}%` : Math.abs(change)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Tab Navigation Component (from Scout dashboard)
export const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange 
}: { 
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void 
}) => {
  return (
    <div className="border-b border-gray-200 mb-4">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab
                ? 'border-scout-secondary text-scout-secondary'
                : 'border-transparent text-gray-500 hover:text-scout-text hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  )
}