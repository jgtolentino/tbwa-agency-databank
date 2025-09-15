// Utility functions for the Databank components

export const formatCurrency = (value: number, locale = 'en-PH', currency = 'PHP'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale).format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const calculateTrend = (current: number, previous: number) => {
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(change),
    direction: change >= 0 ? 'up' : 'down' as const,
    isPositive: change >= 0
  };
};

export const calculateConversionRate = (converted: number, total: number): number => {
  return (converted / total) * 100;
};

export const generateColorPalette = (): string[] => {
  return [
    '#3B82F6', // Blue
    '#10B981', // Green  
    '#F59E0B', // Orange
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange (alt)
    '#EC4899', // Pink
    '#6366F1'  // Indigo
  ];
};

export const getInsightVariant = (type: 'success' | 'info' | 'warning' | 'error') => {
  const variants = {
    success: {
      background: 'bg-green-50',
      text: 'text-green-700',
      title: 'text-green-900',
      icon: 'text-green-600'
    },
    info: {
      background: 'bg-blue-50',
      text: 'text-blue-700',
      title: 'text-blue-900',
      icon: 'text-blue-600'
    },
    warning: {
      background: 'bg-yellow-50',
      text: 'text-yellow-700',
      title: 'text-yellow-900',
      icon: 'text-yellow-600'
    },
    error: {
      background: 'bg-red-50',
      text: 'text-red-700',
      title: 'text-red-900',
      icon: 'text-red-600'
    }
  };

  return variants[type];
};

export const exportToCSV = (data: any[], filename: string): void => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        typeof row[header] === 'string' && row[header].includes(',') 
          ? `"${row[header]}"` 
          : row[header]
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Data transformation utilities
export const aggregateByPeriod = (
  data: Array<{ date: string; [key: string]: any }>,
  period: 'day' | 'week' | 'month'
) => {
  // Implementation would depend on specific aggregation needs
  return data; // Placeholder
};

export const filterDataByDateRange = (
  data: Array<{ date: string; [key: string]: any }>,
  startDate: string,
  endDate: string
) => {
  return data.filter(item => {
    const itemDate = new Date(item.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return itemDate >= start && itemDate <= end;
  });
};

// Chart utilities
export const formatChartTooltip = (value: number, name: string, type?: string) => {
  switch (type) {
    case 'currency':
      return [formatCurrency(value), name];
    case 'percentage':
      return [formatPercentage(value), name];
    default:
      return [formatNumber(value), name];
  }
};

export const generateChartConfig = (type: 'area' | 'pie' | 'bar' | 'line') => {
  const baseConfig = {
    responsive: true,
    maintainAspectRatio: false
  };

  switch (type) {
    case 'area':
      return {
        ...baseConfig,
        fill: true,
        tension: 0.4
      };
    case 'pie':
      return {
        ...baseConfig,
        plugins: {
          legend: {
            position: 'bottom' as const
          }
        }
      };
    default:
      return baseConfig;
  }
};