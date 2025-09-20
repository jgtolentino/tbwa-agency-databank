"use client";

import React, { useState } from 'react';
import {
  Package,
  BarChart3,
  PieChart,
  LineChart,
  Map,
  Filter,
  Calculator,
  Table2,
  TrendingUp,
  GitBranch,
  Layers,
  CheckSquare,
  Square,
  Database,
  Zap,
  Copy,
  Download,
  Eye,
  Settings,
  Plus
} from 'lucide-react';

// Feature Arsenal Types
interface Feature {
  id: string;
  type: 'chart' | 'filter' | 'logic' | 'viz' | 'workflow' | 'integration';
  label: string;
  source: string;
  category: string;
  options?: string[];
  params?: string[];
  dependencies?: string[];
  preview?: string;
  harvested_at: string;
  usage_count: number;
  tags: string[];
}

interface FeatureCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
  features: Feature[];
}

// Harvested features from our dashboard extractions
const harvestedFeatures: Feature[] = [
  // From Web Traffic Dashboard
  {
    id: "chart_monthly_traffic_trend",
    type: "chart",
    label: "Monthly Traffic Trend",
    source: "Web Traffic Dashboard",
    category: "Analytics",
    options: ["line", "area", "bar"],
    params: ["date_range", "metric"],
    harvested_at: "2024-01-20T10:30:00Z",
    usage_count: 12,
    tags: ["time-series", "traffic", "trends"]
  },
  {
    id: "viz_traffic_sources_pie",
    type: "viz",
    label: "Traffic Sources Breakdown",
    source: "Web Traffic Dashboard",
    category: "Analytics",
    options: ["pie", "donut", "treemap"],
    params: ["source_filter", "percentage_threshold"],
    harvested_at: "2024-01-20T10:30:00Z",
    usage_count: 8,
    tags: ["composition", "sources", "marketing"]
  },
  
  // From Superstore Dashboard
  {
    id: "chart_sales_by_region",
    type: "chart",
    label: "Sales by Region",
    source: "Superstore Dashboard",
    category: "Sales",
    options: ["bar", "column", "heatmap"],
    params: ["region", "metric", "comparison"],
    harvested_at: "2024-01-20T11:15:00Z",
    usage_count: 15,
    tags: ["geographic", "sales", "regional"]
  },
  {
    id: "filter_date_range_picker",
    type: "filter",
    label: "Dynamic Date Range Filter",
    source: "Superstore Dashboard",
    category: "Controls",
    options: ["calendar", "dropdown", "slider"],
    params: ["start_date", "end_date", "granularity"],
    harvested_at: "2024-01-20T11:15:00Z",
    usage_count: 25,
    tags: ["temporal", "filter", "interactive"]
  },
  
  // From Northwind Sales Dashboard
  {
    id: "workflow_order_processing",
    type: "workflow",
    label: "Order Processing Pipeline",
    source: "Northwind Sales Dashboard",
    category: "Operations",
    options: ["linear", "parallel", "conditional"],
    params: ["stages", "approvals", "notifications"],
    dependencies: ["database_connection", "user_roles"],
    harvested_at: "2024-01-20T14:22:00Z",
    usage_count: 6,
    tags: ["automation", "orders", "process"]
  },
  {
    id: "logic_inventory_alerts",
    type: "logic",
    label: "Low Inventory Alert System",
    source: "Northwind Sales Dashboard",
    category: "Operations",
    params: ["threshold", "lead_time", "alert_channel"],
    harvested_at: "2024-01-20T14:22:00Z",
    usage_count: 9,
    tags: ["alerts", "inventory", "monitoring"]
  },
  
  // From Visual Vocabulary examples
  {
    id: "viz_correlation_scatter",
    type: "viz",
    label: "Correlation Scatterplot",
    source: "Visual Vocabulary",
    category: "Analytics",
    options: ["scatter", "bubble", "connected"],
    params: ["x_axis", "y_axis", "size", "color"],
    harvested_at: "2024-01-20T15:00:00Z",
    usage_count: 11,
    tags: ["correlation", "bivariate", "analysis"]
  },
  {
    id: "chart_distribution_histogram",
    type: "chart",
    label: "Distribution Histogram",
    source: "Visual Vocabulary",
    category: "Analytics",
    options: ["histogram", "density", "violin"],
    params: ["bins", "smoothing", "overlay"],
    harvested_at: "2024-01-20T15:00:00Z",
    usage_count: 7,
    tags: ["distribution", "statistical", "univariate"]
  }
];

const FeatureArsenal: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Group features by category
  const categories: FeatureCategory[] = [
    {
      name: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      count: harvestedFeatures.filter(f => f.category === "Analytics").length,
      features: harvestedFeatures.filter(f => f.category === "Analytics")
    },
    {
      name: "Sales",
      icon: <TrendingUp className="w-5 h-5" />,
      count: harvestedFeatures.filter(f => f.category === "Sales").length,
      features: harvestedFeatures.filter(f => f.category === "Sales")
    },
    {
      name: "Operations",
      icon: <GitBranch className="w-5 h-5" />,
      count: harvestedFeatures.filter(f => f.category === "Operations").length,
      features: harvestedFeatures.filter(f => f.category === "Operations")
    },
    {
      name: "Controls",
      icon: <Settings className="w-5 h-5" />,
      count: harvestedFeatures.filter(f => f.category === "Controls").length,
      features: harvestedFeatures.filter(f => f.category === "Controls")
    }
  ];

  const toggleFeature = (featureId: string) => {
    const newSelected = new Set(selectedFeatures);
    if (newSelected.has(featureId)) {
      newSelected.delete(featureId);
    } else {
      newSelected.add(featureId);
    }
    setSelectedFeatures(newSelected);
  };

  const filteredFeatures = harvestedFeatures.filter(feature => {
    const matchesCategory = filterCategory === 'all' || feature.category === filterCategory;
    const matchesSearch = feature.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const exportConfiguration = () => {
    const config = {
      name: "Custom Dashboard Configuration",
      created_at: new Date().toISOString(),
      features: Array.from(selectedFeatures).map(id => {
        const feature = harvestedFeatures.find(f => f.id === id);
        return {
          id: feature?.id,
          label: feature?.label,
          type: feature?.type,
          source: feature?.source
        };
      })
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailor-swiftly-config.json';
    a.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              Tailor Swiftly Feature Arsenal
            </h1>
            <p className="text-gray-600 mt-2">
              Harvested features from {new Set(harvestedFeatures.map(f => f.source)).size} dashboards • 
              {harvestedFeatures.length} total features available
            </p>
          </div>
          <div className="flex gap-3">
            {selectedFeatures.size > 0 && (
              <>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview ({selectedFeatures.size})
                </button>
                <button
                  onClick={exportConfiguration}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Config
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search features, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {categories.map(category => (
          <div key={category.name} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  {category.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.count} features</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Features</h2>
              <p className="text-sm text-gray-500 mt-1">
                Select features to include in your custom configuration
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredFeatures.map(feature => (
                <div
                  key={feature.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => toggleFeature(feature.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {selectedFeatures.has(feature.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{feature.label}</h3>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {feature.type}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-2">
                        Source: {feature.source} • Used {feature.usage_count} times
                      </p>
                      
                      {feature.options && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">Options:</span>
                          {feature.options.map(opt => (
                            <span key={opt} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        {feature.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Copy feature to clipboard
                          navigator.clipboard.writeText(JSON.stringify(feature, null, 2));
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          {showPreview && selectedFeatures.size > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Configuration Preview</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedFeatures.size} features selected
                </p>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  {Array.from(selectedFeatures).map(id => {
                    const feature = harvestedFeatures.find(f => f.id === id);
                    if (!feature) return null;
                    
                    return (
                      <div key={id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm text-gray-900">{feature.label}</h4>
                          <button
                            onClick={() => toggleFeature(id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">{feature.type} • {feature.source}</p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Deploy Custom Dashboard
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Database className="w-4 h-4" />
                    Save to Arsenal
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Arsenal Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Arsenal Statistics</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Features</span>
                <span className="font-medium">{harvestedFeatures.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Sources</span>
                <span className="font-medium">{new Set(harvestedFeatures.map(f => f.source)).size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Most Used</span>
                <span className="font-medium">Date Range Filter (25x)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Harvested</span>
                <span className="font-medium">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureArsenal;