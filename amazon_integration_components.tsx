// Amazon-styled Dashboard Integration Components
// Based on Scout Dashboard Analysis

import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, FunnelChart, Funnel, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LabelList
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Download, Filter, Calendar, 
  MapPin, Package, Tag, RefreshCw, FileText, FileSpreadsheet,
  ShoppingCart, Clock, Heart, Sparkles
} from 'lucide-react';

// Amazon Color Palette (adapted from Scout)
const AmazonColors = {
  primary: '#FF9900',      // Amazon Orange
  secondary: '#146EB4',    // Amazon Blue
  success: '#00A651',      // Green
  warning: '#FF9900',      // Orange
  danger: '#E01E5A',       // Red  
  info: '#0073E6',         // Blue
  purple: '#8B5CF6',       // Purple
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
};

// Data Types
interface KPIData {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}

interface ChartDataPoint {
  date?: string;
  name?: string;
  value: number;
  color?: string;
  [key: string]: any;
}

// KPI Card Component (Amazon-styled)
const AmazonKPICard: React.FC<KPIData> = ({ 
  label, 
  value, 
  change, 
  trend = 'neutral',
  icon 
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <span className="text-amazon-secondary">{icon}</span>}
            <p className="text-sm text-gray-600 font-medium">{label}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {change !== undefined && (
          <div className={`flex items-center ${getTrendColor()}`}>
            {TrendIcon && <TrendIcon className="h-4 w-4" />}
            <span className="text-sm font-semibold ml-1">
              {Math.abs(change)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Amazon-styled Tab Navigation
const AmazonTabs: React.FC<{
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors mr-6 ${
            activeTab === tab
              ? 'border-amazon-primary text-amazon-primary'
              : 'border-transparent text-gray-600 hover:text-amazon-secondary'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

// Amazon-styled Filter Component
const AmazonFilter: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}> = ({ icon, label, value, options, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-40 rounded-md border-gray-300 text-sm 
                   focus:border-amazon-primary focus:ring-amazon-primary
                   bg-white shadow-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="text-xs text-gray-500 hidden lg:inline">{label}</span>
    </div>
  );
};

// Amazon-styled Area Chart
const AmazonAreaChart: React.FC<{
  data: ChartDataPoint[];
  dataKey: string;
  title: string;
}> = ({ data, dataKey, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Filter className="h-4 w-4 text-gray-400" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis 
              dataKey="date" 
              stroke="#666666"
              fontSize={12}
            />
            <YAxis 
              stroke="#666666"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E5E5',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={AmazonColors.secondary}
              fill={AmazonColors.secondary}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Amazon-styled Pie Chart
const AmazonPieChart: React.FC<{
  data: ChartDataPoint[];
  title: string;
}> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Filter className="h-4 w-4 text-gray-400" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || AmazonColors.primary} 
                />
              ))}
              <LabelList 
                dataKey="name" 
                position="outside"
                fill="#333333"
                fontSize={12}
              />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Amazon-styled Funnel Chart
const AmazonFunnelChart: React.FC<{
  data: ChartDataPoint[];
  title: string;
}> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <Filter className="h-4 w-4 text-gray-400" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={data}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || AmazonColors.primary}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
              <LabelList position="center" fill="#fff" fontSize={14} fontWeight="bold" />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Amazon-styled Export Button
const AmazonExportButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                   bg-amazon-primary text-white rounded-lg hover:bg-amazon-primary/90 
                   focus:outline-none focus:ring-2 focus:ring-amazon-primary focus:ring-offset-2
                   transition-colors"
      >
        <Download className="h-4 w-4" />
        Export Report
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                        border border-gray-200 z-10">
          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm 
                           text-gray-700 hover:bg-gray-50 transition-colors">
            <FileText className="h-4 w-4" />
            Export as PDF
          </button>
          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm 
                           text-gray-700 hover:bg-gray-50 transition-colors">
            <FileSpreadsheet className="h-4 w-4" />
            Export as Excel
          </button>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const AmazonScoutDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Transaction Trends');
  const [dateFilter, setDateFilter] = useState('last30days');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  // Sample data based on Scout dashboard
  const transactionData = useMemo(() => [
    { date: '2025-08-19', volume: 580, revenue: 125000 },
    { date: '2025-08-24', volume: 650, revenue: 140000 },
    { date: '2025-08-29', volume: 620, revenue: 135000 },
    { date: '2025-09-03', volume: 720, revenue: 155000 },
    { date: '2025-09-08', volume: 690, revenue: 148000 },
    { date: '2025-09-15', volume: 649, revenue: 135785 },
  ], []);

  const productMixData = useMemo(() => [
    { name: 'Beverages', value: 35, color: AmazonColors.secondary },
    { name: 'Snacks', value: 25, color: AmazonColors.success },
    { name: 'Personal Care', value: 20, color: AmazonColors.warning },
    { name: 'Household', value: 15, color: AmazonColors.danger },
    { name: 'Others', value: 5, color: AmazonColors.purple },
  ], []);

  const funnelData = useMemo(() => [
    { name: 'Store Visit', value: 1000, color: AmazonColors.secondary },
    { name: 'Product Browse', value: 850, color: AmazonColors.success },
    { name: 'Brand Request', value: 650, color: AmazonColors.warning },
    { name: 'Accept Suggestion', value: 480, color: AmazonColors.purple },
    { name: 'Purchase', value: 420, color: AmazonColors.danger },
  ], []);

  const kpiData = useMemo(() => [
    { 
      label: 'Daily Volume', 
      value: '649', 
      change: 12.3, 
      trend: 'up' as const,
      icon: <ShoppingCart className="h-4 w-4" />
    },
    { 
      label: 'Daily Revenue', 
      value: '₱135,785', 
      change: -13.1, 
      trend: 'down' as const,
      icon: <Package className="h-4 w-4" />
    },
    { 
      label: 'Conversion Rate', 
      value: '42%', 
      change: 2.1, 
      trend: 'up' as const,
      icon: <TrendingUp className="h-4 w-4" />
    },
    { 
      label: 'Brand Loyalty', 
      value: '68%', 
      trend: 'neutral' as const,
      icon: <Heart className="h-4 w-4" />
    },
  ], []);

  const filterOptions = {
    date: [
      { value: 'today', label: 'Today' },
      { value: 'last7days', label: 'Last 7 Days' },
      { value: 'last30days', label: 'Last 30 Days' },
      { value: 'last90days', label: 'Last 90 Days' },
      { value: 'custom', label: 'Custom Range' }
    ],
    location: [
      { value: 'all', label: 'All Locations' },
      { value: 'metro-manila', label: 'Metro Manila' },
      { value: 'luzon', label: 'Luzon' },
      { value: 'visayas', label: 'Visayas' },
      { value: 'mindanao', label: 'Mindanao' }
    ],
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'beverages', label: 'Beverages' },
      { value: 'snacks', label: 'Snacks' },
      { value: 'personal-care', label: 'Personal Care' },
      { value: 'household', label: 'Household' }
    ],
    brand: [
      { value: 'all', label: 'All Brands' },
      { value: 'brand-a', label: 'Brand A' },
      { value: 'brand-b', label: 'Brand B' },
      { value: 'brand-c', label: 'Brand C' },
      { value: 'unbranded', label: 'Unbranded' }
    ]
  };

  const tabs = ['Transaction Trends', 'Product Mix', 'Consumer Behavior', 'Consumer Profiling'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Scout Analytics Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Amazon-styled Executive Analytics Platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                               text-gray-700 bg-white border border-gray-300 rounded-lg 
                               hover:bg-gray-50 transition-colors">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <AmazonExportButton />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <AmazonFilter
              icon={<Calendar className="h-4 w-4" />}
              label="Date Range"
              value={dateFilter}
              options={filterOptions.date}
              onChange={setDateFilter}
            />
            <AmazonFilter
              icon={<MapPin className="h-4 w-4" />}
              label="Location"
              value={locationFilter}
              options={filterOptions.location}
              onChange={setLocationFilter}
            />
            <AmazonFilter
              icon={<Package className="h-4 w-4" />}
              label="Category"
              value={categoryFilter}
              options={filterOptions.category}
              onChange={setCategoryFilter}
            />
            <AmazonFilter
              icon={<Tag className="h-4 w-4" />}
              label="Brand"
              value={brandFilter}
              options={filterOptions.brand}
              onChange={setBrandFilter}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <AmazonKPICard key={index} {...kpi} />
          ))}
        </div>

        {/* Tab Navigation */}
        <AmazonTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AmazonAreaChart
            data={transactionData}
            dataKey="volume"
            title="Transaction Volume Trends"
          />
          <AmazonPieChart
            data={productMixData}
            title="Product Mix Distribution"
          />
          <div className="lg:col-span-2">
            <AmazonFunnelChart
              data={funnelData}
              title="Consumer Purchase Funnel"
            />
          </div>
        </div>

        {/* Insights Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Growth Opportunity</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Volume increasing but revenue declining - focus on premium products
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Heart className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">High Loyalty</p>
                  <p className="text-sm text-green-700 mt-1">
                    68% brand loyalty rate indicates strong customer retention
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900">AI Opportunity</p>
                  <p className="text-sm text-purple-700 mt-1">
                    73.8% suggestion acceptance rate shows AI effectiveness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonScoutDashboard;