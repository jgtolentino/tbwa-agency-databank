"use client";

import React, { useState } from 'react';
import {
  Database,
  FileJson,
  Eye,
  BarChart3,
  Filter,
  Calculator,
  Table,
  ChevronDown,
  ChevronRight,
  Server,
  HardDrive
} from 'lucide-react';

interface DashboardMetadata {
  id: string;
  name: string;
  platform: 'tableau' | 'powerbi';
  version: string;
  filePath: string;
  metadata: any;
  extractedAt: string;
  visualsCount: number;
  datasourcesCount: number;
  filtersCount: number;
  calculationsCount: number;
}

// Mock data representing extracted dashboards
const extractedDashboards: DashboardMetadata[] = [
  {
    id: "2f1d23ae-573f-459a-b2e4-f21c06f6fd3f",
    name: "Web Traffic Dashboard",
    platform: "tableau",
    version: "2023.2",
    filePath: "/Users/tbwa/Downloads/Web Traffic Dashboard _ Digital Marketing _ VOTD.twbx",
    metadata: { workbookName: "Web Traffic Dashboard", author: "Digital Marketing Team" },
    extractedAt: "2024-01-20T10:30:00Z",
    visualsCount: 56,
    datasourcesCount: 3,
    filtersCount: 8,
    calculationsCount: 12
  },
  {
    id: "a8b9c2d3-684a-5b6c-c3d5-g32d17g7ge4g",
    name: "Superstore Dashboard",
    platform: "tableau",
    version: "2023.2",
    filePath: "/Users/tbwa/Downloads/SuperstoreDashboard.twbx",
    metadata: { workbookName: "Superstore Analysis", category: "Sales" },
    extractedAt: "2024-01-20T11:15:00Z",
    visualsCount: 42,
    datasourcesCount: 2,
    filtersCount: 6,
    calculationsCount: 15
  },
  {
    id: "c4d5e6f7-7a8b-6c9d-d4e6-h43e28h8hf5h",
    name: "Northwind Sales Dashboard",
    platform: "tableau",
    version: "2023.2",
    filePath: "/Users/tbwa/Downloads/Northwind Sales Dashboard.twbx",
    metadata: { workbookName: "Northwind Trading", region: "Global" },
    extractedAt: "2024-01-20T14:22:00Z",
    visualsCount: 34,
    datasourcesCount: 4,
    filtersCount: 10,
    calculationsCount: 8
  },
  {
    id: "d5e6f7g8-8b9c-7dae-e5f7-i54f39i9ig6i",
    name: "Online Retail Dashboard",
    platform: "tableau",
    version: "2023.2",
    filePath: "/Users/tbwa/Downloads/Online Retail Dashboard.twbx",
    metadata: { workbookName: "E-commerce Analytics", sector: "Retail" },
    extractedAt: "2024-01-20T14:35:00Z",
    visualsCount: 21,
    datasourcesCount: 2,
    filtersCount: 5,
    calculationsCount: 7
  }
];

const DashboardMetadataViewer: React.FC = () => {
  const [expandedDashboard, setExpandedDashboard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture'>('overview');

  const toggleExpand = (dashboardId: string) => {
    setExpandedDashboard(expandedDashboard === dashboardId ? null : dashboardId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Extraction System</h1>
        <p className="text-gray-600">
          Extracted dashboard metadata stored in Supabase with local JSON backup
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Extracted Dashboards
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'architecture'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Storage Architecture
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Dashboards</p>
                  <p className="text-2xl font-bold text-blue-900">{extractedDashboards.length}</p>
                </div>
                <Database className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Total Visuals</p>
                  <p className="text-2xl font-bold text-green-900">
                    {extractedDashboards.reduce((sum, d) => sum + d.visualsCount, 0)}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Data Sources</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {extractedDashboards.reduce((sum, d) => sum + d.datasourcesCount, 0)}
                  </p>
                </div>
                <Table className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Calculations</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {extractedDashboards.reduce((sum, d) => sum + d.calculationsCount, 0)}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Dashboard List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {extractedDashboards.map((dashboard) => (
              <div key={dashboard.id} className="border-b border-gray-200 last:border-b-0">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(dashboard.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        {expandedDashboard === dashboard.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{dashboard.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {dashboard.id} • Extracted: {new Date(dashboard.extractedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{dashboard.visualsCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Table className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{dashboard.datasourcesCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{dashboard.filtersCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calculator className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{dashboard.calculationsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedDashboard === dashboard.id && (
                  <div className="px-4 pb-4">
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Dashboard Info</h4>
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Platform:</dt>
                              <dd className="font-medium">{dashboard.platform}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">Version:</dt>
                              <dd className="font-medium">{dashboard.version}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-gray-500">File Path:</dt>
                              <dd className="font-medium truncate max-w-xs" title={dashboard.filePath}>
                                {dashboard.filePath.split('/').pop()}
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Metadata</h4>
                          <pre className="text-xs bg-white p-2 rounded border border-gray-200 overflow-auto">
                            {JSON.stringify(dashboard.metadata, null, 2)}
                          </pre>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-3">
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          View in Supabase
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                          Export JSON
                        </button>
                        <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                          Generate TSX Component
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Architecture Diagram */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Storage Architecture</h2>
            
            {/* Flow Diagram */}
            <div className="space-y-8">
              {/* Extraction Layer */}
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                  <FileJson className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Dashboard Files</p>
                  <p className="text-xs text-gray-600">.twbx / .pbix</p>
                </div>
                <div className="text-gray-400">→</div>
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <Server className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Extraction Engine</p>
                  <p className="text-xs text-gray-600">Python Extractors</p>
                </div>
              </div>

              {/* Storage Layer */}
              <div className="flex items-center justify-center space-x-8">
                <div className="flex-1 max-w-md">
                  <div className="bg-purple-100 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Database className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Supabase Database</h3>
                        <p className="text-sm text-gray-600">Primary Storage</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="bg-white p-2 rounded flex items-center justify-between">
                        <span className="font-medium">dashboard_registry</span>
                        <span className="text-gray-500">Main table</span>
                      </div>
                      <div className="bg-white p-2 rounded flex items-center justify-between">
                        <span className="font-medium">dashboard_visuals</span>
                        <span className="text-gray-500">Charts & graphs</span>
                      </div>
                      <div className="bg-white p-2 rounded flex items-center justify-between">
                        <span className="font-medium">dashboard_datasources</span>
                        <span className="text-gray-500">Connections</span>
                      </div>
                      <div className="bg-white p-2 rounded flex items-center justify-between">
                        <span className="font-medium">dashboard_filters</span>
                        <span className="text-gray-500">Parameters</span>
                      </div>
                      <div className="bg-white p-2 rounded flex items-center justify-between">
                        <span className="font-medium">dashboard_calculations</span>
                        <span className="text-gray-500">DAX/Formulas</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 max-w-md">
                  <div className="bg-orange-100 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <HardDrive className="w-8 h-8 text-orange-600 mr-3" />
                      <div>
                        <h3 className="font-semibold">Local JSON Export</h3>
                        <p className="text-sm text-gray-600">Backup Storage</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded">
                      <pre className="text-xs overflow-auto">
{`{
  "dashboard": {
    "id": "uuid",
    "name": "Dashboard Name",
    "visuals": [...],
    "datasources": [...],
    "filters": [...],
    "calculations": [...]
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retrieval Layer */}
              <div className="text-center">
                <div className="inline-block bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Retrieval Methods</p>
                  <div className="flex space-x-4 text-xs">
                    <code className="bg-white px-2 py-1 rounded">SupabaseStorage.get(id)</code>
                    <code className="bg-white px-2 py-1 rounded">get_dashboard_json(uuid)</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Database Schema */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Database Schema</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-1">dashboard_registry</h4>
                  <p className="text-xs text-gray-600">
                    Stores main dashboard info: id (UUID), name, platform, version, file_path, metadata, created_at
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-1">dashboard_visuals</h4>
                  <p className="text-xs text-gray-600">
                    Visual details: name, type, page, position (x,y,width,height), data_binding, config
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-1">dashboard_datasources</h4>
                  <p className="text-xs text-gray-600">
                    Data connections: name, connection_type, connection_string, tables_used
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-1">dashboard_filters</h4>
                  <p className="text-xs text-gray-600">
                    Filter info: name, type, target_field, default_value, filter_config
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-1">dashboard_calculations</h4>
                  <p className="text-xs text-gray-600">
                    Calculated fields: name, type, expression, data_type
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="font-medium text-sm mb-1">dashboard_summary (View)</h4>
                  <p className="text-xs text-gray-600">
                    Aggregated view with counts of visuals, datasources, filters, calculations per dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMetadataViewer;