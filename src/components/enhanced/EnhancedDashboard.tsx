import React, { useState } from 'react'
import { Download, RefreshCw, Calendar, MapPin, Package, Filter } from 'lucide-react'
import { 
  TransactionAreaChart, 
  ProductMixPieChart, 
  ProductMixLegend,
  CustomerJourneyFunnel,
  IncomeDistributionChart,
  UrbanRuralChart,
  EnhancedKPICard,
  TabNavigation 
} from '../charts/AdvancedCharts'

// Enhanced data from Scout dashboard analysis
const transactionData = [
  { date: 'Aug 19', transactions: 487 },
  { date: 'Aug 21', transactions: 523 },
  { date: 'Aug 23', transactions: 601 },
  { date: 'Aug 25', transactions: 578 },
  { date: 'Aug 27', transactions: 649 },
  { date: 'Aug 29', transactions: 612 },
  { date: 'Sep 1', transactions: 689 },
  { date: 'Sep 3', transactions: 734 },
  { date: 'Sep 5', transactions: 712 },
  { date: 'Sep 7', transactions: 756 },
  { date: 'Sep 9', transactions: 681 },
  { date: 'Sep 11', transactions: 723 },
  { date: 'Sep 13', transactions: 698 },
  { date: 'Sep 15', transactions: 742 }
]

const productMixData = [
  { name: 'Beverages', value: 35 },
  { name: 'Snacks', value: 25 },
  { name: 'Personal Care', value: 20 },
  { name: 'Household', value: 15 },
  { name: 'Others', value: 5 }
]

const customerJourneyData = [
  { stage: 'Awareness', count: 1000 },
  { stage: 'Interest', count: 850 },
  { stage: 'Consideration', count: 650 },
  { stage: 'Intent', count: 480 },
  { stage: 'Purchase', count: 420 }
]

const incomeData = [
  { income: 'High', percentage: 25 },
  { income: 'Middle', percentage: 58 },
  { income: 'Low', percentage: 17 }
]

const urbanRuralData = [
  { name: 'Urban', value: 71 },
  { name: 'Rural', value: 29 }
]

export const EnhancedTransactionTrends = () => {
  const [activeTab, setActiveTab] = useState('Volume')
  const tabs = ['Volume', 'Revenue', 'Basket Size', 'Duration']

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Transaction Trends</h2>
          <p className="text-gray-600">Volume, timing & patterns with advanced analytics</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Daily Volume"
          value="649"
          change={12.3}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Daily Revenue"
          value="₱135,785"
          change={-13.1}
          trend="down"
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Basket Size"
          value="2.4"
          change={5.7}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Avg Duration"
          value="42s"
          change={-8.2}
          trend="down"
          icon={Package}
        />
      </div>

      {/* Tab Navigation */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {/* Chart Content */}
        <div className="mt-4">
          {activeTab === 'Volume' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Transaction Volume Trends</h3>
              <TransactionAreaChart data={transactionData} />
            </div>
          )}
          {activeTab === 'Revenue' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Revenue chart will be displayed here</p>
            </div>
          )}
          {activeTab === 'Basket Size' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Basket size chart will be displayed here</p>
            </div>
          )}
          {activeTab === 'Duration' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Duration chart will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const EnhancedProductMix = () => {
  const [activeTab, setActiveTab] = useState('Category Mix')
  const tabs = ['Category Mix', 'Pareto Analysis', 'Substitutions', 'Basket Analysis']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Product Mix & SKU Analytics</h2>
          <p className="text-gray-600">Category performance, brand insights & cross-sell analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-secondary flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Total SKUs"
          value="369"
          change={8}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Active SKUs"
          value="342"
          change={5}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="New SKUs"
          value="12"
          change={3}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Category Diversity"
          value="85%"
          change={2.1}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Category Mix' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Product Category Distribution</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductMixPieChart data={productMixData} />
                <div>
                  <ProductMixLegend data={productMixData} />
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-scout-secondary">
                    <p className="text-sm font-medium text-scout-text">Key Insight</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Beverages lead at 35% of transactions, followed by snacks at 25%. 
                      Personal care shows growth potential with 20% share.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'Pareto Analysis' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">80/20 analysis: Top 20% SKUs generate 80% revenue</p>
            </div>
          )}
          {activeTab === 'Substitutions' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Product substitution patterns will be displayed here</p>
            </div>
          )}
          {activeTab === 'Basket Analysis' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Market basket analysis will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const EnhancedConsumerBehavior = () => {
  const [activeTab, setActiveTab] = useState('Purchase Funnel')
  const tabs = ['Purchase Funnel', 'Request Methods', 'Acceptance Rates', 'Behavior Traits']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Consumer Behavior Analytics</h2>
          <p className="text-gray-600">Purchase decisions, patterns & customer journey analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Conversion Rate"
          value="42%"
          change={3.2}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Suggestion Accept"
          value="73.8%"
          change={5.1}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Brand Loyalty"
          value="68%"
          change={-1.4}
          trend="down"
          icon={Package}
        />
        <EnhancedKPICard
          title="Discovery Rate"
          value="23%"
          change={7.8}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Purchase Funnel' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Customer Purchase Journey</h3>
              <CustomerJourneyFunnel data={customerJourneyData} />
              <div className="mt-4 grid grid-cols-5 gap-4">
                {customerJourneyData.map((stage, index) => (
                  <div key={stage.stage} className="text-center">
                    <div className="text-2xl font-bold text-scout-text">{stage.count}</div>
                    <div className="text-sm text-gray-600">{stage.stage}</div>
                    {index < customerJourneyData.length - 1 && (
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((stage.count / customerJourneyData[index + 1].count - 1) * 100)}% drop
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Request Methods' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Voice vs Visual request patterns will be displayed here</p>
            </div>
          )}
          {activeTab === 'Acceptance Rates' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Suggestion acceptance analysis will be displayed here</p>
            </div>
          )}
          {activeTab === 'Behavior Traits' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Customer behavior traits will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const EnhancedConsumerProfiling = () => {
  const [activeTab, setActiveTab] = useState('Demographics')
  const tabs = ['Demographics', 'Age & Gender', 'Location', 'Segment Behavior']

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-scout-text mb-2">Consumer Profiling Analytics</h2>
          <p className="text-gray-600">Demographics, location patterns & customer segmentation</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="scout-btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EnhancedKPICard
          title="Total Customers"
          value="11,000"
          change={8.3}
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Average Age"
          value="32.5"
          change={0.8}
          changeType="absolute"
          trend="up"
          icon={Package}
        />
        <EnhancedKPICard
          title="Gender Split"
          value="48/52"
          trend="neutral"
          icon={Package}
        />
        <EnhancedKPICard
          title="Urban Customers"
          value="71%"
          change={2.1}
          trend="up"
          icon={Package}
        />
      </div>

      {/* Tab Navigation with Charts */}
      <div className="scout-card-chart p-6">
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <div className="mt-4">
          {activeTab === 'Demographics' && (
            <div>
              <h3 className="text-lg font-semibold text-scout-text mb-4">Income & Location Distribution</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-medium text-scout-text mb-2">Income Distribution</h4>
                  <IncomeDistributionChart data={incomeData} />
                </div>
                <div>
                  <h4 className="text-md font-medium text-scout-text mb-2">Urban vs Rural</h4>
                  <UrbanRuralChart data={urbanRuralData} />
                  <div className="flex justify-center mt-2 space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      <span className="text-sm">Urban 71%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-sm">Rural 29%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-scout-accent">
                <p className="text-sm font-medium text-scout-text">Geographic Insight</p>
                <p className="text-sm text-gray-600 mt-1">
                  Metro Manila accounts for 35% of customers but generates 45% of revenue, 
                  indicating higher spending power in urban areas.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'Age & Gender' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Age and gender distribution charts will be displayed here</p>
            </div>
          )}
          {activeTab === 'Location' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Geographic heat maps and location analysis will be displayed here</p>
            </div>
          )}
          {activeTab === 'Segment Behavior' && (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Customer segment behavior analysis will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}