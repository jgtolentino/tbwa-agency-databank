import { useMemo } from 'react'
import { CardWithSwitcher } from '@/components/cards/CardWithSwitcher'
import {
  VolumeBarChart,
  RevenueLineChart,
  BasketSizeChart,
  DurationBarChart
} from '@/components/charts/TransactionCharts'
import {
  CategoryPieChart,
  ParetoBarLineChart,
  SubstitutionTable,
  BasketTimeHeatmap
} from '@/components/charts/ProductCharts'
import {
  PurchaseFunnelChart,
  RequestMethodsBar,
  AcceptanceRateBar,
  BehaviorRadarChart
} from '@/components/charts/BehaviorCharts'
import {
  DemographicsPie,
  AgeGenderBar,
  LocationPie,
  SegmentLineBarCombo
} from '@/components/charts/ProfilingCharts'

interface DatabankGridProps {
  data: any[]
  aggregated: any
  filters: any
}

export function DatabankGrid({ data, aggregated, filters }: DatabankGridProps) {
  // Pre-process data for optimal performance
  const processedData = useMemo(() => {
    return {
      transactions: aggregated,
      products: aggregated.topCategories?.slice(0, 10),
      behavior: calculateBehaviorMetrics(data),
      demographics: calculateDemographics(data)
    }
  }, [data, aggregated])

  return (
    <>
      <CardWithSwitcher
        title="Transaction Trends"
        data={processedData.transactions}
        filters={filters}
        views={{
          volume: VolumeBarChart,
          revenue: RevenueLineChart,
          basket: BasketSizeChart,
          duration: DurationBarChart
        }}
      />
      
      <CardWithSwitcher
        title="Product Mix & SKU"
        data={processedData.products}
        filters={filters}
        views={{
          mix: CategoryPieChart,
          pareto: ParetoBarLineChart,
          subs: SubstitutionTable,
          basketHeat: BasketTimeHeatmap
        }}
      />
      
      <CardWithSwitcher
        title="Consumer Behavior"
        data={processedData.behavior}
        filters={filters}
        views={{
          funnel: PurchaseFunnelChart,
          methods: RequestMethodsBar,
          acceptance: AcceptanceRateBar,
          traits: BehaviorRadarChart
        }}
      />
      
      <CardWithSwitcher
        title="Consumer Profiling"
        data={processedData.demographics}
        filters={filters}
        views={{
          demographics: DemographicsPie,
          ageGender: AgeGenderBar,
          location: LocationPie,
          segment: SegmentLineBarCombo
        }}
      />
    </>
  )
}

// Helper functions for data processing
function calculateBehaviorMetrics(data: any[]) {
  // Mock behavior metrics - replace with actual calculations
  return {
    funnel: [
      { stage: 'Awareness', count: 1000 },
      { stage: 'Interest', count: 750 },
      { stage: 'Consideration', count: 500 },
      { stage: 'Purchase', count: 250 },
      { stage: 'Retention', count: 100 }
    ],
    methods: [
      { method: 'Online', count: 450 },
      { method: 'In-Store', count: 350 },
      { method: 'Mobile', count: 200 }
    ],
    acceptance: 0.78,
    traits: [
      { trait: 'Price Conscious', score: 0.8 },
      { trait: 'Brand Loyal', score: 0.6 },
      { trait: 'Impulse Buyer', score: 0.4 },
      { trait: 'Research Driven', score: 0.7 }
    ]
  }
}

function calculateDemographics(data: any[]) {
  // Mock demographic data - replace with actual calculations
  return {
    age: [
      { range: '18-24', count: 150 },
      { range: '25-34', count: 300 },
      { range: '35-44', count: 250 },
      { range: '45-54', count: 200 },
      { range: '55+', count: 100 }
    ],
    gender: [
      { type: 'Male', count: 450 },
      { type: 'Female', count: 520 },
      { type: 'Other', count: 30 }
    ],
    locations: [
      { name: 'Metro Manila', count: 400 },
      { name: 'Cebu', count: 200 },
      { name: 'Davao', count: 150 },
      { name: 'Others', count: 250 }
    ],
    segments: [
      { name: 'Premium', value: 25 },
      { name: 'Regular', value: 50 },
      { name: 'Budget', value: 25 }
    ]
  }
}