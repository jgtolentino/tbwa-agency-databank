import React from 'react'
import { TrendingUp, Package, Users, UserCheck, BarChart3, Database, Target, MapPin, ChevronLeft, Menu } from 'lucide-react'

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
      label: 'Databank Dashboard', 
      icon: Database,
      description: 'Complete analytics view'
    }
  ]

  // Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className="fixed top-0 left-0 bottom-0 w-16 p-4 bg-scout-card border-r border-gray-200">
        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="w-8 h-8 mb-6 flex items-center justify-center text-gray-500 hover:text-scout-secondary hover:bg-gray-50 rounded-lg transition-colors"
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
                    ? 'bg-scout-secondary text-white' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-scout-secondary'
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
    <div className="fixed top-0 left-0 bottom-0 w-64 p-4 bg-scout-card border-r border-gray-200">
      {/* Header with Toggle */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="w-8 h-8 text-scout-secondary mr-3" />
          <div>
            <h1 className="text-xl font-bold text-scout-text">Scout Analytics</h1>
            <p className="text-sm text-gray-500">Retail Intelligence</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <hr className="mb-6 border-scout-border" />

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
                  ? 'bg-scout-border text-scout-text' 
                  : 'text-scout-text hover:bg-gray-50 hover:text-scout-secondary'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-scout-secondary' : ''}`} />
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-gray-500 space-y-1">
          <div>Created by <strong>Scout Team</strong></div>
          <div>Data Source: <strong>Live Recordings</strong></div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar