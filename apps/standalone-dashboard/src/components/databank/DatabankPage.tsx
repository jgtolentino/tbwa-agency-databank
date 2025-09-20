'use client';

import React, { useState, useCallback } from 'react';
import { DatabankHeader } from './DatabankHeader';
import { FilterControls, FilterState } from './FilterControls';
import { TransactionTrendsChart } from './TransactionTrendsChart';
import { ProductMixChart } from './ProductMixChart';
import { ConsumerBehaviorChart } from './ConsumerBehaviorChart';
import { ConsumerProfilingChart } from './ConsumerProfilingChart';
import { ComparativeAnalytics } from './ComparativeAnalytics';

interface DatabankPageProps {
  className?: string;
}

export const DatabankPage: React.FC<DatabankPageProps> = ({ className }) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    location: 'all',
    category: 'all',
    brand: 'all'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  const handleExportPDF = useCallback(() => {
    // Implement PDF export logic
    console.log('Exporting to PDF...');
  }, []);

  const handleExportExcel = useCallback(() => {
    // Implement Excel export logic
    console.log('Exporting to Excel...');
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    // Implement filter logic - would typically trigger API calls
    console.log('Filters changed:', newFilters);
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 ${className || ''}`}>
      {/* Header */}
      <DatabankHeader
        onRefresh={handleRefresh}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />

      {/* Filter Controls */}
      <FilterControls
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Transaction Trends Chart */}
          <TransactionTrendsChart />

          {/* Product Mix & SKU Analytics Chart */}
          <ProductMixChart />

          {/* Consumer Behavior & Preferences Chart */}
          <ConsumerBehaviorChart />

          {/* Consumer Profiling Chart */}
          <ConsumerProfilingChart />

        </div>

        {/* Comparative Analytics - Full Width */}
        <ComparativeAnalytics />

      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900">Refreshing data...</span>
          </div>
        </div>
      )}
    </div>
  );
};