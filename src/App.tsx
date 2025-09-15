import React, { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import AIPanel from './components/layout/AIPanel'
import { GlobalFilters, FilterState, exportToPDF, exportToExcel } from './components/filters/GlobalFilters'
import { 
  EnhancedTransactionTrends,
  EnhancedProductMix,
  EnhancedConsumerBehavior,
  EnhancedConsumerProfiling
} from './components/enhanced/EnhancedDashboard'

function App() {
  const [activeSection, setActiveSection] = useState('transaction-trends')
  const [showEnhanced, setShowEnhanced] = useState(true) // Toggle between enhanced and basic views
  
  // Global filter state
  const [filters, setFilters] = useState<FilterState>({
    timeframe: '7d',
    location: 'all',
    category: 'all',
    brand: 'all'
  })

  const handleRefresh = () => {
    console.log('Refreshing dashboard data...')
    // In a real implementation, this would trigger data refresh
  }

  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      exportToPDF()
    } else {
      exportToExcel()
    }
  }

  const renderActiveSection = () => {
    if (showEnhanced) {
      switch (activeSection) {
        case 'transaction-trends':
          return <EnhancedTransactionTrends />
        case 'product-mix':
          return <EnhancedProductMix />
        case 'consumer-behavior':
          return <EnhancedConsumerBehavior />
        case 'consumer-profiling':
          return <EnhancedConsumerProfiling />
        default:
          return <EnhancedTransactionTrends />
      }
    } else {
      // Fallback to basic components if needed
      switch (activeSection) {
        case 'transaction-trends':
          return <EnhancedTransactionTrends />
        case 'product-mix':
          return <EnhancedProductMix />
        case 'consumer-behavior':
          return <EnhancedConsumerBehavior />
        case 'consumer-profiling':
          return <EnhancedConsumerProfiling />
        default:
          return <EnhancedTransactionTrends />
      }
    }
  }

  return (
    <div className="min-h-screen bg-scout-light">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Main Content Area */}
      <div className="scout-content">
        {/* Global Filters */}
        <GlobalFilters 
          filters={filters}
          onFilterChange={setFilters}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Dashboard Content */}
          <div className="xl:col-span-3">
            {renderActiveSection()}
          </div>
          
          {/* AI Recommendations Panel */}
          <div className="xl:col-span-1">
            <AIPanel section={activeSection} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App