import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, FunnelChart, Funnel, LabelList, LineChart, Line, ComposedChart, ReferenceLine } from 'recharts'

// TBWA color palette for charts
const TBWA_COLORS = {
  primary: '#000000',      // TBWA Black
  secondary: '#FFD700',    // TBWA Yellow
  accent: '#1E40AF',       // TBWA Blue
  success: '#059669',      // TBWA Emerald
  warning: '#D97706',      // TBWA Orange
  error: '#DC2626',        // TBWA Red
  purple: '#6B46C1'        // TBWA Purple
}

const CHART_COLORS = [
  TBWA_COLORS.secondary,   // Yellow
  TBWA_COLORS.accent,      // Blue
  TBWA_COLORS.success,     // Emerald
  TBWA_COLORS.warning,     // Orange
  TBWA_COLORS.error,       // Red
  TBWA_COLORS.purple,      // Purple
  '#EC4899'                // Pink accent
]

// Transaction Trends Area Chart (from Scout dashboard)
export const TransactionAreaChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={TBWA_COLORS.secondary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={TBWA_COLORS.secondary} stopOpacity={0.1}/>
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
            stroke={TBWA_COLORS.secondary}
            strokeWidth={2}
            fill="url(#transactionGradient)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Product Mix Horizontal Bar Chart (no diagonal labels)
export const ProductMixPieChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number"
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={{ value: 'Percentage (%)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            type="category"
            dataKey="name"
            stroke="#6B7280" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={80}
          />
          <Tooltip 
            formatter={(value: any, name: any) => [`${value}%`, 'Share']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
            <LabelList 
              dataKey="value" 
              position="inside" 
              fill="white" 
              fontSize={12}
              fontWeight="600"
              formatter={(value: any) => `${value}%`}
            />
          </Bar>
        </BarChart>
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

// Customer Journey Funnel Chart (proper funnel visualization)
export const CustomerJourneyFunnel = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.map(d => d.count))
  
  return (
    <div className="h-64 w-full flex items-center justify-center">
      <svg width="800" height="240" viewBox="0 0 800 240">
        {data.map((item, index) => {
          const width = (item.count / maxValue) * 600 // Max width of 600px
          const height = 35 // Height per section
          const y = index * height + 20
          const x = (800 - width) / 2 // Center horizontally
          
          // Create trapezoid path for funnel effect
          const nextWidth = index < data.length - 1 ? (data[index + 1].count / maxValue) * 600 : width * 0.8
          const topLeft = x
          const topRight = x + width
          const bottomLeft = x + (width - nextWidth) / 2
          const bottomRight = topRight - (width - nextWidth) / 2
          
          const path = `M ${topLeft},${y} L ${topRight},${y} L ${bottomRight},${y + height} L ${bottomLeft},${y + height} Z`
          
          return (
            <g key={item.stage}>
              <path
                d={path}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                stroke="#fff"
                strokeWidth={2}
              />
              <text
                x={800 / 2}
                y={y + height / 2}
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="600"
                dy="0.35em"
              >
                {item.stage}: {item.count}
              </text>
            </g>
          )
        })}
      </svg>
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
          <Bar dataKey="percentage" fill={TBWA_COLORS.accent} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Urban vs Rural Donut Chart (reverted back - donut charts allowed)
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

// NEW CHART COMPONENTS TO REPLACE EMPTY PLACEHOLDERS

// Revenue Trends Chart
export const RevenueChart = ({ data }: { data: any[] }) => {
  const revenueData = data.map(item => ({ 
    ...item, 
    revenue: item.transactions * 185 + Math.random() * 50000 
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              name === 'revenue' ? `₱${value.toLocaleString()}` : value,
              name === 'revenue' ? 'Revenue' : 'Transactions'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area type="monotone" dataKey="revenue" fill={TBWA_COLORS.accent} stroke={TBWA_COLORS.accent} />
          <Line type="monotone" dataKey="transactions" stroke={TBWA_COLORS.secondary} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Basket Size Trends Chart
export const BasketSizeChart = ({ data }: { data: any[] }) => {
  const basketData = data.map(item => ({ 
    ...item, 
    basketSize: 2.1 + Math.random() * 1.5,
    avgValue: 85 + Math.random() * 40 
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={basketData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              name === 'basketSize' ? value.toFixed(1) : `₱${value.toFixed(0)}`,
              name === 'basketSize' ? 'Avg Items' : 'Avg Value'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line type="monotone" dataKey="basketSize" stroke={TBWA_COLORS.success} strokeWidth={3} />
          <Line type="monotone" dataKey="avgValue" stroke={TBWA_COLORS.warning} strokeWidth={2} strokeDasharray="5 5" />
          <ReferenceLine y={2.5} stroke={TBWA_COLORS.error} strokeDasharray="3 3" label="Target" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// Duration Trends Chart
export const DurationChart = ({ data }: { data: any[] }) => {
  const durationData = data.map(item => ({ 
    ...item, 
    duration: 35 + Math.random() * 25,
    efficiency: 85 + Math.random() * 15 
  }))

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={TBWA_COLORS.purple} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={TBWA_COLORS.purple} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              name === 'duration' ? `${value.toFixed(1)}s` : `${value.toFixed(1)}%`,
              name === 'duration' ? 'Avg Duration' : 'Efficiency'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area type="monotone" dataKey="duration" stroke={TBWA_COLORS.purple} fill="url(#durationGradient)" />
          <Line type="monotone" dataKey="efficiency" stroke={TBWA_COLORS.success} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Pareto Analysis Chart (80/20 rule)
export const ParetoChart = ({ data }: { data: any[] }) => {
  const paretoData = [
    { sku: 'Top 20%', revenue: 80, cumulative: 80 },
    { sku: '21-40%', revenue: 12, cumulative: 92 },
    { sku: '41-60%', revenue: 5, cumulative: 97 },
    { sku: '61-80%', revenue: 2, cumulative: 99 },
    { sku: 'Bottom 20%', revenue: 1, cumulative: 100 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={paretoData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="sku" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              `${value}%`,
              name === 'revenue' ? 'Revenue Share' : 'Cumulative'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="revenue" fill={TBWA_COLORS.accent} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="cumulative" stroke={TBWA_COLORS.error} strokeWidth={3} />
          <ReferenceLine y={80} stroke={TBWA_COLORS.warning} strokeDasharray="3 3" label="80% Line" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Product Substitution Sankey Chart
export const SubstitutionChart = () => {
  const substitutionData = [
    { original: 'Coke', substitute: 'Pepsi', rate: 23 },
    { original: 'Sprite', substitute: '7Up', rate: 18 },
    { original: 'Shampoo A', substitute: 'Shampoo B', rate: 31 },
    { original: 'Chips A', substitute: 'Chips B', rate: 15 },
    { original: 'Soap A', substitute: 'Soap B', rate: 27 }
  ]

  return (
    <div className="h-64 w-full">
      <svg width="100%" height="100%" viewBox="0 0 600 250">
        {/* Left side - Original products */}
        {substitutionData.map((item, index) => {
          const y = 30 + index * 40
          const nodeHeight = 25
          
          return (
            <g key={`original-${index}`}>
              {/* Original product node */}
              <rect
                x={50}
                y={y}
                width={120}
                height={nodeHeight}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                rx={4}
              />
              <text
                x={110}
                y={y + nodeHeight/2}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="600"
                dy="0.35em"
              >
                {item.original}
              </text>
              
              {/* Flow line */}
              <path
                d={`M 170 ${y + nodeHeight/2} Q 300 ${y + nodeHeight/2} 430 ${y + nodeHeight/2}`}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={Math.max(2, item.rate / 3)}
                fill="none"
                opacity={0.6}
              />
              
              {/* Flow percentage */}
              <text
                x={300}
                y={y + nodeHeight/2 - 15}
                textAnchor="middle"
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fontSize="10"
                fontWeight="600"
              >
                {item.rate}%
              </text>
              
              {/* Substitute product node */}
              <rect
                x={430}
                y={y}
                width={120}
                height={nodeHeight}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                rx={4}
                opacity={0.8}
              />
              <text
                x={490}
                y={y + nodeHeight/2}
                textAnchor="middle"
                fill="white"
                fontSize="11"
                fontWeight="600"
                dy="0.35em"
              >
                {item.substitute}
              </text>
            </g>
          )
        })}
        
        {/* Labels */}
        <text x={110} y={20} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">
          Original Products
        </text>
        <text x={490} y={20} textAnchor="middle" fill="#374151" fontSize="12" fontWeight="600">
          Substitute Products
        </text>
      </svg>
    </div>
  )
}

// Market Basket Analysis
export const BasketAnalysisChart = () => {
  const basketData = [
    { combination: 'Chips + Soda', frequency: 45, lift: 1.8 },
    { combination: 'Shampoo + Conditioner', frequency: 38, lift: 2.1 },
    { combination: 'Bread + Butter', frequency: 32, lift: 1.5 },
    { combination: 'Coffee + Milk', frequency: 28, lift: 1.7 },
    { combination: 'Soap + Lotion', frequency: 25, lift: 1.4 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={basketData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="combination" 
            stroke="#6B7280" 
            fontSize={10} 
            tickLine={false} 
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              name === 'frequency' ? `${value}%` : `${value}x`,
              name === 'frequency' ? 'Co-occurrence' : 'Lift Score'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="frequency" fill={TBWA_COLORS.success} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="lift" stroke={TBWA_COLORS.error} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Request Methods Chart (Voice vs Visual)
export const RequestMethodsChart = () => {
  const methodData = [
    { time: '6AM', voice: 15, visual: 85, total: 100 },
    { time: '9AM', voice: 35, visual: 65, total: 120 },
    { time: '12PM', voice: 45, visual: 55, total: 180 },
    { time: '3PM', voice: 55, visual: 45, total: 200 },
    { time: '6PM', voice: 65, visual: 35, total: 240 },
    { time: '9PM', voice: 40, visual: 60, total: 160 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={methodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="voiceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={TBWA_COLORS.accent} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={TBWA_COLORS.accent} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="visualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={TBWA_COLORS.success} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={TBWA_COLORS.success} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [`${value}%`, name === 'voice' ? 'Voice Requests' : 'Visual Requests']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area type="monotone" dataKey="voice" stackId="1" stroke={TBWA_COLORS.accent} fill="url(#voiceGradient)" />
          <Area type="monotone" dataKey="visual" stackId="1" stroke={TBWA_COLORS.success} fill="url(#visualGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// Acceptance Rates Chart
export const AcceptanceRatesChart = () => {
  const acceptanceData = [
    { category: 'Beverages', acceptance: 78, confidence: 85 },
    { category: 'Snacks', acceptance: 72, confidence: 80 },
    { category: 'Personal Care', acceptance: 65, confidence: 75 },
    { category: 'Household', acceptance: 58, confidence: 70 },
    { category: 'Others', acceptance: 45, confidence: 60 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={acceptanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              `${value}%`, 
              name === 'acceptance' ? 'Acceptance Rate' : 'Confidence Score'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="acceptance" fill={TBWA_COLORS.success} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="confidence" stroke={TBWA_COLORS.warning} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Behavior Traits Analysis
export const BehaviorTraitsChart = () => {
  const traitData = [
    { trait: 'Price Sensitive', percentage: 45 },
    { trait: 'Brand Loyal', percentage: 38 },
    { trait: 'Impulse Buyer', percentage: 32 },
    { trait: 'Quality Focused', percentage: 28 },
    { trait: 'Convenience Seeker', percentage: 25 },
    { trait: 'Discovery Oriented', percentage: 18 }
  ]

  // TBWA color scheme for behavior traits
  const tbwaColors = [
    '#FFD700', // TBWA Yellow (primary)
    '#FF6B35', // Scout secondary
    '#4A90E2', // Professional blue
    '#7B68EE', // Medium slate blue
    '#32CD32', // Lime green
    '#FF69B4'  // Hot pink
  ]

  return (
    <div className="h-96 w-full bg-white rounded-lg p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="70%">
        <BarChart 
          data={traitData} 
          layout="horizontal"
          margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            type="number" 
            domain={[0, 50]}
            stroke="#374151" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            dataKey="trait" 
            type="category" 
            stroke="#374151" 
            fontSize={11} 
            width={115}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Customer Percentage']}
            labelFormatter={(label) => `Trait: ${label}`}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '2px solid #FFD700',
              borderRadius: '12px',
              color: 'white',
              boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.3)',
              fontSize: '13px'
            }}
          />
          <Bar dataKey="percentage" radius={[0, 8, 8, 0]} strokeWidth={1} stroke="#ffffff">
            {traitData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={tbwaColors[index]} 
                stroke={index === 0 ? '#1f2937' : 'transparent'}
                strokeWidth={index === 0 ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Enhanced insights panel */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border-l-4 border-tbwa-yellow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-tbwa-yellow rounded-full"></div>
            <h4 className="font-semibold text-gray-800 text-sm">Top Trait</h4>
          </div>
          <p className="text-sm text-gray-700">
            <strong>45% Price Sensitive</strong> - Majority prioritize value
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border-l-4 border-scout-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-scout-secondary rounded-full"></div>
            <h4 className="font-semibold text-gray-800 text-sm">Loyalty Factor</h4>
          </div>
          <p className="text-sm text-gray-700">
            <strong>38% Brand Loyal</strong> - Strong retention opportunity
          </p>
        </div>
      </div>
    </div>
  )
}

// Age & Gender Distribution Chart
export const AgeGenderChart = () => {
  const ageGenderData = [
    { ageGroup: '18-24', male: 22, female: 28 },
    { ageGroup: '25-34', male: 35, female: 32 },
    { ageGroup: '35-44', male: 28, female: 25 },
    { ageGroup: '45-54', male: 18, female: 22 },
    { ageGroup: '55+', male: 12, female: 15 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ageGenderData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="ageGroup" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [`${value}%`, name === 'male' ? 'Male' : 'Female']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="male" fill={TBWA_COLORS.accent} radius={[4, 4, 0, 0]} />
          <Bar dataKey="female" fill={TBWA_COLORS.success} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Location Heatmap (simplified as bar chart)
export const LocationChart = () => {
  const locationData = [
    { location: 'Metro Manila', customers: 45, revenue: 52 },
    { location: 'Cebu', customers: 18, revenue: 20 },
    { location: 'Davao', customers: 12, revenue: 14 },
    { location: 'Baguio', customers: 8, revenue: 6 },
    { location: 'Iloilo', customers: 7, revenue: 4 },
    { location: 'Others', customers: 10, revenue: 4 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="location" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => [
              `${value}%`, 
              name === 'customers' ? 'Customer Share' : 'Revenue Share'
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="customers" fill={TBWA_COLORS.accent} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="revenue" stroke={TBWA_COLORS.warning} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Segment Behavior Analysis
export const SegmentBehaviorChart = () => {
  const segmentData = [
    { segment: 'High Value', avgSpend: 125, frequency: 15, satisfaction: 92 },
    { segment: 'Regular', avgSpend: 85, frequency: 8, satisfaction: 85 },
    { segment: 'Occasional', avgSpend: 45, frequency: 3, satisfaction: 75 },
    { segment: 'New', avgSpend: 35, frequency: 1, satisfaction: 70 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={segmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="segment" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              if (name === 'avgSpend') return [`₱${value}`, 'Avg Spend']
              if (name === 'frequency') return [`${value}x/month`, 'Frequency']
              return [`${value}%`, 'Satisfaction']
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="avgSpend" fill={TBWA_COLORS.success} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="frequency" stroke={TBWA_COLORS.warning} strokeWidth={2} />
          <Line type="monotone" dataKey="satisfaction" stroke={TBWA_COLORS.accent} strokeWidth={2} strokeDasharray="5 5" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Competitive Analysis Charts (SimilarWeb-style for in-store)

// Brand Market Share Comparison
export const BrandMarketShareChart = () => {
  const marketShareData = [
    { brand: 'Our Brand', storeVisits: 35, conversion: 28, marketShare: 32 },
    { brand: 'Competitor A', storeVisits: 25, conversion: 22, marketShare: 24 },
    { brand: 'Competitor B', storeVisits: 20, conversion: 18, marketShare: 19 },
    { brand: 'Competitor C', storeVisits: 12, conversion: 15, marketShare: 14 },
    { brand: 'Others', storeVisits: 8, conversion: 10, marketShare: 11 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={marketShareData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="brand" stroke="#6B7280" fontSize={11} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const labels: {[key: string]: string} = {
                storeVisits: 'Store Visits',
                conversion: 'Conversion Rate',
                marketShare: 'Market Share'
              }
              return [`${value}%`, labels[name] || name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="storeVisits" fill={TBWA_COLORS.secondary} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="conversion" stroke={TBWA_COLORS.accent} strokeWidth={3} />
          <Line type="monotone" dataKey="marketShare" stroke={TBWA_COLORS.success} strokeWidth={3} strokeDasharray="5 5" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Category Performance vs Competitors
export const CategoryCompetitiveChart = () => {
  const categoryData = [
    { category: 'Beverages', ourShare: 35, competitor1: 28, competitor2: 20, growth: 12 },
    { category: 'Snacks', ourShare: 42, competitor1: 25, competitor2: 18, growth: 8 },
    { category: 'Personal Care', ourShare: 28, competitor1: 32, competitor2: 25, growth: -5 },
    { category: 'Household', ourShare: 31, competitor1: 30, competitor2: 22, growth: 15 },
    { category: 'Others', ourShare: 25, competitor1: 35, competitor2: 28, growth: -8 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="category" stroke="#6B7280" fontSize={11} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const labels: {[key: string]: string} = {
                ourShare: 'Our Share',
                competitor1: 'Competitor A',
                competitor2: 'Competitor B',
                growth: 'Growth Rate'
              }
              return [`${value}%`, labels[name] || name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="ourShare" fill={TBWA_COLORS.secondary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="competitor1" fill={TBWA_COLORS.accent} radius={[4, 4, 0, 0]} />
          <Bar dataKey="competitor2" fill={TBWA_COLORS.purple} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="growth" stroke={TBWA_COLORS.success} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Time Period Performance Comparison
export const TimePeriodCompetitiveChart = () => {
  const timeData = [
    { period: 'Q1 2024', ourPerformance: 85, competitorAvg: 78, marketGrowth: 5 },
    { period: 'Q2 2024', ourPerformance: 92, competitorAvg: 82, marketGrowth: 8 },
    { period: 'Q3 2024', ourPerformance: 88, competitorAvg: 85, marketGrowth: 3 },
    { period: 'Q4 2024', ourPerformance: 95, competitorAvg: 87, marketGrowth: 12 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="period" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const labels: {[key: string]: string} = {
                ourPerformance: 'Our Performance',
                competitorAvg: 'Competitor Average',
                marketGrowth: 'Market Growth'
              }
              return [`${value}%`, labels[name] || name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Area type="monotone" dataKey="ourPerformance" fill={TBWA_COLORS.secondary} fillOpacity={0.3} stroke={TBWA_COLORS.secondary} strokeWidth={3} />
          <Line type="monotone" dataKey="competitorAvg" stroke={TBWA_COLORS.accent} strokeWidth={3} strokeDasharray="5 5" />
          <Line type="monotone" dataKey="marketGrowth" stroke={TBWA_COLORS.success} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Geographical Intelligence Charts

// Regional Performance Heatmap
export const RegionalHeatmapChart = () => {
  const regionData = [
    { region: 'Metro Manila', performance: 95, customers: 1250, revenue: 850000 },
    { region: 'Cebu', performance: 78, customers: 680, revenue: 420000 },
    { region: 'Davao', performance: 85, customers: 520, revenue: 380000 },
    { region: 'Iloilo', performance: 72, customers: 340, revenue: 240000 },
    { region: 'Baguio', performance: 68, customers: 280, revenue: 190000 },
    { region: 'Cagayan de Oro', performance: 81, customers: 410, revenue: 310000 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="region" stroke="#6B7280" fontSize={11} tickLine={false} angle={-45} textAnchor="end" height={80} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const labels: {[key: string]: string} = {
                performance: 'Performance Score',
                customers: 'Total Customers',
                revenue: 'Revenue'
              }
              if (name === 'revenue') return [`₱${value.toLocaleString()}`, labels[name]]
              return [`${value}${name === 'performance' ? '%' : ''}`, labels[name] || name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="performance" fill={TBWA_COLORS.secondary} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="customers" stroke={TBWA_COLORS.accent} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Store Location Intelligence
export const StoreLocationChart = () => {
  const locationData = [
    { location: 'Mall Location', footTraffic: 1200, conversion: 35, revenue: 450000 },
    { location: 'Standalone', footTraffic: 800, conversion: 42, revenue: 380000 },
    { location: 'Strip Mall', footTraffic: 600, conversion: 38, revenue: 280000 },
    { location: 'Airport', footTraffic: 400, conversion: 25, revenue: 180000 },
    { location: 'CBD', footTraffic: 950, conversion: 40, revenue: 420000 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="location" stroke="#6B7280" fontSize={11} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const labels: {[key: string]: string} = {
                footTraffic: 'Foot Traffic',
                conversion: 'Conversion Rate',
                revenue: 'Revenue'
              }
              if (name === 'revenue') return [`₱${value.toLocaleString()}`, labels[name]]
              if (name === 'conversion') return [`${value}%`, labels[name]]
              return [`${value}`, labels[name] || name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="footTraffic" fill={TBWA_COLORS.accent} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="conversion" stroke={TBWA_COLORS.warning} strokeWidth={3} />
          <Line type="monotone" dataKey="revenue" stroke={TBWA_COLORS.success} strokeWidth={3} strokeDasharray="3 3" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

// Geographic Demographics Distribution  
export const GeoDemographicsChart = () => {
  const geoDemo = [
    { area: 'Urban Core', ageGroup: '25-34', percentage: 32, spending: 125 },
    { area: 'Urban Core', ageGroup: '35-44', percentage: 28, spending: 145 },
    { area: 'Suburban', ageGroup: '25-34', percentage: 25, spending: 95 },
    { area: 'Suburban', ageGroup: '35-44', percentage: 35, spending: 110 },
    { area: 'Rural', ageGroup: '25-34', percentage: 18, spending: 75 },
    { area: 'Rural', ageGroup: '35-44', percentage: 22, spending: 85 }
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={geoDemo} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="area" stroke="#6B7280" fontSize={12} tickLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value: any, name: any) => {
              const labels: {[key: string]: string} = {
                percentage: 'Population %',
                spending: 'Avg Spending'
              }
              if (name === 'spending') return [`₱${value}`, labels[name]]
              return [`${value}%`, labels[name] || name]
            }}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="percentage" fill={TBWA_COLORS.purple} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="spending" stroke={TBWA_COLORS.success} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
// Export ChoroplethMap component
export { ChoroplethMap } from './ChoroplethMap'
// Export MercatorChoroplethMap component
export { MercatorChoroplethMap } from './MercatorChoroplethMap'
// Export VisxChoroplethMap component  
export { VisxChoroplethMap } from './VisxChoroplethMap'
// Export MapboxChoroplethMap component
export { MapboxChoroplethMap } from './MapboxChoroplethMap'
