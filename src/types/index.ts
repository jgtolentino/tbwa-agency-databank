// Chart Types
export type ChartType = 
  | 'bar' 
  | 'stackedBar' 
  | 'line' 
  | 'area' 
  | 'donut' 
  | 'heatmap' 
  | 'choropleth'
  | 'kpi';

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  data: any;
  options?: any;
  exportable?: boolean;
}

// Dashboard Types
export interface DashboardLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  static?: boolean;
}

export interface DashboardPage {
  id: string;
  name: string;
  icon: string;
  layouts: DashboardLayout[];
  charts: ChartConfig[];
}

// Filter Types
export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  id: string;
  type: 'date' | 'select' | 'multi-select' | 'search';
  label: string;
  options?: FilterOption[];
  value?: any;
  dependencies?: string[];
}

export interface GlobalFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  region: string | null;
  city: string | null;
  barangay: string | null;
  category: string | null;
  brand: string | null;
  sku: string | null;
}

// Data Types
export interface SalesData {
  id: string;
  date: string;
  region: string;
  city: string;
  barangay: string;
  category: string;
  brand: string;
  sku: string;
  sales: number;
  units: number;
  price: number;
}

export interface ConsumerData {
  id: string;
  age_group: string;
  gender: string;
  income_level: string;
  region: string;
  purchase_frequency: number;
  average_basket_size: number;
  preferred_categories: string[];
}

// Assistant Types
export interface AssistantQuery {
  id: string;
  query: string;
  sql?: string;
  result?: any;
  timestamp: Date;
}

// State Types
export interface DashboardState {
  currentPage: string;
  layouts: Record<string, DashboardLayout[]>;
  charts: Record<string, ChartConfig[]>;
  globalFilters: GlobalFilters;
  isLoading: boolean;
  error: string | null;
}
