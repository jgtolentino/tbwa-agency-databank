import React from 'react'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  icon?: LucideIcon
  format?: 'number' | 'currency' | 'percent' | 'time'
  subtitle?: string
}

const MetricCard = ({ title, value, change, icon: Icon, format = 'number', subtitle }: MetricCardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    switch (format) {
      case 'currency':
        return `₱${val.toLocaleString()}`
      case 'percent':
        return `${val}%`
      case 'time':
        return `${val}s`
      default:
        return val.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    if (change === undefined) return null
    
    if (change > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600" />
    } else if (change < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600" />
    } else {
      return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    if (change === undefined) return ''
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
  }

  return (
    <div className="scout-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-scout-text">{title}</h3>
        {Icon && (
          <div className="text-scout-secondary">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      
      <div>
        <p className="text-2xl font-bold text-scout-text mb-1">{formatValue(value)}</p>
        
        {subtitle && (
          <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
        )}
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {Math.abs(change)}% vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetricCard