import React from 'react'
import { TrendingUp, Package, Users, UserCheck, BarChart3, Database } from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
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
      id: 'databank',
      label: 'Databank Dashboard', 
      icon: Database,
      description: 'Complete analytics view'
    }
  ]

  return (
    <div className="scout-sidebar">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <BarChart3 className="w-8 h-8 text-scout-secondary mr-3" />
        <div>
          <h1 className="text-xl font-bold text-scout-text">Scout Analytics</h1>
          <p className="text-sm text-gray-500">Retail Intelligence</p>
        </div>
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