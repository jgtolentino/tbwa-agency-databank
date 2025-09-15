import React, { useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import AIPanel from './components/layout/AIPanel'
import TransactionTrends from './components/sections/TransactionTrends'
import ProductMix from './components/sections/ProductMix'
import ConsumerBehavior from './components/sections/ConsumerBehavior'
import ConsumerProfiling from './components/sections/ConsumerProfiling'

function App() {
  const [activeSection, setActiveSection] = useState('transaction-trends')

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'transaction-trends':
        return <TransactionTrends />
      case 'product-mix':
        return <ProductMix />
      case 'consumer-behavior':
        return <ConsumerBehavior />
      case 'consumer-profiling':
        return <ConsumerProfiling />
      default:
        return <TransactionTrends />
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