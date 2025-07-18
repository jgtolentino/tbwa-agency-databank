import { useMemo } from 'react'
import { CardWithSwitcher } from '@/components/cards/CardWithSwitcher'
import {
  TrendLineChart,
  MovingAverageChart,
  SeasonalityChart,
  GrowthRateChart
} from '@/components/charts/TrendCharts'

interface TrendsGridProps {
  data: any[]
  aggregated: any
  filters: any
}

export function TrendsGrid({ data, aggregated, filters }: TrendsGridProps) {
  const trendData = useMemo(() => {
    return {
      daily: aggregated.dailyMetrics || [],
      weekly: aggregateByWeek(aggregated.dailyMetrics || []),
      monthly: aggregateByMonth(aggregated.dailyMetrics || []),
      seasonal: calculateSeasonality(data)
    }
  }, [data, aggregated])

  return (
    <>
      <div className="card col-span-full md:col-span-2">
        <div className="card-header">
          <h4>Revenue Trends</h4>
        </div>
        <div className="card-body">
          <TrendLineChart data={trendData} metric="revenue" />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Growth Analysis</h4>
        </div>
        <div className="card-body">
          <GrowthRateChart data={trendData} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4>Moving Averages</h4>
        </div>
        <div className="card-body">
          <MovingAverageChart data={trendData.daily} periods={[7, 14, 30]} />
        </div>
      </div>

      <div className="card col-span-full">
        <div className="card-header">
          <h4>Seasonality Patterns</h4>
        </div>
        <div className="card-body">
          <SeasonalityChart data={trendData.seasonal} />
        </div>
      </div>
    </>
  )
}

function aggregateByWeek(dailyData: any[]) {
  // Mock weekly aggregation
  const weeks: any[] = []
  for (let i = 0; i < dailyData.length; i += 7) {
    const weekData = dailyData.slice(i, i + 7)
    if (weekData.length > 0) {
      weeks.push({
        week: `Week ${Math.floor(i / 7) + 1}`,
        revenue: weekData.reduce((sum, d) => sum + d.revenue, 0),
        count: weekData.reduce((sum, d) => sum + d.count, 0)
      })
    }
  }
  return weeks
}

function aggregateByMonth(dailyData: any[]) {
  // Mock monthly aggregation
  const months: Record<string, any> = {}
  
  dailyData.forEach(day => {
    const month = new Date(day.date).toLocaleDateString('en', { year: 'numeric', month: 'short' })
    if (!months[month]) {
      months[month] = { month, revenue: 0, count: 0 }
    }
    months[month].revenue += day.revenue
    months[month].count += day.count
  })
  
  return Object.values(months)
}

function calculateSeasonality(data: any[]) {
  // Mock seasonality calculation
  return [
    { day: 'Monday', avgRevenue: 45000, avgTransactions: 120 },
    { day: 'Tuesday', avgRevenue: 48000, avgTransactions: 125 },
    { day: 'Wednesday', avgRevenue: 52000, avgTransactions: 135 },
    { day: 'Thursday', avgRevenue: 51000, avgTransactions: 130 },
    { day: 'Friday', avgRevenue: 65000, avgTransactions: 165 },
    { day: 'Saturday', avgRevenue: 72000, avgTransactions: 180 },
    { day: 'Sunday', avgRevenue: 58000, avgTransactions: 145 }
  ]
}