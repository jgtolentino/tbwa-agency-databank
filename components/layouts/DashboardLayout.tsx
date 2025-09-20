"use client";

import React, { ReactNode } from 'react';
import UniformLayout from './UniformLayout';
import { BarChart3, TrendingUp, Eye, Download, Refresh } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  metrics?: {
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  refreshAction?: () => void;
  exportAction?: () => void;
  showMetrics?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle,
  metrics = [],
  refreshAction,
  exportAction,
  showMetrics = true
}) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: title.replace(/[^\w\s]/gi, '').trim() }
  ];

  const actions = (
    <div className="flex items-center gap-2">
      {refreshAction && (
        <button
          onClick={refreshAction}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Refresh className="w-4 h-4" />
          Refresh
        </button>
      )}
      {exportAction && (
        <button
          onClick={exportAction}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      )}
    </div>
  );

  return (
    <UniformLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      actions={actions}
      contentPadding="large"
      fullWidth={true}
    >
      {/* Key Metrics */}
      {showMetrics && metrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
                {metric.trend && (
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    <TrendingUp className={`w-3 h-3 ${
                      metric.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                  </div>
                )}
              </div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                {metric.change && (
                  <div className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metric.change}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dashboard Content */}
      <div className="space-y-8">
        {children}
      </div>
    </UniformLayout>
  );
};

export default DashboardLayout;