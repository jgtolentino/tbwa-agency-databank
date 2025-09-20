import React, { useState, useEffect } from 'react'
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getRuntimeConfig } from '../../utils/runtimeGuard'
import { strictDataSource } from '../../services/strictDataSource'

interface HealthStatus {
  overall: 'healthy' | 'warning' | 'error' | 'checking'
  database: 'healthy' | 'error' | 'checking'
  environment: 'healthy' | 'warning' | 'error'
  lastCheck: Date
  details: {
    supabaseConnected: boolean
    strictModeEnabled: boolean
    productionReady: boolean
    csvBlocked: boolean
  }
}

interface HealthBadgeProps {
  showDetails?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

const HealthBadge: React.FC<HealthBadgeProps> = ({
  showDetails = false,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [health, setHealth] = useState<HealthStatus>({
    overall: 'checking',
    database: 'checking',
    environment: 'checking',
    lastCheck: new Date(),
    details: {
      supabaseConnected: false,
      strictModeEnabled: false,
      productionReady: false,
      csvBlocked: false
    }
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const checkHealth = async () => {
    try {
      // Get runtime configuration
      const config = getRuntimeConfig()

      // Check database connectivity
      const dbHealth = await strictDataSource.healthCheck()

      // Determine overall status
      const details = {
        supabaseConnected: dbHealth.status === 'healthy',
        strictModeEnabled: config.isStrictMode,
        productionReady: config.isProduction ? config.supabaseConfigured && config.isStrictMode : true,
        csvBlocked: !config.allowCSV
      }

      const database = dbHealth.status === 'healthy' ? 'healthy' : 'error'

      let environment: 'healthy' | 'warning' | 'error' = 'healthy'
      if (config.isProduction && (!config.supabaseConfigured || !config.isStrictMode)) {
        environment = 'error'
      } else if (!config.isProduction && config.allowCSV) {
        environment = 'warning'
      }

      let overall: 'healthy' | 'warning' | 'error' = 'healthy'
      if (database === 'error' || environment === 'error') {
        overall = 'error'
      } else if (environment === 'warning') {
        overall = 'warning'
      }

      setHealth({
        overall,
        database,
        environment,
        lastCheck: new Date(),
        details
      })

    } catch (error) {
      console.error('Health check failed:', error)
      setHealth(prev => ({
        ...prev,
        overall: 'error',
        database: 'error',
        environment: 'error',
        lastCheck: new Date()
      }))
    }
  }

  useEffect(() => {
    checkHealth()

    if (autoRefresh) {
      const interval = setInterval(checkHealth, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'checking':
        return <Clock className="w-4 h-4 text-gray-500 animate-spin" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      case 'checking':
        return 'border-gray-200 bg-gray-50 text-gray-800'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  return (
    <div className={`inline-block border rounded-lg ${getStatusColor(health.overall)}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-opacity-80 transition-colors"
      >
        <Shield className="w-4 h-4" />
        <span className="text-sm font-medium">
          {health.overall === 'checking' ? 'Checking...' :
           health.overall === 'healthy' ? 'System Healthy' :
           health.overall === 'warning' ? 'Dev Mode' : 'Issues Detected'}
        </span>
        {getStatusIcon(health.overall)}
      </button>

      {(isExpanded || showDetails) && (
        <div className="border-t border-current border-opacity-20 p-3">
          <div className="space-y-2 text-xs">

            {/* Database Status */}
            <div className="flex items-center justify-between">
              <span>Database</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(health.database)}
                <span className="capitalize">{health.database}</span>
              </div>
            </div>

            {/* Environment Status */}
            <div className="flex items-center justify-between">
              <span>Environment</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(health.environment)}
                <span className="capitalize">{health.environment}</span>
              </div>
            </div>

            {/* Detailed Checks */}
            <div className="border-t border-current border-opacity-20 pt-2 space-y-1">
              <div className="flex items-center justify-between">
                <span>Supabase</span>
                {health.details.supabaseConnected ?
                  <CheckCircle className="w-3 h-3 text-green-500" /> :
                  <XCircle className="w-3 h-3 text-red-500" />
                }
              </div>

              <div className="flex items-center justify-between">
                <span>Strict Mode</span>
                {health.details.strictModeEnabled ?
                  <CheckCircle className="w-3 h-3 text-green-500" /> :
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                }
              </div>

              <div className="flex items-center justify-between">
                <span>CSV Blocked</span>
                {health.details.csvBlocked ?
                  <CheckCircle className="w-3 h-3 text-green-500" /> :
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                }
              </div>

              <div className="flex items-center justify-between">
                <span>Prod Ready</span>
                {health.details.productionReady ?
                  <CheckCircle className="w-3 h-3 text-green-500" /> :
                  <XCircle className="w-3 h-3 text-red-500" />
                }
              </div>
            </div>

            {/* Last Check */}
            <div className="border-t border-current border-opacity-20 pt-2 text-center text-opacity-70">
              Last check: {health.lastCheck.toLocaleTimeString()}
            </div>

            {/* Refresh Button */}
            <button
              onClick={checkHealth}
              className="w-full text-center py-1 px-2 rounded bg-current bg-opacity-10 hover:bg-opacity-20 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthBadge