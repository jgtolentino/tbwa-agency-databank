interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
}

export function KPICard({ title, value, change, trend, subtitle }: KPICardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{title}</div>
      <div className="kpi-value">{value}</div>
      {subtitle && (
        <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
      )}
      {change !== undefined && (
        <div className={`kpi-change ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
          {trend === 'up' && ' ↑'}
          {trend === 'down' && ' ↓'}
        </div>
      )}
    </div>
  )
}