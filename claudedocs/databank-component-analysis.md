# Scout Analytics Databank Page - Component Analysis

## Overview
This document provides a comprehensive analysis of the Scout Analytics Databank page components extracted from https://scout-analytics-nextjs.vercel.app/databank

**Extraction Date:** September 15, 2025  
**Page Title:** Scout Analytics Dashboard - TBWA AI Platform  
**Framework:** Next.js with React and Recharts

## Page Structure

### 1. Main Layout
```
<div className="min-h-screen bg-gray-50">
  ├── Header Section
  ├── Filter Controls
  └── Dashboard Grid
      ├── Transaction Trends Chart
      ├── Product Mix & SKU Analytics Chart  
      ├── Consumer Behavior & Preferences Chart
      ├── Consumer Profiling Chart
      └── Comparative Analytics
</div>
```

## Component Hierarchy

### 1. Header Component
**Location:** Top of page  
**Structure:**
```jsx
<div className="bg-white border-b border-gray-200">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between py-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Scout Databank Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Executive Analytics & Insights Platform</p>
      </div>
      <div className="flex items-center gap-4">
        <RefreshButton />
        <ExportDropdown />
      </div>
    </div>
  </div>
</div>
```

**Key Elements:**
- Main title: "Scout Databank Dashboard"
- Subtitle: "Executive Analytics & Insights Platform"
- Refresh button with refresh icon
- Export dropdown with PDF and Excel options

### 2. Filter Controls Component
**Location:** Sticky below header  
**Structure:**
```jsx
<div className="bg-white border-b border-gray-200 sticky top-0 z-10">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex flex-wrap items-center gap-4">
      <DateRangeFilter />
      <LocationFilter />
      <CategoryFilter />
      <BrandFilter />
    </div>
  </div>
</div>
```

**Filter Options:**
1. **Date Range Filter:**
   - Today, Last 7 Days, Last 30 Days, Last 90 Days, Custom Range
   
2. **Location Filter:**
   - All Locations, Metro Manila, Luzon, Visayas, Mindanao
   
3. **Category Filter:**
   - All Categories, Beverages, Snacks, Personal Care, Household
   
4. **Brand Filter:**
   - All Brands, Brand A, Brand B, Brand C, Unbranded

**Common Filter Classes:**
```css
.block.w-40.rounded-md.border-gray-300.text-sm.focus:border-blue-500.focus:ring-blue-500
```

### 3. Chart Components

#### 3.1 Transaction Trends Chart
**Chart Type:** Recharts Area Chart  
**Container:** `recharts-responsive-container`  
**Dimensions:** 546x256px  
**Card Classes:** `bg-white rounded-lg shadow-sm border border-gray-200 p-6`

**Features:**
- Daily Volume: 506 (with -43.6% trend)
- Daily Revenue: ₱173,695 (with +25.7% trend)
- Tab navigation: Volume, Revenue, Basket Size, Duration
- Compare with previous period checkbox
- Area chart with blue gradient fill (#3B82F6, #93BBFC)

**Metric Cards:**
```jsx
<div className="bg-gray-50 rounded-lg p-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">Daily Volume</p>
      <p className="text-2xl font-bold text-gray-900">506</p>
    </div>
    <TrendIndicator direction="down" percentage="43.6%" />
  </div>
</div>
```

#### 3.2 Product Mix & SKU Analytics Chart
**Chart Type:** Recharts Pie Chart  
**Container:** `recharts-responsive-container`  
**Dimensions:** 546x256px

**Data Segments:**
- Beverages: 35% (#3B82F6)
- Snacks: 25% (#10B981)
- Personal Care: 20% (#F59E0B)
- Household: 15% (#EF4444)
- Others: 5% (#8B5CF6)

**Metrics:**
- Total SKUs: 369
- Active SKUs: 342 (green)
- New SKUs: 12 (blue)

**Tab Navigation:**
- Category Mix (active)
- Pareto Analysis
- Substitutions
- Basket Analysis

**Insight Box:**
```jsx
<div className="bg-blue-50 rounded-lg p-3">
  <div className="flex items-start gap-2">
    <TrendingUpIcon className="h-4 w-4 text-blue-600 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-blue-900">Key Insight</p>
      <p className="text-sm text-blue-700">Top 20% of SKUs generate 80% of revenue...</p>
    </div>
  </div>
</div>
```

#### 3.3 Consumer Behavior & Preferences Chart
**Chart Type:** Recharts Funnel Chart  
**Container:** `recharts-responsive-container`  
**Dimensions:** 546x256px

**Funnel Steps:**
1. Store Visit: 1000 (#3B82F6)
2. Product Browse: 850 (#10B981)
3. Brand Request: 650 (#F59E0B)
4. Accept Suggestion: 480 (#8B5CF6)
5. Purchase: 420 (#EC4899)

**Metrics:**
- Conversion Rate: 42%
- Suggestion Accept: 73.8% (green)
- Brand Loyalty: 68% (blue)

**Tab Navigation:**
- Purchase Funnel (active)
- Request Methods
- Acceptance Rates
- Behavior Traits

#### 3.4 Consumer Profiling Component
**Not a chart - Custom layout**

**Demographics Display:**
- Total Customers: 11,000
- Avg Age: 32.5 (blue)
- Gender Split: 48/52 (purple)

**Income Distribution (Progress Bars):**
- High Income: 25%
- Middle Income: 58%
- Low Income: 17%

**Urban vs Rural (Donut Visual):**
- Urban: 71%
- Rural: 29%

### 4. Button Components

#### 4.1 Action Buttons
```jsx
// Refresh Button
<button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
  <RefreshIcon className="h-4 w-4" />
  Refresh
</button>

// Export Button
<button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  <DownloadIcon className="h-4 w-4" />
  Export Report
</button>
```

#### 4.2 Tab Buttons
```jsx
// Active Tab
<button className="px-3 py-2 text-sm font-medium border-b-2 transition-colors border-blue-600 text-blue-600">
  Volume
</button>

// Inactive Tab
<button className="px-3 py-2 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700">
  Revenue
</button>
```

### 5. Insight Components

#### Insight Card Structure
```jsx
<div className="bg-{color}-50 rounded-lg p-3">
  <div className="flex items-start gap-2">
    <Icon className="h-4 w-4 text-{color}-600 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-{color}-900">{title}</p>
      <p className="text-sm text-{color}-700">{content}</p>
    </div>
  </div>
</div>
```

**Color Variants:**
- Blue: `bg-blue-50`, `text-blue-600`, `text-blue-900`
- Green: `bg-green-50`, `text-green-600`, `text-green-900`
- Purple: `bg-purple-50`, `text-purple-600`, `text-purple-900`

### 6. Comparative Analytics Section
**Location:** Bottom of page  
**Layout:** 3-column grid

**Metrics:**
- Period-over-Period Growth: +12.5% (green)
- Forecast Accuracy: 94.2% (blue)
- Market Share: 28.7% (purple)

## Technical Implementation Details

### Recharts Configuration
All charts use the `recharts-responsive-container` wrapper with:
- Width: 100%
- Height: 100%
- Min-width: 0px

**Chart SVG Properties:**
- Width: 546px
- Height: 256px
- ViewBox: "0 0 546 256"

### Icon Library
Uses **Lucide Icons** throughout:
- `refresh-cw` (Refresh button)
- `download` (Export buttons)
- `file-text` (PDF export)
- `file-spreadsheet` (Excel export)
- `calendar` (Date filter)
- `map-pin` (Location filter)
- `package` (Category filter)
- `tag` (Brand filter)
- `trending-up`/`trending-down` (Trend indicators)
- `funnel` (Chart options)

### Color Scheme
**Primary Colors:**
- Blue: `#3B82F6` (Primary actions, charts)
- Green: `#10B981` (Positive metrics, success states)
- Red: `#EF4444` (Negative trends)
- Purple: `#8B5CF6` (Secondary metrics)
- Orange: `#F59E0B` (Warning/neutral states)

**Background Colors:**
- Main background: `bg-gray-50`
- Card background: `bg-white`
- Metric cards: `bg-gray-50`
- Insight cards: `bg-{color}-50`

### Responsive Design
Uses Tailwind CSS responsive utilities:
- `sm:px-6` (640px+)
- `lg:px-8` (1024px+)
- `max-w-7xl` (1280px max container)

## Data Structure Patterns

### Chart Data Format
```javascript
// Area Chart Data
const transactionData = [
  { date: '2025-08-19', volume: 450, revenue: 150000 },
  { date: '2025-08-20', volume: 380, revenue: 145000 },
  // ...
];

// Pie Chart Data
const categoryMixData = [
  { name: 'Beverages', value: 35, fill: '#3B82F6' },
  { name: 'Snacks', value: 25, fill: '#10B981' },
  { name: 'Personal Care', value: 20, fill: '#F59E0B' },
  // ...
];

// Funnel Chart Data
const funnelData = [
  { name: 'Store Visit', value: 1000, fill: '#3B82F6' },
  { name: 'Product Browse', value: 850, fill: '#10B981' },
  // ...
];
```

### Filter State Management
```javascript
const [filters, setFilters] = useState({
  dateRange: 'today',
  location: 'all',
  category: 'all',
  brand: 'all'
});
```

This comprehensive analysis provides all the necessary information to recreate the databank page components in your Amazon-styled dashboard.