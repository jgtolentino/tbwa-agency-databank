// Type definitions for Databank components

export interface TransactionData {
  date: string;
  volume: number;
  revenue: number;
  basketSize: number;
  duration: number;
}

export interface CategoryData {
  name: string;
  value: number;
  fill: string;
}

export interface FunnelData {
  name: string;
  value: number;
  fill: string;
}

export interface ConsumerProfile {
  totalCustomers: number;
  avgAge: number;
  genderSplit: {
    male: number;
    female: number;
  };
  incomeDistribution: {
    high: number;
    middle: number;
    low: number;
  };
  urbanRural: {
    urban: number;
    rural: number;
  };
}

export interface FilterOptions {
  dateRange: Array<{
    value: string;
    label: string;
  }>;
  locations: Array<{
    value: string;
    label: string;
  }>;
  categories: Array<{
    value: string;
    label: string;
  }>;
  brands: Array<{
    value: string;
    label: string;
  }>;
}

export interface DashboardMetrics {
  dailyVolume: {
    current: number;
    trend: {
      value: number;
      direction: 'up' | 'down';
    };
  };
  dailyRevenue: {
    current: number;
    trend: {
      value: number;
      direction: 'up' | 'down';
    };
  };
  conversionRate: number;
  suggestionAcceptance: number;
  brandLoyalty: number;
  totalSKUs: number;
  activeSKUs: number;
  newSKUs: number;
}

export interface ComparativeMetrics {
  periodGrowth: number;
  forecastAccuracy: number;
  marketShare: number;
}

export interface ChartProps {
  data?: any[];
  width?: number;
  height?: number;
  className?: string;
}

export interface InsightCard {
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  content: string;
  icon?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  filename?: string;
  includeCharts?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface DatabankApiData {
  transactions: TransactionData[];
  categories: CategoryData[];
  funnelData: FunnelData[];
  consumerProfile: ConsumerProfile;
  metrics: DashboardMetrics;
  comparative: ComparativeMetrics;
}

// Component state types
export interface ChartTabState {
  activeTab: string;
  availableTabs: string[];
}

export interface FilterState {
  dateRange: string;
  location: string;
  category: string;
  brand: string;
}

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// Event handler types
export type FilterChangeHandler = (filters: FilterState) => void;
export type ExportHandler = (options: ExportOptions) => void;
export type RefreshHandler = () => Promise<void>;
export type TabChangeHandler = (tab: string) => void;