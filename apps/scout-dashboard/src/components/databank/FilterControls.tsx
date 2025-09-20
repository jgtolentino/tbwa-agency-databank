import React, { useState } from 'react';
import { Calendar, MapPin, Package, Tag } from 'lucide-react';

export interface FilterState {
  dateRange: string;
  location: string;
  category: string;
  brand: string;
}

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'metro-manila', label: 'Metro Manila' },
    { value: 'luzon', label: 'Luzon' },
    { value: 'visayas', label: 'Visayas' },
    { value: 'mindanao', label: 'Mindanao' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'personal-care', label: 'Personal Care' },
    { value: 'household', label: 'Household' }
  ];

  const brandOptions = [
    { value: 'all', label: 'All Brands' },
    { value: 'brand-a', label: 'Brand A' },
    { value: 'brand-b', label: 'Brand B' },
    { value: 'brand-c', label: 'Brand C' },
    { value: 'unbranded', label: 'Unbranded' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="block w-40 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="block w-40 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {locationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="block w-40 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="block w-40 rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {brandOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};