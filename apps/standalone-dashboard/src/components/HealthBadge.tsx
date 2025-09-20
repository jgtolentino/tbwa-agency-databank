'use client';
import { useEffect, useState } from 'react';

interface HealthData {
  status: string;
  lastCheck: string;
  activeIssues: number;
  detail?: any;
}

const fetcher = (url: string): Promise<HealthData> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

export function HealthBadge() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetcher('/api/health');
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health');
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchHealth();

    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30_000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white rounded bg-gray-500">
        DQ: Loading...
      </span>
    );
  }

  if (error) {
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold text-white rounded bg-red-600">
        DQ: Error
      </span>
    );
  }

  const status = data?.status ?? 'unknown';
  const issues = data?.activeIssues ?? 0;

  const getStatusColor = () => {
    if (status === 'ok' || status === 'healthy') return 'bg-green-600';
    if (status === 'warn' || status === 'warning') return 'bg-yellow-600';
    if (status === 'error' || status === 'critical') return 'bg-red-600';
    return 'bg-gray-600';
  };

  const getStatusText = () => {
    if (issues > 0) return `${status} (${issues})`;
    return status;
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-semibold text-white rounded ${getStatusColor()}`}
      title={`Last check: ${data?.lastCheck ? new Date(data.lastCheck).toLocaleString() : 'Unknown'}`}
    >
      DQ: {getStatusText()}
    </span>
  );
}