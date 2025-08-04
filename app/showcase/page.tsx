"use client";

import React, { useState } from 'react';
import ShowcaseLayout from '@/components/layouts/ShowcaseLayout';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Map,
  Filter,
  Palette,
  Layers,
  Zap,
  Eye,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as RechartsLine,
  BarChart as RechartsBar,
  PieChart as RechartsPie,
  AreaChart,
  ScatterChart,
  RadarChart,
  ComposedChart,
  Treemap,
  FunnelChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
  Scatter,
  Cell,
  Pie,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Funnel,
  ResponsiveContainerProps
} from 'recharts';

// Mock data generators
const generateTimeSeriesData = (points = 12) => {
  return Array.from({ length: points }, (_, i) => ({
    name: `M${i + 1}`,
    value: Math.floor(Math.random() * 1000) + 500,
    secondary: Math.floor(Math.random() * 800) + 300,
    tertiary: Math.floor(Math.random() * 600) + 200
  }));
};

const generateCategoryData = () => [
  { name: 'Desktop', value: 4500, color: '#8884d8' },
  { name: 'Mobile', value: 3200, color: '#82ca9d' },
  { name: 'Tablet', value: 1800, color: '#ffc658' },
  { name: 'Smart TV', value: 900, color: '#ff7c7c' },
  { name: 'Other', value: 600, color: '#8dd1e1' }
];

const generateScatterData = () => {
  return Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 50 + 10
  }));
};

const generateRadarData = () => [
  { subject: 'Performance', A: 120, B: 110, fullMark: 150 },
  { subject: 'Usability', A: 98, B: 130, fullMark: 150 },
  { subject: 'Security', A: 86, B: 130, fullMark: 150 },
  { subject: 'Scalability', A: 99, B: 100, fullMark: 150 },
  { subject: 'Reliability', A: 85, B: 90, fullMark: 150 },
  { subject: 'Innovation', A: 65, B: 85, fullMark: 150 }
];

const generateFunnelData = () => [
  { name: 'Visitors', value: 10000, fill: '#8884d8' },
  { name: 'Leads', value: 5000, fill: '#82ca9d' },
  { name: 'Qualified', value: 2500, fill: '#ffc658' },
  { name: 'Customers', value: 1000, fill: '#ff7c7c' }
];

const generateTreemapData = () => [
  { name: 'Analytics', size: 2400, fill: '#8884d8' },
  { name: 'Marketing', size: 1800, fill: '#82ca9d' },
  { name: 'Sales', size: 1600, fill: '#ffc658' },
  { name: 'Support', size: 1200, fill: '#ff7c7c' },
  { name: 'Development', size: 1000, fill: '#8dd1e1' },
  { name: 'Design', size: 800, fill: '#d084d0' }
];

interface ChartShowcaseProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  category: string;
  features: string[];
}

const ChartShowcaseCard: React.FC<ChartShowcaseProps> = ({
  title,
  description,
  icon,
  children,
  category,
  features
}) => {
  const [isAnimated, setIsAnimated] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
              {category}
            </span>
            <button
              onClick={() => setIsAnimated(!isAnimated)}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
            >
              {isAnimated ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap gap-1 mt-3">
          {features.map((feature) => (
            <span
              key={feature}
              className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded-full border border-gray-200"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className={`h-80 p-4 ${isAnimated ? 'animate-pulse' : ''}`}>
        {children}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>Interactive • Responsive • Exportable</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChartShowcase() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const charts = [
    {
      title: 'Multi-Line Time Series',
      description: 'Track multiple metrics over time',
      icon: <LineChart className="w-5 h-5" />,
      category: 'Time Series',
      features: ['Real-time', 'Zoom', 'Brush', 'Legend'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLine data={generateTimeSeriesData()}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
            <Line type="monotone" dataKey="secondary" stroke="#82ca9d" strokeWidth={3} dot={{ r: 6 }} />
            <Line type="monotone" dataKey="tertiary" stroke="#ffc658" strokeWidth={3} dot={{ r: 6 }} />
          </RechartsLine>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Stacked Area Chart',
      description: 'Show cumulative values over time',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'Time Series',
      features: ['Stacked', 'Smooth', 'Gradient', 'Interactive'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={generateTimeSeriesData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.8} />
            <Area type="monotone" dataKey="secondary" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.8} />
            <Area type="monotone" dataKey="tertiary" stackId="1" stroke="#ffc658" fill="#ffc658" fillOpacity={0.8} />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Grouped Bar Chart',
      description: 'Compare multiple categories side by side',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'Comparison',
      features: ['Grouped', 'Animated', 'Sortable', 'Filterable'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBar data={generateTimeSeriesData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="secondary" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tertiary" fill="#ffc658" radius={[4, 4, 0, 0]} />
          </RechartsBar>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Enhanced Pie Chart',
      description: 'Show composition with interactive segments',
      icon: <PieChart className="w-5 h-5" />,
      category: 'Composition',
      features: ['Labels', 'Hover', 'Click', 'Animation'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={generateCategoryData()}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {generateCategoryData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Scatter Plot Matrix',
      description: 'Explore relationships between variables',
      icon: <Zap className="w-5 h-5" />,
      category: 'Relationship',
      features: ['Correlation', 'Clustering', 'Zoom', 'Selection'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart data={generateScatterData()}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="stature" unit="cm" />
            <YAxis type="number" dataKey="y" name="weight" unit="kg" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Data Points" dataKey="z" fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Radar Performance Chart',
      description: 'Multi-dimensional performance analysis',
      icon: <Layers className="w-5 h-5" />,
      category: 'Comparison',
      features: ['Multi-axis', 'Overlay', 'Gradient', 'Labels'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={generateRadarData()}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis />
            <Radar name="Series A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Radar name="Series B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Conversion Funnel',
      description: 'Visualize step-by-step conversion rates',
      icon: <Filter className="w-5 h-5" />,
      category: 'Specialized',
      features: ['Conversion', 'Drop-off', 'Segmented', 'Animated'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip />
            <Funnel
              dataKey="value"
              data={generateFunnelData()}
              isAnimationActive
            />
          </FunnelChart>
        </ResponsiveContainer>
      )
    },
    {
      title: 'Treemap Hierarchy',
      description: 'Show hierarchical data with size encoding',
      icon: <Grid3X3 className="w-5 h-5" />,
      category: 'Composition',
      features: ['Hierarchical', 'Size-coded', 'Drilldown', 'Tooltips'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={generateTreemapData()}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          />
        </ResponsiveContainer>
      )
    },
    {
      title: 'Combined Chart',
      description: 'Mix different chart types in one view',
      icon: <Palette className="w-5 h-5" />,
      category: 'Specialized',
      features: ['Multi-type', 'Dual-axis', 'Synchronized', 'Complex'],
      component: (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={generateTimeSeriesData()}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="tertiary" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
            <Bar dataKey="secondary" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      )
    }
  ];

  const showcaseCategories = [
    { id: 'all', label: 'All Charts', count: charts.length },
    { id: 'Time Series', label: 'Time Series', count: charts.filter(c => c.category === 'Time Series').length },
    { id: 'Comparison', label: 'Comparison', count: charts.filter(c => c.category === 'Comparison').length },
    { id: 'Composition', label: 'Composition', count: charts.filter(c => c.category === 'Composition').length },
    { id: 'Relationship', label: 'Relationship', count: charts.filter(c => c.category === 'Relationship').length },
    { id: 'Distribution', label: 'Distribution', count: charts.filter(c => c.category === 'Distribution').length },
    { id: 'Geographic', label: 'Geographic', count: charts.filter(c => c.category === 'Geographic').length },
    { id: 'Specialized', label: 'Specialized', count: charts.filter(c => c.category === 'Specialized').length }
  ];

  const showcaseStats = [
    { label: 'Chart Types', value: `${charts.length}+`, color: 'blue' as const },
    { label: 'Interactive Features', value: '50+', color: 'green' as const },
    { label: 'Responsive Design', value: '100%', color: 'purple' as const },
    { label: 'Customization Options', value: '∞', color: 'orange' as const }
  ];

  const filteredCharts = charts.filter(chart => {
    const matchesCategory = selectedCategory === 'all' || chart.category === selectedCategory;
    const matchesSearch = chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <ShowcaseLayout
      title="🎨 Visual Chart Showcase"
      subtitle="Explore our comprehensive collection of interactive charts, filters, and visualizations"
      categories={showcaseCategories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      itemCount={filteredCharts.length}
      totalCount={charts.length}
      onReset={() => {
        setSelectedCategory('all');
        setSearchTerm('');
      }}
      onExport={() => {
        // Export functionality
        console.log('Exporting showcase collection...');
      }}
      stats={showcaseStats}
    >
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
        : 'space-y-6'
      }>
        {filteredCharts.map((chart, index) => (
          <ChartShowcaseCard
            key={index}
            title={chart.title}
            description={chart.description}
            icon={chart.icon}
            category={chart.category}
            features={chart.features}
          >
            {chart.component}
          </ChartShowcaseCard>
        ))}
      </div>

      {filteredCharts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No charts found</h3>
          <p className="text-gray-500">Try adjusting your search or category filter</p>
        </div>
      )}
    </ShowcaseLayout>
  );
}