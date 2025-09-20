# Scout Dashboard Chart Inventory

Complete catalog of all chart types found in the Scout Dashboard codebase.

## Chart Categories & Components

### 1. **Bar Charts**
- **PurchaseFunnelChart** (`BehaviorCharts.tsx`) - Horizontal bar chart for funnel analysis
- **RequestMethodsBar** (`BehaviorCharts.tsx`) - Vertical bar chart for request methods
- **AgeGenderBar** (`ProfilingCharts.tsx`) - Vertical bar chart for demographics
- **VolumeBarChart** (`TransactionCharts.tsx`) - Volume data with 7-day view
- **DurationBarChart** (`TransactionCharts.tsx`) - Horizontal duration distribution
- **IncomeDistributionChart** (`AdvancedCharts.tsx`) - Income brackets analysis
- **ProductMixPieChart** (`AdvancedCharts.tsx`) - Actually horizontal bar chart despite name
- **BarChart** (`src/charts/BarChart.tsx`) - Generic configurable bar chart component
- **SeasonalityChart** (`TrendCharts.tsx`) - Day-of-week bar chart

### 2. **Pie & Donut Charts**
- **CategoryPieChart** (`ProductCharts.tsx`) - Product category revenue breakdown
- **DemographicsPie** (`ProfilingCharts.tsx`) - Age group distribution
- **LocationPie** (`ProfilingCharts.tsx`) - Geographic location pie chart
- **UrbanRuralChart** (`AdvancedCharts.tsx`) - Urban vs rural donut chart

### 3. **Line Charts**
- **RevenueLineChart** (`TransactionCharts.tsx`) - 30-day revenue trend
- **BasketSizeChart** (`TransactionCharts.tsx`) - Average basket size over 14 days
- **TrendChart** (`TrendChart.tsx`) - Generic configurable trend chart
- **TrendLineChart** (`TrendCharts.tsx`) - Metric-based trend visualization
- **BasketSizeChart** (`AdvancedCharts.tsx`) - Basket size + efficiency trends
- **RevenueChart** (`AdvancedCharts.tsx`) - Combined area + line chart

### 4. **Area Charts**
- **TransactionAreaChart** (`AdvancedCharts.tsx`) - TBWA-styled transaction trends with gradient
- **DurationChart** (`AdvancedCharts.tsx`) - Duration trends with gradient fill
- **RequestMethodsChart** (`AdvancedCharts.tsx`) - Stacked area for voice/visual requests

### 5. **Maps & Geographic Visualization**
- **RegionalHeatmap** (`RegionalHeatmap.tsx`) - Simple grid-based regional heatmap
- **ChoroplethMap** (`ChoroplethMap.tsx`) - Custom SVG-based Philippines map
- **MapboxChoroplethMap** (`MapboxChoroplethMap.tsx`) - Mapbox GL choropleth map
- **MercatorChoroplethMap** (`MercatorChoroplethMap.tsx`) - Plotly-based choropleth
- **VisxChoroplethMap** (`VisxChoroplethMap.tsx`) - visx/D3-based choropleth
- **RegionalHeatmapChart** (`AdvancedCharts.tsx`) - Performance by region
- **StoreLocationChart** (`AdvancedCharts.tsx`) - Location type analysis
- **LocationChart** (`AdvancedCharts.tsx`) - Geographic performance comparison
- **GeoDemographicsChart** (`AdvancedCharts.tsx`) - Geographic demographics

### 6. **Combined/Composed Charts**
- **RevenueChart** (`AdvancedCharts.tsx`) - Area + line combination
- **ParetoChart** (`AdvancedCharts.tsx`) - Bar + line for 80/20 analysis
- **BrandMarketShareChart** (`AdvancedCharts.tsx`) - Multi-metric comparison
- **CategoryCompetitiveChart** (`AdvancedCharts.tsx`) - Competitive analysis
- **TimePeriodCompetitiveChart** (`AdvancedCharts.tsx`) - Time-based performance
- **AcceptanceRatesChart** (`AdvancedCharts.tsx`) - Bar + line acceptance rates
- **AgeGenderChart** (`AdvancedCharts.tsx`) - Grouped bar chart
- **SegmentBehaviorChart** (`AdvancedCharts.tsx`) - Multi-metric segment analysis
- **BasketAnalysisChart** (`AdvancedCharts.tsx`) - Market basket analysis

### 7. **Specialty Charts**
- **CustomerJourneyFunnel** (`AdvancedCharts.tsx`) - Custom SVG funnel visualization
- **SubstitutionChart** (`AdvancedCharts.tsx`) - Custom Sankey-style flow chart
- **BehaviorTraitsChart** (`AdvancedCharts.tsx`) - Enhanced horizontal bar with insights

### 8. **KPI Cards & Indicators**
- **AcceptanceRateBar** (`BehaviorCharts.tsx`) - Progress bar with percentage
- **KPICard** (`src/charts/KPICard.tsx`) - Configurable KPI card with trends
- **EnhancedKPICard** (`AdvancedCharts.tsx`) - Scout-styled KPI card with icons

### 9. **Tables & Grids**
- **SubstitutionTable** (`ProductCharts.tsx`) - Product substitution table

### 10. **Navigation & UI Components**
- **TabNavigation** (`AdvancedCharts.tsx`) - Tab-based navigation component

## Technology Stack

### Chart Libraries Used:
- **Recharts** - Primary charting library (Bar, Line, Pie, Area, ComposedChart)
- **Mapbox GL** - Interactive maps with real geographical data
- **Plotly.js** - Scientific visualization and choropleth maps
- **visx/D3** - Advanced custom visualizations
- **Custom SVG** - Bespoke charts (funnels, sankey diagrams)

### Styling & Design:
- **TBWA Color Palette** - Consistent brand colors (#FFD700 yellow, #1E40AF blue, etc.)
- **Tailwind CSS** - Responsive styling and layout
- **Scout Design System** - Custom branded components
- **Lucide Icons** - Consistent iconography

## Data Visualization Patterns

### 1. **Business Intelligence Dashboards**
- Revenue/transaction trend analysis
- Geographic performance mapping
- Customer segmentation analysis
- Product mix optimization

### 2. **Advanced Analytics**
- Pareto analysis (80/20 rule)
- Market basket analysis
- Competitive benchmarking
- Customer journey mapping

### 3. **Interactive Features**
- Hover tooltips with detailed metrics
- Metric switcher buttons
- Responsive design across devices
- Real-time data updates

### 4. **Performance Optimization**
- Memoized calculations with useMemo
- Responsive containers
- Efficient data transformations
- Progressive enhancement

## File Structure Summary

```
/components/charts/           # Main chart components
├── BehaviorCharts.tsx       # Behavior analysis charts
├── ProductCharts.tsx        # Product performance charts
├── ProfilingCharts.tsx      # Customer profiling charts
├── RegionalHeatmap.tsx      # Geographic heatmap
├── TransactionCharts.tsx    # Transaction trend charts
├── TrendChart.tsx           # Generic trend component
└── TrendCharts.tsx          # Trend analysis charts

/src/components/charts/       # Core chart library
├── AdvancedCharts.tsx       # Comprehensive chart collection
├── BarChart.tsx             # Generic bar chart
├── KPICard.tsx              # KPI indicator component
├── ChoroplethMap.tsx        # Custom SVG map
├── MapboxChoroplethMap.tsx  # Mapbox implementation
├── MercatorChoroplethMap.tsx # Plotly implementation
└── VisxChoroplethMap.tsx    # visx/D3 implementation
```

This inventory represents a comprehensive business intelligence dashboard with 50+ chart components covering all major visualization types needed for retail analytics, customer insights, geographic analysis, and competitive intelligence.