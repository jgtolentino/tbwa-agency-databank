import { useMemo } from 'react'
import { KPICard } from '@/components/cards/KPICard'
import { TrendChart } from '@/components/charts/TrendChart'
import { RegionalHeatmap } from '@/components/charts/RegionalHeatmap'
import { TopPerformers } from '@/components/cards/TopPerformers'

interface OverviewGridProps {
  data: any[]
  aggregated: any
  filters: any
  userRole?: string
}

export function OverviewGrid({ data, aggregated, filters, userRole }: OverviewGridProps) {
  // Calculate KPIs with performance optimization
  const kpis = useMemo(() => {
    const prevPeriodRevenue = calculatePreviousPeriodRevenue(data, filters)
    const revenueGrowth = prevPeriodRevenue > 0 
      ? ((aggregated.totalRevenue - prevPeriodRevenue) / prevPeriodRevenue * 100)
      : 0

    return {
      revenue: {
        value: aggregated.totalRevenue,
        change: revenueGrowth,
        label: 'Total Revenue'
      },
      transactions: {
        value: aggregated.totalTransactions,
        change: 12.5, // Mock - calculate actual
        label: 'Transactions'
      },
      avgBasket: {
        value: aggregated.avgBasketSize,
        change: -2.3, // Mock - calculate actual
        label: 'Avg Basket Size'
      },
      topCategory: {
        value: aggregated.topCategories?.[0]?.name || 'N/A',
        revenue: aggregated.topCategories?.[0]?.revenue || 0,
        label: 'Top Category'
      }
    }
  }, [data, aggregated, filters])

  // Role-based KPI visibility
  const visibleKPIs = useMemo(() => {
    switch (userRole) {
      case 'executive':
        return ['revenue', 'transactions', 'avgBasket', 'topCategory']
      case 'regional_manager':
        return ['revenue', 'transactions', 'avgBasket']
      case 'store_owner':
        return ['transactions', 'avgBasket']
      default:
        return ['revenue', 'transactions']
    }
  }, [userRole])

  return (
    <>
      {/* KPI Cards Row */}
      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {visibleKPIs.includes('revenue') && (
          <KPICard
            title={kpis.revenue.label}
            value={`₱${(kpis.revenue.value / 1000).toFixed(1)}k`}
            change={kpis.revenue.change}
            trend="up"
          />
        )}
        {visibleKPIs.includes('transactions') && (
          <KPICard
            title={kpis.transactions.label}
            value={kpis.transactions.value.toLocaleString()}
            change={kpis.transactions.change}
            trend="up"
          />
        )}
        {visibleKPIs.includes('avgBasket') && (
          <KPICard
            title={kpis.avgBasket.label}
            value={`₱${kpis.avgBasket.value.toFixed(2)}`}
            change={kpis.avgBasket.change}
            trend="down"
          />
        )}
        {visibleKPIs.includes('topCategory') && (
          <KPICard
            title={kpis.topCategory.label}
            value={kpis.topCategory.value}
            subtitle={`₱${(kpis.topCategory.revenue / 1000).toFixed(1)}k`}
          />
        )}
      </div>

      {/* Main Charts Grid */}
      <div className="card col-span-full md:col-span-2">
        <div className="card-header">
          <h4>Revenue Trend</h4>
        </div>
        <div className="card-body">
          <TrendChart 
            data={aggregated.dailyMetrics} 
            metric="revenue"
            color="#10b981"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Regional Performance</h4>
        </div>
        <div className="card-body">
          <RegionalHeatmap 
            data={aggregated.regionMetrics}
            metric="revenue"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Top Products</h4>
        </div>
        <div className="card-body">
          <TopPerformers 
            data={aggregated.topCategories?.slice(0, 5)}
            type="category"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Top Brands</h4>
        </div>
        <div className="card-body">
          <TopPerformers 
            data={aggregated.topBrands?.slice(0, 5)}
            type="brand"
          />
        </div>
      </div>

      {/* Executive-only insights */}
      {userRole === 'executive' && (
        <div className="card col-span-full">
          <div className="card-header">
            <h4>Executive Insights</h4>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              Ask Aladdin
            </button>
          </div>
          <div className="card-body">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Revenue is up {kpis.revenue.change.toFixed(1)}% compared to the previous period. 
                {aggregated.topCategories?.[0]?.name} continues to be the top-performing category.
                Consider focusing marketing efforts on underperforming regions.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function calculatePreviousPeriodRevenue(data: any[], filters: any): number {
  // Mock calculation - implement actual logic based on your data structure
  return data.reduce((sum, item) => sum + item.peso_value, 0) * 0.85
}