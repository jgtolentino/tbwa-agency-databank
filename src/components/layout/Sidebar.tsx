import React from 'react'
import { TrendingUp, Package, Users, UserCheck, BarChart3, Database, Target, MapPin, ChevronLeft, Menu } from 'lucide-react'
import { getDataSourceBadge } from '../../services/dataService'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isCollapsed: boolean
  onToggle: () => void
}

const Sidebar = ({ activeSection, onSectionChange, isCollapsed, onToggle }: SidebarProps) => {
  const navItems = [
    {
      id: 'transaction-trends',
      label: 'Transaction Trends', 
      icon: TrendingUp,
      description: 'Volume, timing & patterns'
    },
    {
      id: 'product-mix',
      label: 'Product Mix & SKU',
      icon: Package,
      description: 'Categories, brands & combos'
    },
    {
      id: 'consumer-behavior', 
      label: 'Consumer Behavior',
      icon: Users,
      description: 'Purchase decisions & signals'
    },
    {
      id: 'consumer-profiling',
      label: 'Consumer Profiling', 
      icon: UserCheck,
      description: 'Demographics & location'
    },
    {
      id: 'competitive-analysis',
      label: 'Competitive Analysis', 
      icon: Target,
      description: 'Brand vs brand comparisons'
    },
    {
      id: 'geographical-intelligence',
      label: 'Geographical Intelligence', 
      icon: MapPin,
      description: 'Location & regional insights'
    },
    {
      id: 'databank',
      label: 'Scout Dashboard Transactions', 
      icon: Database,
      description: 'Data Dictionary (2025 Draft)'
    }
  ]

  // Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className="fixed top-0 left-0 bottom-0 w-16 p-4 bg-tbwa-black border-r border-tbwa-yellow">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="w-8 h-8 mb-6 flex items-center justify-center text-tbwa-yellow hover:text-tbwa-white hover:bg-tbwa-yellow hover:bg-opacity-20 rounded-lg transition-colors"
          title="Expand Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Navigation Icons */}
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-tbwa-yellow text-tbwa-black' 
                    : 'text-tbwa-yellow hover:bg-tbwa-yellow hover:bg-opacity-20 hover:text-tbwa-white'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
        </nav>
      </div>
    )
  }

  // Expanded sidebar
  return (
    <div className="fixed top-0 left-0 bottom-0 w-64 p-4 bg-tbwa-black border-r border-tbwa-yellow">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="flex flex-col">
            <img 
              src="/tbwasmp-logo.webp" 
              alt="TBWA SMP Logo" 
              className="h-6 w-auto mb-1"
            />
            <h1 className="text-xl font-bold text-tbwa-white">Suqi Analytics</h1>
            <p className="text-sm text-tbwa-yellow">Retail Intelligence</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center text-tbwa-yellow hover:text-tbwa-white hover:bg-tbwa-yellow hover:bg-opacity-20 rounded-lg transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <hr className="mb-6 border-tbwa-yellow border-opacity-30" />

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-tbwa-yellow bg-opacity-20 text-tbwa-white' 
                  : 'text-tbwa-white hover:bg-tbwa-yellow hover:bg-opacity-10 hover:text-tbwa-yellow'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-tbwa-yellow' : ''}`} />
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-tbwa-yellow text-opacity-80 mt-1">{item.description}</div>
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-tbwa-yellow text-opacity-70 space-y-1">
          <div>Created by <strong className="text-tbwa-white">Scout Team</strong></div>
          <div>Data Source: <strong className="text-tbwa-white">{getDataSourceBadge()}</strong></div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar