import { API_BASE_URL, CAMPAIGN_API_ENDPOINTS } from '@/config/api';

export interface CampaignAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  avgCESScore: number;
  cesImprovement: number;
  totalReach: string;
  awardsWon: number;
  cesScoreTrend: Array<{ month: string; score: number }>;
  campaignTypes: Array<{ name: string; value: number }>;
  recentCampaigns: Array<{
    id: string;
    name: string;
    brand: string;
    type: string;
    cesScore: number;
  }>;
  performanceMetrics: Array<{
    metric: string;
    current: number;
    target: number;
  }>;
}

export async function getCampaignAnalytics(): Promise<CampaignAnalytics> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.analytics}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch campaign analytics: ${response.statusText}`);
  }

  return response.json();
}

export async function getCampaignDetails(campaignId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.details}/${campaignId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch campaign details: ${response.statusText}`);
  }

  return response.json();
}

export async function searchCampaigns(query: string): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.search}?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search campaigns: ${response.statusText}`);
  }

  return response.json();
}

export async function getBenchmarks(campaignType: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}${CAMPAIGN_API_ENDPOINTS.benchmarks}?type=${campaignType}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch benchmarks: ${response.statusText}`);
  }

  return response.json();
}
