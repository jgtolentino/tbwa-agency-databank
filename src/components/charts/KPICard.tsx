import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatNumber, formatCurrency, formatPercent } from '@/utils/exportUtils'

interface KPICardProps {
  title: string
  value: number
  change?: number
  format?: 'number' | 'currency' | 'percent'
  icon?: React.ReactNode
}

export const KPICard = ({ title, value, change, format = 'number', icon }: KPICardProps) => {
  const formatValue = () => {
    switch (format) {
      case 'currency':
        return formatCurrency(value)
      case 'percent':
        return formatPercent(value)
      default:
        return formatNumber(value)
    }
  }

  const getTrendIcon = () => {
    if (!change) return null
    
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    if (!change) return ''
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
  }

  return (
    <div className="h-full flex flex-col justify-between p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-scout-primary">{icon}</div>}
      </div>
      
      <div>
        <p className="text-2xl font-bold text-gray-900">{formatValue()}</p>
        
        {change !== undefined && (
          <div className={"flex items-center gap-1 mt-1 " + getTrendColor()}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
