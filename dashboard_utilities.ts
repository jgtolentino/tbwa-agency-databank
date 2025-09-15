// Dashboard Utilities and Helper Functions
// Based on Scout Dashboard Analysis for Amazon Integration

// Number Formatting Utilities
export const formatters = {
  // Currency formatting (Philippine Peso)
  currency: (value: number, currency: string = 'PHP'): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },

  // Large number formatting with K/M suffixes
  number: (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  },

  // Percentage formatting
  percentage: (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
  },

  // Compact number with commas
  compact: (value: number): string => {
    return value.toLocaleString();
  },

  // Date formatting
  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  },

  // Time formatting for duration
  duration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
};

// Color Utilities
export const colorUtils = {
  // Amazon Color Palette
  amazon: {
    primary: '#FF9900',      // Amazon Orange
    secondary: '#146EB4',    // Amazon Blue
    success: '#00A651',      // Green
    warning: '#FF9900',      // Orange
    danger: '#E01E5A',       // Red
    info: '#0073E6',         // Blue
    purple: '#8B5CF6',       // Purple
    pink: '#EC4899',         // Pink
    lightBlue: '#93BBFC',    // Light Blue
    gray: {
      50: '#F9F9F9',
      100: '#E5E5E5',
      200: '#CCCCCC',
      300: '#999999',
      400: '#666666',
      500: '#333333',
      600: '#1A1A1A',
      900: '#000000'
    }
  },

  // Get trend color based on change value
  getTrendColor: (change: number): string => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  },

  // Get background trend color
  getTrendBg: (change: number): string => {
    if (change > 0) return 'bg-green-50';
    if (change < 0) return 'bg-red-50';
    return 'bg-gray-50';
  },

  // Generate gradient colors for charts
  generateGradient: (baseColor: string, steps: number): string[] => {
    const colors = [];
    for (let i = 0; i < steps; i++) {
      const opacity = 1 - (i * 0.15);
      colors.push(`${baseColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
    }
    return colors;
  }
};

// Chart Configuration Utilities
export const chartConfigs = {
  // Default responsive container props
  responsive: {
    width: '100%',
    height: '100%',
  },

  // Area chart configuration
  areaChart: {
    grid: {
      strokeDasharray: '3 3',
      stroke: '#E5E5E5'
    },
    area: {
      strokeWidth: 2,
      fillOpacity: 0.1
    },
    tooltip: {
      contentStyle: {
        backgroundColor: 'white',
        border: '1px solid #E5E5E5',
        borderRadius: '6px',
        fontSize: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }
  },

  // Pie chart configuration
  pieChart: {
    pie: {
      cx: '50%',
      cy: '50%',
      outerRadius: 80,
      stroke: '#fff',
      strokeWidth: 2
    },
    label: {
      position: 'outside' as const,
      fill: '#333333',
      fontSize: 12
    }
  },

  // Funnel chart configuration
  funnelChart: {
    funnel: {
      stroke: '#fff',
      strokeWidth: 2,
      isAnimationActive: true
    },
    label: {
      position: 'center' as const,
      fill: '#fff',
      fontSize: 14,
      fontWeight: 'bold'
    }
  },

  // Bar chart configuration
  barChart: {
    bar: {
      radius: [4, 4, 0, 0] as [number, number, number, number]
    },
    grid: {
      strokeDasharray: '3 3',
      stroke: '#E5E5E5'
    }
  }
};

// Data Processing Utilities
export const dataUtils = {
  // Calculate percentage change
  calculateChange: (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  },

  // Calculate conversion rate between funnel steps
  calculateConversion: (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return (current / previous) * 100;
  },

  // Aggregate data by time period
  aggregateByPeriod: (
    data: any[], 
    dateKey: string, 
    valueKey: string, 
    period: 'day' | 'week' | 'month'
  ): any[] => {
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item[dateKey]);
      let key: string;

      switch (period) {
        case 'week':
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          key = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!acc[key]) {
        acc[key] = { date: key, [valueKey]: 0, count: 0 };
      }
      acc[key][valueKey] += item[valueKey];
      acc[key].count += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  },

  // Sort data by value
  sortByValue: (data: any[], valueKey: string, ascending: boolean = false): any[] => {
    return [...data].sort((a, b) => {
      const aVal = a[valueKey];
      const bVal = b[valueKey];
      return ascending ? aVal - bVal : bVal - aVal;
    });
  },

  // Generate time series data
  generateTimeSeriesData: (
    startDate: string,
    endDate: string,
    valueRange: [number, number]
  ): Array<{ date: string; value: number }> => {
    const data = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const [minVal, maxVal] = valueRange;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      data.push({
        date: d.toISOString().split('T')[0],
        value: Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
      });
    }

    return data;
  }
};

// Filter Utilities
export const filterUtils = {
  // Date range filters
  dateRanges: {
    today: () => {
      const today = new Date();
      return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    },
    last7days: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      };
    },
    last30days: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      };
    },
    last90days: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 90);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0]
      };
    }
  },

  // Apply filters to data
  applyFilters: (
    data: any[],
    filters: {
      dateRange?: { start: string; end: string };
      location?: string;
      category?: string;
      brand?: string;
    }
  ): any[] => {
    let filtered = [...data];

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date || item.timestamp);
        const start = new Date(filters.dateRange!.start);
        const end = new Date(filters.dateRange!.end);
        return itemDate >= start && itemDate <= end;
      });
    }

    // Apply location filter
    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(item => 
        item.location === filters.location
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(item => 
        item.category === filters.category
      );
    }

    // Apply brand filter
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(item => 
        item.brand === filters.brand
      );
    }

    return filtered;
  }
};

// Export Utilities
export const exportUtils = {
  // Export data to CSV
  exportToCSV: (data: any[], filename: string = 'export.csv'): void => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  },

  // Export chart as image (requires html2canvas)
  exportChartAsImage: async (
    elementId: string, 
    filename: string = 'chart.png'
  ): Promise<void> => {
    try {
      // This would require html2canvas library
      // const html2canvas = await import('html2canvas');
      // const element = document.getElementById(elementId);
      // if (!element) return;
      
      // const canvas = await html2canvas.default(element);
      // const link = document.createElement('a');
      // link.download = filename;
      // link.href = canvas.toDataURL();
      // link.click();
      
      console.log('Export chart functionality requires html2canvas library');
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
  }
};

// Validation Utilities
export const validationUtils = {
  // Validate required fields in data
  validateDataStructure: (data: any[], requiredFields: string[]): boolean => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    return requiredFields.every(field => 
      data.every(item => item.hasOwnProperty(field))
    );
  },

  // Validate date range
  validateDateRange: (start: string, end: string): boolean => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate <= endDate && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
  },

  // Validate numeric values
  validateNumericValue: (value: any): boolean => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  }
};

// Performance Utilities
export const performanceUtils = {
  // Debounce function for filter inputs
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  },

  // Throttle function for scroll events
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(null, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Memoization for expensive calculations
  memoize: <T extends (...args: any[]) => any>(func: T): T => {
    const cache = new Map();
    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func.apply(null, args);
      cache.set(key, result);
      return result;
    }) as T;
  }
};

// Custom Hooks for Dashboard State Management
export const dashboardHooks = {
  // Filter state management
  useFilters: (initialFilters: any = {}) => {
    const [filters, setFilters] = React.useState(initialFilters);
    
    const updateFilter = (key: string, value: any) => {
      setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
      setFilters(initialFilters);
    };

    return { filters, updateFilter, resetFilters };
  },

  // Data loading state management
  useDataLoading: (initialData: any = null) => {
    const [data, setData] = React.useState(initialData);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const loadData = async (fetchFunction: () => Promise<any>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    return { data, loading, error, loadData, setData };
  }
};

// Export all utilities as default
export default {
  formatters,
  colorUtils,
  chartConfigs,
  dataUtils,
  filterUtils,
  exportUtils,
  validationUtils,
  performanceUtils,
  dashboardHooks
};