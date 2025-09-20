"use client";

import React, { ReactNode, useState } from 'react';
import UniformLayout from './UniformLayout';
import { 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  Download,
  RotateCcw,
  Eye,
  Palette,
  Zap
} from 'lucide-react';

interface ShowcaseCategory {
  id: string;
  label: string;
  count?: number;
}

interface ShowcaseLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  categories?: ShowcaseCategory[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  itemCount?: number;
  totalCount?: number;
  onReset?: () => void;
  onExport?: () => void;
  showSearch?: boolean;
  showFilters?: boolean;
  showStats?: boolean;
  stats?: {
    label: string;
    value: string | number;
    color: 'blue' | 'green' | 'purple' | 'orange';
  }[];
}

const ShowcaseLayout: React.FC<ShowcaseLayoutProps> = ({
  children,
  title,
  subtitle,
  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  searchTerm = '',
  onSearchChange,
  viewMode = 'grid',
  onViewModeChange,
  itemCount = 0,
  totalCount = 0,
  onReset,
  onExport,
  showSearch = true,
  showFilters = true,
  showStats = true,
  stats = []
}) => {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/' },
    { label: 'Showcase' }
  ];

  const actions = (
    <div className="flex items-center gap-2">
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      )}
      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      )}
    </div>
  );

  const getStatColorClass = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <UniformLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={breadcrumbs}
      actions={actions}
      contentPadding="none"
      fullWidth={true}
    >
      {/* Search and Controls Bar */}
      <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* Search */}
              {showSearch && (
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
              )}
              
              {/* View Mode Toggle */}
              {onViewModeChange && (
                <div className="flex rounded-lg border border-gray-300 p-1">
                  <button
                    onClick={() => onViewModeChange('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewModeChange('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Item Counter */}
            <div className="text-gray-600">
              Showing <span className="font-semibold">{itemCount}</span> of <span className="font-semibold">{totalCount}</span> items
            </div>
          </div>

          {/* Category Filters */}
          {showFilters && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange?.(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-300'
                  }`}
                >
                  {category.label}
                  {category.count !== undefined && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Showcase Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Statistics Footer */}
      {showStats && stats.length > 0 && (
        <div className="bg-white border-t border-gray-200 mt-12 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className={`text-3xl font-bold ${getStatColorClass(stat.color)} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </UniformLayout>
  );
};

export default ShowcaseLayout;