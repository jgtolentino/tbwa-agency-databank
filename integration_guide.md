# Scout Dashboard → Amazon Integration Guide

## Overview

This guide provides step-by-step instructions for integrating Scout dashboard components into your Amazon-styled dashboard without duplication, maintaining superior UX and design consistency.

## File Structure

```
your-amazon-dashboard/
├── components/
│   ├── charts/
│   │   ├── AmazonAreaChart.tsx
│   │   ├── AmazonPieChart.tsx
│   │   ├── AmazonFunnelChart.tsx
│   │   └── index.ts
│   ├── ui/
│   │   ├── AmazonKPICard.tsx
│   │   ├── AmazonTabs.tsx
│   │   ├── AmazonFilter.tsx
│   │   ├── AmazonExportButton.tsx
│   │   └── index.ts
│   └── dashboard/
│       ├── ScoutAnalytics.tsx
│       └── index.ts
├── utils/
│   ├── dashboard-utilities.ts
│   ├── chart-configs.ts
│   └── index.ts
├── hooks/
│   ├── useFilters.ts
│   ├── useDataLoading.ts
│   └── index.ts
├── types/
│   └── dashboard.ts
└── styles/
    └── amazon-theme.css
```

## Step 1: Install Dependencies

```bash
npm install recharts lucide-react
# or
yarn add recharts lucide-react

# For TypeScript support
npm install -D @types/react @types/node
```

## Step 2: Create Type Definitions

Create `types/dashboard.ts`:

```typescript
export interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
}

export interface ChartDataPoint {
  date?: string;
  name?: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface DashboardFilters {
  dateRange: string;
  location: string;
  category: string;
  brand: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  filename: string;
  includeCharts: boolean;
}

export type TrendDirection = 'up' | 'down' | 'neutral';
export type ChartType = 'area' | 'pie' | 'funnel' | 'bar';
```

## Step 3: Amazon Theme Configuration

Create `styles/amazon-theme.css`:

```css
:root {
  /* Amazon Color Variables */
  --amazon-primary: #FF9900;
  --amazon-secondary: #146EB4;
  --amazon-success: #00A651;
  --amazon-warning: #FF9900;
  --amazon-danger: #E01E5A;
  --amazon-info: #0073E6;
  --amazon-purple: #8B5CF6;
  --amazon-pink: #EC4899;
  --amazon-light-blue: #93BBFC;
  
  /* Gray Scale */
  --amazon-gray-50: #F9F9F9;
  --amazon-gray-100: #E5E5E5;
  --amazon-gray-200: #CCCCCC;
  --amazon-gray-300: #999999;
  --amazon-gray-400: #666666;
  --amazon-gray-500: #333333;
  --amazon-gray-600: #1A1A1A;
  --amazon-gray-900: #000000;
  
  /* Typography */
  --amazon-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  
  /* Spacing */
  --amazon-spacing-xs: 0.25rem;
  --amazon-spacing-sm: 0.5rem;
  --amazon-spacing-md: 1rem;
  --amazon-spacing-lg: 1.5rem;
  --amazon-spacing-xl: 2rem;
  
  /* Border Radius */
  --amazon-radius-sm: 0.375rem;
  --amazon-radius-md: 0.5rem;
  --amazon-radius-lg: 0.75rem;
  
  /* Shadows */
  --amazon-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --amazon-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --amazon-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Amazon-styled components */
.amazon-card {
  background: white;
  border: 1px solid var(--amazon-gray-200);
  border-radius: var(--amazon-radius-lg);
  box-shadow: var(--amazon-shadow-sm);
  transition: box-shadow 0.2s ease-in-out;
}

.amazon-card:hover {
  box-shadow: var(--amazon-shadow-md);
}

.amazon-button-primary {
  background-color: var(--amazon-primary);
  color: white;
  border: none;
  border-radius: var(--amazon-radius-md);
  padding: var(--amazon-spacing-sm) var(--amazon-spacing-md);
  font-weight: 500;
  font-size: 0.875rem;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;
}

.amazon-button-primary:hover {
  background-color: #E6880A;
}

.amazon-tab-active {
  border-bottom: 2px solid var(--amazon-primary);
  color: var(--amazon-primary);
}

.amazon-tab-inactive {
  border-bottom: 2px solid transparent;
  color: var(--amazon-gray-400);
}

.amazon-tab-inactive:hover {
  color: var(--amazon-secondary);
}
```

## Step 4: Create Reusable Chart Components

### AmazonAreaChart.tsx

```typescript
import React from 'react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartDataPoint } from '../types/dashboard';
import { chartConfigs, colorUtils } from '../utils/dashboard-utilities';

interface AmazonAreaChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  title: string;
  color?: string;
  showGrid?: boolean;
  height?: number;
}

export const AmazonAreaChart: React.FC<AmazonAreaChartProps> = ({
  data,
  dataKey,
  title,
  color = colorUtils.amazon.secondary,
  showGrid = true,
  height = 256
}) => {
  return (
    <div className="amazon-card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer {...chartConfigs.responsive}>
          <AreaChart data={data}>
            {showGrid && <CartesianGrid {...chartConfigs.areaChart.grid} />}
            <XAxis dataKey="date" stroke={colorUtils.amazon.gray[400]} fontSize={12} />
            <YAxis stroke={colorUtils.amazon.gray[400]} fontSize={12} />
            <Tooltip {...chartConfigs.areaChart.tooltip} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              {...chartConfigs.areaChart.area}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

## Step 5: Integration with Existing Amazon Dashboard

### Method 1: Direct Component Integration

```typescript
// In your existing Amazon dashboard component
import { AmazonAreaChart, AmazonPieChart, AmazonKPICard } from './components/charts';
import { scoutDashboardData } from './data/scout-data';

const YourAmazonDashboard: React.FC = () => {
  return (
    <div className="amazon-dashboard">
      {/* Your existing Amazon components */}
      
      {/* Integrated Scout Analytics Section */}
      <section className="scout-analytics-section mt-8">
        <h2 className="text-2xl font-bold mb-6">Scout Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmazonAreaChart
            data={scoutDashboardData.transactionTrends}
            dataKey="volume"
            title="Transaction Volume"
          />
          
          <AmazonPieChart
            data={scoutDashboardData.productMix}
            title="Product Mix"
          />
        </div>
      </section>
    </div>
  );
};
```

### Method 2: Tab-based Integration

```typescript
const DashboardWithTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scout-analytics', label: 'Scout Analytics' },
    { id: 'performance', label: 'Performance' }
  ];

  return (
    <div>
      <AmazonTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {activeTab === 'scout-analytics' && (
        <ScoutAnalyticsDashboard />
      )}
      
      {/* Other tab content */}
    </div>
  );
};
```

## Step 6: Data Integration

### Create Data Adapters

```typescript
// utils/data-adapters.ts
export const adaptScoutData = (rawData: any) => {
  return {
    kpis: rawData.metrics?.map(metric => ({
      label: metric.name,
      value: formatters.number(metric.value),
      change: metric.change,
      trend: metric.change > 0 ? 'up' : metric.change < 0 ? 'down' : 'neutral'
    })) || [],
    
    transactionTrends: rawData.transactions?.map(t => ({
      date: t.timestamp,
      volume: t.volume,
      revenue: t.revenue
    })) || [],
    
    productMix: rawData.products?.map((p, index) => ({
      name: p.category,
      value: p.percentage,
      color: colorUtils.amazon[Object.keys(colorUtils.amazon)[index]]
    })) || []
  };
};
```

## Step 7: State Management Integration

### Using Context API

```typescript
// contexts/DashboardContext.tsx
export const DashboardContext = createContext<{
  scoutData: any;
  amazonData: any;
  filters: DashboardFilters;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
}>({
  scoutData: null,
  amazonData: null,
  filters: initialFilters,
  updateFilters: () => {}
});

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scoutData, setScoutData] = useState(null);
  const [amazonData, setAmazonData] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const updateFilters = (newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <DashboardContext.Provider value={{ scoutData, amazonData, filters, updateFilters }}>
      {children}
    </DashboardContext.Provider>
  );
};
```

## Step 8: Performance Optimizations

### Lazy Loading Components

```typescript
import { lazy, Suspense } from 'react';

const LazyScoutAnalytics = lazy(() => import('./components/dashboard/ScoutAnalytics'));

const Dashboard = () => {
  return (
    <Suspense fallback={<div>Loading Scout Analytics...</div>}>
      <LazyScoutAnalytics />
    </Suspense>
  );
};
```

### Memoization

```typescript
import { memo, useMemo } from 'react';

const MemoizedAreaChart = memo(AmazonAreaChart);

const OptimizedDashboard = () => {
  const processedData = useMemo(() => {
    return adaptScoutData(rawData);
  }, [rawData]);

  return (
    <MemoizedAreaChart 
      data={processedData.transactionTrends}
      dataKey="volume"
      title="Transactions"
    />
  );
};
```

## Step 9: Testing Integration

### Unit Tests

```typescript
// __tests__/AmazonAreaChart.test.tsx
import { render, screen } from '@testing-library/react';
import { AmazonAreaChart } from '../components/charts/AmazonAreaChart';

const mockData = [
  { date: '2025-01-01', volume: 100 },
  { date: '2025-01-02', volume: 150 }
];

test('renders area chart with title', () => {
  render(
    <AmazonAreaChart 
      data={mockData} 
      dataKey="volume" 
      title="Test Chart" 
    />
  );
  
  expect(screen.getByText('Test Chart')).toBeInTheDocument();
});
```

### Integration Tests

```typescript
// __tests__/DashboardIntegration.test.tsx
test('scout analytics integrates with amazon dashboard', async () => {
  render(<DashboardWithScoutAnalytics />);
  
  // Test that both Amazon and Scout components render
  expect(screen.getByText('Amazon Overview')).toBeInTheDocument();
  expect(screen.getByText('Scout Analytics')).toBeInTheDocument();
  
  // Test tab switching
  fireEvent.click(screen.getByText('Scout Analytics'));
  await waitFor(() => {
    expect(screen.getByText('Transaction Volume')).toBeInTheDocument();
  });
});
```

## Step 10: Deployment Considerations

### Bundle Optimization

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        charts: {
          test: /[\\/]node_modules[\\/](recharts)[\\/]/,
          name: 'charts',
          chunks: 'all',
        },
        scout: {
          test: /[\\/]components[\\/](scout|charts)[\\/]/,
          name: 'scout-analytics',
          chunks: 'all',
        }
      }
    }
  }
};
```

### Environment Variables

```typescript
// config/dashboard.ts
export const dashboardConfig = {
  scout: {
    apiUrl: process.env.NEXT_PUBLIC_SCOUT_API_URL,
    refreshInterval: parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL || '30000'),
    features: {
      exportPdf: process.env.NEXT_PUBLIC_ENABLE_PDF_EXPORT === 'true',
      realTimeUpdates: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME === 'true'
    }
  },
  amazon: {
    theme: process.env.NEXT_PUBLIC_AMAZON_THEME || 'default'
  }
};
```

## Migration Checklist

- [ ] Install required dependencies
- [ ] Create type definitions
- [ ] Set up Amazon theme CSS
- [ ] Extract Scout chart components
- [ ] Create reusable UI components
- [ ] Set up data adapters
- [ ] Implement state management
- [ ] Add performance optimizations
- [ ] Write tests
- [ ] Configure build optimization
- [ ] Deploy and monitor

## Troubleshooting

### Common Issues

1. **Chart not rendering**: Check data format matches expected structure
2. **Styling conflicts**: Ensure CSS specificity and use CSS modules if needed
3. **Performance issues**: Implement memoization and lazy loading
4. **Type errors**: Verify all interfaces match component props

### Debug Tools

```typescript
// utils/debug.ts
export const debugComponent = (componentName: string, props: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${componentName}] Props:`, props);
  }
};

// Usage in components
debugComponent('AmazonAreaChart', { data, dataKey, title });
```

## Best Practices

1. **Component Isolation**: Keep Scout components separate but styled consistently
2. **Data Normalization**: Use adapters to transform data into consistent formats
3. **Error Boundaries**: Wrap chart components in error boundaries
4. **Loading States**: Provide loading indicators for async data
5. **Accessibility**: Ensure all components are keyboard navigable and screen reader friendly
6. **Performance**: Use React.memo and useMemo for expensive operations
7. **Testing**: Write comprehensive tests for critical paths
8. **Documentation**: Maintain clear documentation for component APIs

This integration approach ensures that Scout dashboard components blend seamlessly with your Amazon-styled dashboard while maintaining code quality, performance, and user experience standards.