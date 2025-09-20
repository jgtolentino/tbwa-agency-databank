# Scout Dashboard ↔ r19 Visualization Kit Component Mapping

Complete component-level mapping documentation for DashMorph universal dashboard conversion system.

## Overview

This document provides detailed mappings between Scout Dashboard's 50+ chart components and r19 Data Visualization Kit equivalents, enabling pixel-perfect dashboard reconstruction through the DashMorph system.

## Component Mapping Matrix

### Bar Chart Family

#### 1. Purchase Funnel Chart
```typescript
// Scout Implementation
<PurchaseFunnelChart data={funnelData} />

// r19 Equivalent
<HorizontalBarChart
  data={transformedData}
  orientation="horizontal"
  colorScheme="tbwa"
  showGrid={true}
/>
```
**Mapping**: `BehaviorCharts.tsx:3` → r19 Horizontal Bar Chart
**Complexity**: Low
**Data Transform**: Preserve stage/count structure

#### 2. Request Methods Bar
```typescript
// Scout Implementation
<RequestMethodsBar data={methodsData} />

// r19 Equivalent
<VerticalBarChart
  data={transformedData}
  xAxis="method"
  yAxis="count"
  color="#10b981"
/>
```
**Mapping**: `BehaviorCharts.tsx:19` → r19 Vertical Bar Chart
**Complexity**: Low
**Data Transform**: Method/count key-value pairs

#### 3. Age Gender Bar
```typescript
// Scout Implementation
<AgeGenderBar data={genderData} />

// r19 Equivalent
<GroupedBarChart
  data={transformedData}
  groups={["male", "female"]}
  category="ageGroup"
  colors={["#3b82f6", "#10b981"]}
/>
```
**Mapping**: `ProfilingCharts.tsx:30` → r19 Grouped Bar Chart
**Complexity**: Medium
**Data Transform**: Demographic grouping structure

#### 4. Volume Bar Chart
```typescript
// Scout Implementation
<VolumeBarChart data={dailyMetrics} />

// r19 Equivalent
<TimeSeriesBarChart
  data={transformedData}
  timeField="date"
  valueField="volume"
  timeFormat="weekday"
  period="7days"
/>
```
**Mapping**: `TransactionCharts.tsx:20` → r19 Time-Series Bar Chart
**Complexity**: Medium
**Data Transform**: Last 7 days aggregation

### Pie Chart Family

#### 5. Category Pie Chart
```typescript
// Scout Implementation
<CategoryPieChart data={categoryData} />

// r19 Equivalent
<PieChart
  data={transformedData}
  valueField="revenue"
  labelField="name"
  showLabels={true}
  colorScheme="tbwa"
  maxSlices={6}
/>
```
**Mapping**: `ProductCharts.tsx:5` → r19 Pie Chart
**Complexity**: Low
**Data Transform**: Revenue/name structure with 6-slice limit

#### 6. Demographics Pie
```typescript
// Scout Implementation
<DemographicsPie data={ageData} />

// r19 Equivalent
<DonutChart
  data={transformedData}
  valueField="count"
  labelField="range"
  innerRadius={40}
  outerRadius={60}
/>
```
**Mapping**: `ProfilingCharts.tsx:5` → r19 Donut Chart
**Complexity**: Low
**Data Transform**: Age range/count structure

### Line Chart Family

#### 7. Revenue Line Chart
```typescript
// Scout Implementation
<RevenueLineChart data={dailyMetrics} />

// r19 Equivalent
<TimeSeriesLineChart
  data={transformedData}
  xField="date"
  yField="revenue"
  period="30days"
  smooth={true}
  color="#10b981"
  strokeWidth={2}
/>
```
**Mapping**: `TransactionCharts.tsx:45` → r19 Time-Series Line Chart
**Complexity**: Medium
**Data Transform**: 30-day revenue aggregation with date formatting

#### 8. Basket Size Chart
```typescript
// Scout Implementation
<BasketSizeChart data={dailyMetrics} />

// r19 Equivalent
<MultiLineChart
  data={transformedData}
  xField="date"
  lines={[
    { field: "avgBasket", color: "#f59e0b", stroke: 2 },
    { field: "avgValue", color: "#8b5cf6", stroke: 2, dash: true }
  ]}
  period="14days"
/>
```
**Mapping**: `TransactionCharts.tsx:81` → r19 Multi-Line Chart
**Complexity**: High
**Data Transform**: Calculated average basket size + value over 14 days

### Area Chart Family

#### 9. Transaction Area Chart
```typescript
// Scout Implementation
<TransactionAreaChart data={transactionData} />

// r19 Equivalent
<GradientAreaChart
  data={transformedData}
  xField="date"
  yField="transactions"
  gradient={{
    from: "#FFD700",
    to: "#FFD700",
    opacity: [0.8, 0.1]
  }}
  stroke="#FFD700"
  strokeWidth={2}
/>
```
**Mapping**: `AdvancedCharts.tsx:26` → r19 Gradient Area Chart
**Complexity**: Medium
**Data Transform**: TBWA gradient styling preservation

#### 10. Request Methods Chart (Stacked Area)
```typescript
// Scout Implementation
<RequestMethodsChart />

// r19 Equivalent
<StackedAreaChart
  data={transformedData}
  xField="time"
  stackFields={["voice", "visual"]}
  colors={["#1E40AF", "#059669"]}
  fillOpacity={0.8}
/>
```
**Mapping**: `AdvancedCharts.tsx:642` → r19 Stacked Area Chart
**Complexity**: High
**Data Transform**: Voice/visual percentage stacking by time

### Geographic Visualization Family

#### 11. Regional Heatmap
```typescript
// Scout Implementation
<RegionalHeatmap data={regionData} metric="revenue" />

// r19 Equivalent
<GridHeatmap
  data={transformedData}
  rows={4}
  cols={4}
  valueField="metric"
  labelField="name"
  colorScheme="blue"
  cellSize="adaptive"
/>
```
**Mapping**: `RegionalHeatmap.tsx:6` → r19 Grid Heatmap
**Complexity**: Medium
**Data Transform**: 2x2 grid layout with intensity mapping

#### 12. Choropleth Map
```typescript
// Scout Implementation
<ChoroplethMap data={regionData} metric="revenue" />

// r19 Equivalent
<GeographicMap
  data={transformedData}
  geoJson="/geo/philippines-regions.json"
  valueField="value"
  regionField="id"
  colorScale="blues"
  interactive={true}
/>
```
**Mapping**: `ChoroplethMap.tsx:168` → r19 Geographic Map
**Complexity**: Very High
**Data Transform**: Philippines GeoJSON + region value mapping

### KPI Card Family

#### 13. KPI Card
```typescript
// Scout Implementation
<KPICard
  title="Revenue"
  value={2850000}
  change={12.5}
  format="currency"
  icon={<TrendingUp />}
/>

// r19 Equivalent
<MetricCard
  title="Revenue"
  value={2850000}
  change={12.5}
  format="currency"
  trend="up"
  icon="trending-up"
  colorScheme="scout"
/>
```
**Mapping**: `src/charts/KPICard.tsx:12` → r19 Metric Card
**Complexity**: Low
**Data Transform**: Direct property mapping with icon conversion

### Composed Chart Family

#### 14. Pareto Chart
```typescript
// Scout Implementation
<ParetoChart data={paretoData} />

// r19 Equivalent
<ComboChart
  data={transformedData}
  primaryChart={{
    type: "bar",
    field: "revenue",
    color: "#1E40AF"
  }}
  secondaryChart={{
    type: "line",
    field: "cumulative",
    color: "#DC2626",
    strokeWidth: 3
  }}
  referenceLines={[{ y: 80, label: "80% Line" }]}
/>
```
**Mapping**: `AdvancedCharts.tsx:459` → r19 Combo Chart
**Complexity**: Very High
**Data Transform**: 80/20 analysis with cumulative calculation

#### 15. Brand Market Share Chart
```typescript
// Scout Implementation
<BrandMarketShareChart />

// r19 Equivalent
<MultiMetricChart
  data={transformedData}
  metrics={[
    { field: "storeVisits", type: "bar", color: "#FFD700" },
    { field: "conversion", type: "line", color: "#1E40AF" },
    { field: "marketShare", type: "line", color: "#059669", dash: true }
  ]}
  category="brand"
/>
```
**Mapping**: `AdvancedCharts.tsx:933` → r19 Multi-Metric Chart
**Complexity**: Very High
**Data Transform**: Competitive analysis with multiple metrics

### Specialty Chart Family

#### 16. Customer Journey Funnel
```typescript
// Scout Implementation
<CustomerJourneyFunnel data={funnelData} />

// r19 Equivalent
<FunnelChart
  data={transformedData}
  stageField="stage"
  valueField="count"
  direction="vertical"
  colors="tbwa"
  showLabels={true}
  animation={true}
/>
```
**Mapping**: `AdvancedCharts.tsx:146` → r19 Funnel Chart
**Complexity**: Very High
**Data Transform**: Custom SVG funnel to standard funnel component

#### 17. Substitution Chart (Sankey)
```typescript
// Scout Implementation
<SubstitutionChart />

// r19 Equivalent
<FlowDiagram
  data={transformedData}
  source="original"
  target="substitute"
  value="rate"
  nodeWidth={120}
  nodeHeight={25}
  linkOpacity={0.6}
/>
```
**Mapping**: `AdvancedCharts.tsx:497` → r19 Flow Diagram
**Complexity**: Very High
**Data Transform**: Product substitution flow with custom SVG conversion

## Data Transformation Patterns

### Date/Time Formatting
```javascript
// Scout Format
{ date: "2024-01-15", value: 1250 }

// r19 Format
{
  timestamp: "2024-01-15T00:00:00Z",
  formattedDate: "Jan 15",
  value: 1250,
  period: "daily"
}
```

### Color Scheme Preservation
```javascript
// TBWA Color Mapping
const colorMapping = {
  primary: "#FFD700",    // TBWA Yellow
  secondary: "#1E40AF",  // TBWA Blue
  success: "#059669",    // Green
  warning: "#D97706",    // Orange
  error: "#DC2626",      // Red
  purple: "#6B46C1"      // Purple
}
```

### Metric Formatting
```javascript
// Scout Format
{ value: 2850000, format: "currency" }

// r19 Format
{
  rawValue: 2850000,
  formattedValue: "₱2.85M",
  format: "currency",
  locale: "en-PH",
  precision: 2
}
```

## Component Complexity Ratings

| Complexity | Count | Examples | Conversion Effort |
|------------|-------|----------|------------------|
| **Low** | 15 | Basic bars, pies, KPIs | 1-2 days each |
| **Medium** | 20 | Time-series, areas, maps | 3-5 days each |
| **High** | 10 | Multi-line, stacked charts | 1-2 weeks each |
| **Very High** | 5 | Composed, specialty charts | 2-4 weeks each |

## DashMorph Implementation Strategy

### Phase 1: Foundation (Week 1-2)
- Implement basic chart mappings (Low complexity)
- Establish data transformation pipeline
- Create TBWA color scheme preservation
- Build pixel-parity validation framework

### Phase 2: Standard Charts (Week 3-4)
- Implement medium complexity charts
- Add time-series data handling
- Geographic visualization basic support
- Multi-metric chart foundations

### Phase 3: Advanced Features (Week 5-6)
- High complexity composed charts
- Interactive features preservation
- Advanced geographic mapping
- Performance optimization

### Phase 4: Specialty & Testing (Week 7-8)
- Very high complexity specialty charts
- End-to-end conversion pipeline
- Comprehensive testing suite
- Documentation and examples

## Success Criteria

- **Coverage**: 95% of Scout charts successfully mapped
- **Fidelity**: 90%+ visual similarity in converted charts
- **Performance**: <2 seconds conversion time per dashboard
- **Data Integrity**: 100% data accuracy in conversions
- **Brand Consistency**: TBWA color scheme preserved
- **Interactivity**: Key interactive features maintained

This comprehensive mapping enables the DashMorph system to automatically convert Scout Dashboard's sophisticated business intelligence visualizations to r19's standardized components while maintaining visual fidelity and brand consistency.