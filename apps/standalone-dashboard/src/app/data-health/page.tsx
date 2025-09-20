'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Database, Activity, TrendingUp, TrendingDown, Shield, Zap } from 'lucide-react';

interface HealthSummary {
  total_records: number;
  azure_records: number;
  ps2_records: number;
  edge_records: number;
  unique_transactions: number;
  potential_duplicates: number;
  overall_grade: string;
  timestamp_quality: number;
  store_quality: number;
  amount_quality: number;
  uniqueness_ratio: number;
  latest_transaction: string;
  data_span_days: number;
}

interface HealthIssue {
  issue_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affected_records: number;
  condition_desc: string;
  resolution: string;
  status_icon: string;
  detected_at: string;
}

interface ActivityItem {
  activity_type: string;
  source: string;
  record_count: number;
  last_activity: string;
  description: string;
  status: string;
  status_icon: string;
  time_ago: string;
}

interface HealthData {
  summary: HealthSummary;
  issues: HealthIssue[];
  activity: ActivityItem[];
  timestamp: string;
}

export default function DataHealthPage() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dq/summary');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch health data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'EXCELLENT': return 'text-green-600 bg-green-50 border-green-200';
      case 'GOOD': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'FAIR': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'POOR': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-700 bg-red-100 border-red-300';
      case 'HIGH': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      case 'LOW': return 'text-blue-700 bg-blue-100 border-blue-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Health Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Real-time data quality monitoring and ETL health</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading data health metrics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Data Health Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">Real-time data quality monitoring and ETL health</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">Error loading data health: {error}</span>
            </div>
            <button
              onClick={fetchData}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Health Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Real-time data quality monitoring and ETL health</p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Overall Grade</p>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getGradeColor(data.summary.overall_grade)}`}>
                    <Shield className="h-4 w-4 mr-1" />
                    {data.summary.overall_grade}
                  </div>
                </div>
                <Database className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-3">Data quality assessment</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Records</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {data.summary.total_records.toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {data.summary.unique_transactions.toLocaleString()} unique transactions
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quality Scores</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Timestamps</span>
                      <span className="text-sm font-medium text-green-600">{data.summary.timestamp_quality}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stores</span>
                      <span className="text-sm font-medium text-green-600">{data.summary.store_quality}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Amounts</span>
                      <span className="text-sm font-medium text-red-600">{data.summary.amount_quality}%</span>
                    </div>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Data Sources</p>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Azure</span>
                      <span className="text-sm font-medium">{data.summary.azure_records.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">PS2</span>
                      <span className="text-sm font-medium">{data.summary.ps2_records.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Edge</span>
                      <span className="text-sm font-medium">{data.summary.edge_records.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Issues Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Data Quality Issues</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                  {data.issues.length}
                </span>
              </div>
            </div>

            {data.issues.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-gray-500">No data quality issues detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.issues.map((issue, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{issue.status_icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{issue.issue_type}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {issue.affected_records.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">records</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-md p-3 space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Condition:</span> {issue.condition_desc}
                      </p>
                      <p className="text-sm text-blue-600">
                        <span className="font-medium">Resolution:</span> {issue.resolution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Stream */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">ETL Activity Stream</h2>
            </div>

            <div className="space-y-3">
              {data.activity.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{item.status_icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{item.activity_type}</div>
                      <div className="text-sm text-gray-600">
                        {item.source} • {item.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.record_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{item.time_ago}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
}