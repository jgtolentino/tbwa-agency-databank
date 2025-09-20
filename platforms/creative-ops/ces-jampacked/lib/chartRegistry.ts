import { ChartType } from '@/types'

export interface ChartRegistryItem {
  type: ChartType;
  name: string;
  description: string;
  icon: string;
  minWidth: number;
  minHeight: number;
  defaultWidth: number;
  defaultHeight: number;
}

export const chartRegistry: Record<ChartType, ChartRegistryItem> = {
  bar: {
    type: 'bar',
    name: 'Bar Chart',
    description: 'Compare values across categories',
    icon: 'BarChart',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 4,
    defaultHeight: 3,
  },
  stackedBar: {
    type: 'stackedBar',
    name: 'Stacked Bar Chart',
    description: 'Show composition across categories',
    icon: 'BarChart3',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 4,
    defaultHeight: 3,
  },
  line: {
    type: 'line',
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: 'LineChart',
    minWidth: 3,
    minHeight: 2,
    defaultWidth: 6,
    defaultHeight: 3,
  },
  area: {
    type: 'area',
    name: 'Area Chart',
    description: 'Show cumulative trends',
    icon: 'AreaChart',
    minWidth: 3,
    minHeight: 2,
    defaultWidth: 6,
    defaultHeight: 3,
  },
  donut: {
    type: 'donut',
    name: 'Donut Chart',
    description: 'Show part-to-whole relationships',
    icon: 'PieChart',
    minWidth: 2,
    minHeight: 2,
    defaultWidth: 3,
    defaultHeight: 3,
  },
  heatmap: {
    type: 'heatmap',
    name: 'Heatmap',
    description: 'Show intensity across two dimensions',
    icon: 'Grid3x3',
    minWidth: 3,
    minHeight: 3,
    defaultWidth: 4,
    defaultHeight: 4,
  },
  choropleth: {
    type: 'choropleth',
    name: 'Choropleth Map',
    description: 'Show geographic distribution',
    icon: 'Map',
    minWidth: 4,
    minHeight: 3,
    defaultWidth: 6,
    defaultHeight: 4,
  },
  kpi: {
    type: 'kpi',
    name: 'KPI Card',
    description: 'Display key metrics',
    icon: 'TrendingUp',
    minWidth: 2,
    minHeight: 1,
    defaultWidth: 2,
    defaultHeight: 1,
  },
}

export const getChartConfig = (type: ChartType) => chartRegistry[type]
