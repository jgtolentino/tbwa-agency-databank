/**
 * Campaign Service
 * Handles campaign analytics and benchmarking data via MCP backend
 */

import { API_BASE_URL } from '@/config/api';

export interface CampaignAnalyticsRequest {
  timeRange: string;
  industry?: string;
  campaignType?: string;
}

export interface CampaignAnalytics {
  overview: {
    totalCampaigns: number;
    avgCesScore: number;
    totalBudget: number;
    avgRoi: number;
    topPerformers: number;
    needsImprovement: number;
  };
  cesDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  trendData: Array<{
    month: string;
    avgCes: number;
    campaigns: number;
    roi: number;
  }>;
  featureImportance: Array<{
    feature: string;
    weight: number;
    category: string;
  }>;
  industryBenchmarks: Array<{
    industry: string;
    avgCes: number;
    topQuartile: number;
    campaigns: number;
  }>;
  recentCampaigns: Array<{
    id: number;
    name: string;
    brand: string;
    cesScore: number;
    roi: number;
    status: string;
    type: string;
    date: string;
  }>;
}

/**
 * Get campaign analytics data
 */
export async function getCampaignAnalytics(
  params: CampaignAnalyticsRequest
): Promise<CampaignAnalytics> {
  try {
    // Use MCP backend for campaign analytics
    const response = await fetch(`${API_BASE_URL}/api/jampacked/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`Campaign analytics request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Campaign analytics failed:', error);
    throw new Error('Campaign analytics service unavailable. Please try again later.');
  }
}

/**
 * Get campaign benchmarks
 */
export async function getCampaignBenchmarks(
  industry?: string,
  region?: string
): Promise<any> {
  try {
    const params = new URLSearchParams();
    if (industry) params.append('industry', industry);
    if (region) params.append('region', region);

    const response = await fetch(`${API_BASE_URL}/api/jampacked/insights?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Benchmarks request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Campaign benchmarks failed:', error);
    throw new Error('Campaign benchmarks service unavailable. Please try again later.');
  }
}

/**
 * Get campaign details
 */
export async function getCampaignDetails(campaignId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/jampacked/campaigns/${campaignId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Campaign details request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Campaign details failed:', error);
    throw new Error('Campaign details service unavailable. Please try again later.');
  }
}