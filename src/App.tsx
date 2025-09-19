import React, { useState, useEffect } from 'react'
import Sidebar from './components/layout/Sidebar'
import AIPanel from './components/layout/AIPanel'
import { CascadingFilterPanel, CascadingFilterState } from './components/filters/CascadingFilterPanel'
import {
  EnhancedTransactionTrends,
  EnhancedProductMix,
  EnhancedConsumerBehavior,
  EnhancedConsumerProfiling,
  EnhancedCompetitiveAnalysis,
  EnhancedGeographicalIntelligence
} from './components/enhanced/EnhancedDashboard'
import { DatabankPage } from './components/databank'
import DataSourceBadge from './components/ui/DataSourceBadge'
import { assertNoMockInProd } from './lib/env'
import ExecutiveOverview from './components/executive/ExecutiveOverview'

function App() {
  const [activeSection, setActiveSection] = useState('executive-overview')
  const [showEnhanced, setShowEnhanced] = useState(true) // Toggle between enhanced and basic views
  
  // Panel states
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  
  // Cascading filter state
  const [cascadingFilters, setCascadingFilters] = useState<CascadingFilterState>({
    comparisonMode: 'single',
    selectedBrands: [],
    brandComparison: 'vs',
    selectedCategories: [],
    categoryComparison: 'vs',
    selectedRegions: [],
    selectedStores: [],
    locationComparison: 'vs',
    timePeriod: 'daily',
    dateRange: {
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    temporalComparison: 'current',
    customerSegment: [],
    transactionType: [],
    priceRange: [0, 10000],
    showTrends: true,
    showDeltas: false,
    showPercentages: true
  })

  // Production guard - prevent mocks in production
  useEffect(() => {
    assertNoMockInProd();
  }, []);

  const handleRefresh = () => {
    console.log('Refreshing dashboard data...', cascadingFilters)
    // In a real implementation, this would trigger data refresh with filters
  }

  const handleFilterApply = () => {
    console.log('Applying filters:', cascadingFilters)
    handleRefresh()
  }

  const handleFilterReset = () => {
    setCascadingFilters({
      comparisonMode: 'single',
      selectedBrands: [],
      brandComparison: 'vs',
      selectedCategories: [],
      categoryComparison: 'vs',
      selectedRegions: [],
      selectedStores: [],
      locationComparison: 'vs',
      timePeriod: 'daily',
      dateRange: {
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      temporalComparison: 'current',
      customerSegment: [],
      transactionType: [],
      priceRange: [0, 10000],
      showTrends: true,
      showDeltas: false,
      showPercentages: true
    })
  }

  const renderActiveSection = () => {
    // Check if this is the full databank page
    if (activeSection === 'databank') {
      return <DatabankPage />
    }

    // Check if this is the executive overview page
    if (activeSection === 'executive-overview') {
      return <ExecutiveOverview />
    }

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
        case 'competitive-analysis':
          return <EnhancedCompetitiveAnalysis />
        case 'geographical-intelligence':
          return <EnhancedGeographicalIntelligence />
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
        case 'competitive-analysis':
          return <EnhancedCompetitiveAnalysis />
        case 'geographical-intelligence':
          return <EnhancedGeographicalIntelligence />
        default:
          return <EnhancedTransactionTrends />
      }
    }
  }

  return (
    <div className="min-h-screen bg-scout-light">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        {/* Main Content Area */}
        <div 
          className="flex-1 flex transition-all duration-300"
          style={{ marginLeft: isSidebarCollapsed ? '64px' : '256px' }}
        >
          {/* Dashboard Content */}
          <div className="flex-1 p-6">
            {/* Data Source Status Header - only show for non-executive sections */}
            {activeSection !== 'executive-overview' && (
              <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeSection.replace('-', ' ')} Dashboard
                </h1>
                <DataSourceBadge
                  data-testid="data-source-badge"
                  showDetails={true}
                  size="md"
                />
              </div>
            )}

            {/* Check if this is the databank or executive overview page for different layout */}
            {activeSection === 'databank' || activeSection === 'executive-overview' ? (
              <div className="w-full">
                {renderActiveSection()}
              </div>
            ) : (
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
            )}
          </div>
          
          {/* Cascading Filter Panel - hide for databank and executive overview */}
          {activeSection !== 'databank' && activeSection !== 'executive-overview' && (
            <CascadingFilterPanel
              isCollapsed={isFilterCollapsed}
              onToggle={() => setIsFilterCollapsed(!isFilterCollapsed)}
              filters={cascadingFilters}
              onFilterChange={setCascadingFilters}
              onReset={handleFilterReset}
              onApply={handleFilterApply}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App