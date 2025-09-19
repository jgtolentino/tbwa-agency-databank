# Scout Dashboard to r19 Data Visualization Kit Mapping

Comprehensive mapping between Scout Dashboard chart components and corresponding r19 Data Visualization Kit components for DashMorph extraction and conversion.

## Executive Summary

Based on our Scout Dashboard inventory of 50+ chart components and research into the r19 Data Visualization Kit, this document provides a strategic mapping for seamless conversion using DashMorph.

## Chart Type Mappings

### 1. **Bar Charts**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `PurchaseFunnelChart` | Horizontal Bar Chart | Direct mapping - maintains funnel visualization |
| `RequestMethodsBar` | Vertical Bar Chart | Standard vertical bars - preserve color scheme |
| `AgeGenderBar` | Grouped Bar Chart | Multi-series bars for demographic data |
| `VolumeBarChart` | Time-Series Bar Chart | 7-day volume data with date axis |
| `DurationBarChart` | Horizontal Bar Chart | Duration distribution pattern |
| `IncomeDistributionChart` | Vertical Bar Chart | Income bracket visualization |
| `ProductMixPieChart` | Horizontal Bar Chart | Despite name, maps to horizontal bars |
| `BarChart` (generic) | Basic Bar Chart | Core configurable bar chart |
| `SeasonalityChart` | Grouped Bar Chart | Day-of-week patterns |

**DashMorph Config**: Extract Recharts BarChart properties, map to r19 bar chart variants with TBWA color palette preservation.

### 2. **Pie & Donut Charts**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `CategoryPieChart` | Pie Chart | Product category breakdown |
| `DemographicsPie` | Donut Chart | Age group visualization |
| `LocationPie` | Pie Chart | Geographic distribution |
| `UrbanRuralChart` | Donut Chart | Two-category comparison |

**DashMorph Config**: Map Recharts Pie components to r19 pie/donut variants, preserve data labeling and TBWA color scheme.

### 3. **Line Charts**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `RevenueLineChart` | Time-Series Line Chart | 30-day revenue trends |
| `BasketSizeChart` | Multi-Line Chart | Basket size + value trends |
| `TrendChart` | Basic Line Chart | Generic configurable trend |
| `TrendLineChart` | Time-Series Line Chart | Metric-based trends |

**DashMorph Config**: Extract Recharts LineChart properties, map to r19 line chart variants with time-series formatting.

### 4. **Area Charts**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `TransactionAreaChart` | Gradient Area Chart | TBWA-styled with gradient fill |
| `DurationChart` | Stacked Area Chart | Duration + efficiency trends |
| `RequestMethodsChart` | Stacked Area Chart | Voice/visual request patterns |

**DashMorph Config**: Map Recharts Area components to r19 area charts, preserve gradient fills and stacking patterns.

### 5. **Geographic Visualizations**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `RegionalHeatmap` | Grid Heatmap | Simple grid-based visualization |
| `ChoroplethMap` | Geographic Map | Custom SVG Philippines map |
| `MapboxChoroplethMap` | Interactive Map | Mapbox GL integration |
| `MercatorChoroplethMap` | Plotly Map | Scientific visualization |
| `VisxChoroplethMap` | D3 Geographic Map | Advanced custom map |

**DashMorph Config**: Geographic components require special handling - may need custom SVG extraction or map service integration.

### 6. **Combined/Composed Charts**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `RevenueChart` | Area + Line Combo | Multi-metric visualization |
| `ParetoChart` | Bar + Line Combo | 80/20 analysis pattern |
| `BrandMarketShareChart` | Multi-Metric Combo | Competitive analysis |
| `AcceptanceRatesChart` | Bar + Line Combo | Acceptance rate trends |
| `BasketAnalysisChart` | Combo Chart | Market basket analysis |

**DashMorph Config**: Complex composed charts may need decomposition into multiple r19 components or custom hybrid mapping.

### 7. **Specialty Charts**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `CustomerJourneyFunnel` | Funnel Chart | Custom SVG funnel visualization |
| `SubstitutionChart` | Flow Diagram | Sankey-style flow chart |
| `BehaviorTraitsChart` | Enhanced Bar Chart | Horizontal bars with insights panel |

**DashMorph Config**: Specialty charts may require custom component generation or closest r19 approximation.

### 8. **KPI Cards & Indicators**

| Scout Component | r19 Equivalent | Conversion Notes |
|----------------|----------------|------------------|
| `AcceptanceRateBar` | Progress Bar | Percentage indicator |
| `KPICard` | Metric Card | Configurable KPI display |
| `EnhancedKPICard` | Enhanced Metric Card | Scout-styled with icons |

**DashMorph Config**: KPI cards translate to r19 metric card components with trend indicators.

## Design Token Mapping

### Color Palette Translation

| Scout/TBWA Colors | r19 Equivalent | Usage |
|------------------|----------------|-------|
| `#FFD700` (TBWA Yellow) | Primary Color | Main brand accent |
| `#1E40AF` (TBWA Blue) | Secondary Color | Data emphasis |
| `#059669` (Emerald) | Success Color | Positive metrics |
| `#DC2626` (Red) | Error Color | Negative metrics |
| `#D97706` (Orange) | Warning Color | Caution indicators |
| `#6B46C1` (Purple) | Accent Color | Additional data series |

### Typography Mapping

| Scout Typography | r19 Equivalent | Usage |
|-----------------|----------------|-------|
| Chart titles | Heading styles | Large chart labels |
| Axis labels | Body text | Axis and data labels |
| Tooltips | Caption text | Hover information |
| KPI values | Display text | Large metric values |

### Spacing & Layout

| Scout Pattern | r19 Equivalent | Notes |
|--------------|----------------|-------|
| Card-based layout | Container components | Consistent spacing |
| Grid systems | Layout grids | Responsive design |
| Padding/margins | Design tokens | Consistent spacing |

## DashMorph Extraction Configuration

### Component Detection Rules

```yaml
extraction_rules:
  bar_charts:
    detect: "BarChart|Bar component from recharts"
    properties: ["data", "dataKey", "fill", "stroke"]
    mapping: "r19_bar_chart"

  line_charts:
    detect: "LineChart|Line component from recharts"
    properties: ["data", "dataKey", "stroke", "strokeWidth"]
    mapping: "r19_line_chart"

  pie_charts:
    detect: "PieChart|Pie component from recharts"
    properties: ["data", "dataKey", "cx", "cy", "outerRadius"]
    mapping: "r19_pie_chart"

  area_charts:
    detect: "AreaChart|Area component from recharts"
    properties: ["data", "dataKey", "fill", "stroke"]
    mapping: "r19_area_chart"

  composed_charts:
    detect: "ComposedChart component from recharts"
    properties: ["data", "children components"]
    mapping: "r19_combo_chart"

  kpi_cards:
    detect: "KPICard component"
    properties: ["title", "value", "change", "icon"]
    mapping: "r19_metric_card"
```

### Color Scheme Preservation

```yaml
color_mapping:
  preserve_tbwa_palette: true
  primary_colors:
    - "#FFD700"  # TBWA Yellow
    - "#1E40AF"  # TBWA Blue
    - "#059669"  # Success Green
    - "#DC2626"  # Error Red
  fallback_scheme: "r19_default_blue_palette"
```

### Data Structure Mapping

```yaml
data_transformation:
  recharts_to_r19:
    date_fields: ["date", "timestamp", "period"]
    value_fields: ["value", "count", "revenue", "percentage"]
    category_fields: ["name", "category", "label"]
    preserve_structure: true
```

## Implementation Priority

### Phase 1: Core Charts (Week 1)
1. Basic bar charts (5 components)
2. Simple line charts (4 components)
3. Pie/donut charts (4 components)
4. KPI cards (3 components)

### Phase 2: Advanced Charts (Week 2)
1. Area charts (3 components)
2. Combined charts (5 components)
3. Time-series charts (4 components)

### Phase 3: Specialty Visualizations (Week 3)
1. Geographic maps (5 components)
2. Custom specialty charts (3 components)
3. Advanced composed charts (3 components)

### Phase 4: Integration & Testing (Week 4)
1. End-to-end DashMorph pipeline
2. Pixel-parity validation
3. Performance optimization
4. Documentation completion

## Success Metrics

- **Coverage**: 95% of Scout charts mapped to r19 equivalents
- **Fidelity**: 90%+ visual similarity maintained
- **Performance**: <500ms conversion time per chart
- **Usability**: One-click conversion via DashMorph CLI

## Next Steps

1. **Complete r19 Kit Analysis**: Access actual Figma file for precise component mapping
2. **Build DashMorph Config**: Implement extraction rules based on this mapping
3. **Create Conversion Pipeline**: Automate Scout → r19 transformation
4. **Validate Pixel Parity**: Ensure visual fidelity in converted charts
5. **Generate Code Output**: Produce r19-compatible React components

This mapping provides the foundation for seamless dashboard migration from Scout's custom implementation to r19's standardized visualization components while preserving TBWA's brand identity and data visualization requirements.