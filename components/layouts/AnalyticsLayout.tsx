"use client";

import React, { ReactNode, useState } from 'react';
import UniformLayout from './UniformLayout';
import { 
  BarChart3, 
  Filter, 
  Calendar, 
  Download, 
  Settings, 
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
  type: 'select' | 'date' | 'text';
  options?: { label: string; value: string }[];
}

interface AnalyticsLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  filters?: FilterOption[];
  onFilterChange?: (filterId: string, value: string) => void;
  timeRange?: {
    start: string;
    end: string;
    onChange: (start: string, end: string) => void;
  };
  kpis?: {
    label: string;
    value: string | number;
    icon: ReactNode;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  }[];
  showFilters?: boolean;
  showKPIs?: boolean;
}

const AnalyticsLayout: React.FC<AnalyticsLayoutProps> = ({
  children,
  title,
  subtitle,
  filters = [],
  onFilterChange,
  timeRange,
  kpis = [],
  showFilters = true,
  showKPIs = true
}) => {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Analytics', href: '/analytics' },
    { label: title.replace(/[^\w\s]/gi, '').trim() }
  ];

  const actions = (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        <Settings className="w-4 h-4" />
        Configure
      </button>
      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        <Download className="w-4 h-4" />
        Export Report
      </button>
    </div>
  );

  const getKPIColorClass = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <UniformLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      actions={actions}
      contentPadding="large"
      fullWidth={true}
    >
      {/* Filters Section */}
      {showFilters && (filters.length > 0 || timeRange) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filters & Controls</h3>
            </div>
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {filtersExpanded ? 'Collapse' : 'Expand'}
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${!filtersExpanded ? 'hidden' : ''}`}>
            {/* Time Range */}
            {timeRange && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time Range</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={timeRange.start}
                    onChange={(e) => timeRange.onChange(e.target.value, timeRange.end)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={timeRange.end}
                    onChange={(e) => timeRange.onChange(timeRange.start, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Filters */}
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{filter.label}</label>
                {filter.type === 'select' ? (
                  <select
                    value={filter.value}
                    onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={filter.type}
                    value={filter.value}
                    onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs Section */}
      {showKPIs && kpis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${getKPIColorClass(kpi.color)} rounded-lg flex items-center justify-center text-white`}>
                  {kpi.icon}
                </div>
                {kpi.trend && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    kpi.trend === 'up' ? 'bg-green-100 text-green-700' :
                    kpi.trend === 'down' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${
                      kpi.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    {kpi.change}
                  </div>
                )}
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
                <div className="text-sm text-gray-600">{kpi.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Content */}
      <div className="space-y-8">
        {children}
      </div>
    </UniformLayout>
  );
};

export default AnalyticsLayout;