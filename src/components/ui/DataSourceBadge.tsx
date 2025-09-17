/**
 * Data Source Badge Component
 * Shows "Trusted" status from governance validation
 * Critical for production - must never show "Mock Data"
 */

import React, { useState, useEffect } from 'react';
import { getDataSourceStatus } from '../../lib/api';
import { logBadgeCheck } from '../../lib/telemetry';
import { ENV } from '../../lib/env';

interface DataSourceBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  refreshInterval?: number; // milliseconds
}

interface DataSourceStatus {
  source_status: string;
  last_updated?: string;
  dataset_count?: number;
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  className = '',
  size = 'md',
  showDetails = false,
  refreshInterval = 300000 // 5 minutes default
}) => {
  const [status, setStatus] = useState<DataSourceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await getDataSourceStatus();
      setStatus(data);
      setError(null);

      // Log badge check for monitoring
      logBadgeCheck(data.source_status, 'supabase_rpc');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Failed to fetch data source status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Set up refresh interval
    const interval = setInterval(fetchStatus, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Size styles
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Status styles
  const getStatusStyles = (sourceStatus: string) => {
    switch (sourceStatus?.toLowerCase()) {
      case 'trusted':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'mock data':
      case 'mock':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'unverified':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className={`inline-flex items-center border rounded-full ${sizeClasses[size]} bg-gray-100 text-gray-600 animate-pulse ${className}`}>
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
        Checking...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`inline-flex items-center border rounded-full ${sizeClasses[size]} bg-red-100 text-red-800 border-red-300 ${className}`}>
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        Error: {error}
        {ENV.PROD && (
          <div className="ml-2 text-xs font-semibold">PROD FAILURE</div>
        )}
      </div>
    );
  }

  const sourceStatus = status?.source_status || 'Unknown';

  // In production, enforce "Trusted" status
  if (ENV.PROD && sourceStatus.toLowerCase() !== 'trusted') {
    console.error(`Production badge check failed: Expected "Trusted", got "${sourceStatus}"`);
  }

  return (
    <div className={`inline-flex items-center border rounded-full ${sizeClasses[size]} ${getStatusStyles(sourceStatus)} ${className}`}>
      <div
        className={`w-2 h-2 rounded-full mr-2 ${
          sourceStatus.toLowerCase() === 'trusted' ? 'bg-green-500' :
          sourceStatus.toLowerCase().includes('mock') ? 'bg-red-500' :
          'bg-yellow-500'
        }`}
      ></div>

      <span className="font-medium">
        Data Source: {sourceStatus}
      </span>

      {ENV.PROD && sourceStatus.toLowerCase() !== 'trusted' && (
        <span className="ml-2 text-xs font-bold bg-red-500 text-white px-1 rounded">
          PROD VIOLATION
        </span>
      )}

      {showDetails && status?.last_updated && (
        <span className="ml-2 text-xs opacity-75">
          Updated: {new Date(status.last_updated).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default DataSourceBadge;