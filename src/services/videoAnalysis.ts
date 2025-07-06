/**
 * Video Analysis Service
 * Handles video campaign analysis with CES scoring
 */

import { API_BASE_URL } from '@/config/api';

export interface VideoAnalysisRequest {
  campaign_name: string;
  brand: string;
  campaign_type: 'brand' | 'performance' | 'hybrid' | 'awareness';
  enable_enrichment?: boolean;
  metadata?: Record<string, any>;
}

export interface VideoAnalysisResponse {
  analysis_id: string;
  status: 'completed' | 'failed' | 'processing';
  processing_time: string;
  ces_score: number;
  enrichment_enabled: boolean;
  success_probability: number;
  roi_forecast: {
    expected: number;
    lower_bound: number;
    upper_bound: number;
    confidence: number;
  };
  key_recommendations: Array<{
    category: string;
    priority: string;
    title: string;
    description: string;
    impact: number;
  }>;
  download_links: {
    full_analysis: string;
    pdf_report: string;
    csv_data: string;
  };
}

export interface AnalysisResults {
  analysis_id: string;
  video_analysis: {
    scene_analysis: any;
    emotion_analysis: any;
    speech_analysis: any;
    unified_frames: number;
  };
  campaign_effectiveness: {
    overall_effectiveness: {
      ces_score: number;
      success_probability: number;
      roi_forecast: any;
    };
    timestamp_analysis: Array<{
      timestamp: string;
      segment_ces_score: number;
      visual_effectiveness: number;
      emotional_impact: any;
      key_insights: string[];
    }>;
    feature_importance: Record<string, number>;
    recommendations: any[];
    comparative_benchmarks: any;
  };
  competitive_intelligence?: {
    share_of_voice: any;
    social_performance: any;
    digital_presence: any;
    market_trends: any;
  };
  enhanced_ces_analysis?: {
    enhanced_ces_score: number;
    adjustment_factors: Array<{
      factor: string;
      adjustment: number;
      reasoning: string;
    }>;
  };
}

/**
 * Analyze video with CES scoring
 */
export async function analyzeVideoWithCES(
  videoFile: File,
  metadata: VideoAnalysisRequest
): Promise<VideoAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', videoFile);
  formData.append('campaign_metadata', JSON.stringify(metadata));
  formData.append('enable_enrichment', String(metadata.enable_enrichment || false));

  const response = await fetch(`${API_BASE_URL}/analyze/video`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Analyze video from URL with CES scoring
 */
export async function analyzeVideoFromUrl(
  videoUrl: string,
  metadata: VideoAnalysisRequest
): Promise<VideoAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze/video-url`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify({
      video_url: videoUrl,
      campaign_metadata: metadata,
      enable_enrichment: metadata.enable_enrichment || false,
    }),
  });

  if (!response.ok) {
    throw new Error(`URL analysis failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get analysis results
 */
export async function getAnalysisResults(analysisId: string): Promise<AnalysisResults> {
  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get analysis results: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Query analysis with custom questions
 */
export async function queryAnalysis(
  analysisId: string,
  question: string,
  timestampRange?: string
): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: JSON.stringify({
      question,
      timestamp_range: timestampRange,
      analysis_id: analysisId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Query failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Export analysis report
 */
export async function exportAnalysisReport(
  analysisId: string,
  format: 'pdf' | 'csv' | 'json'
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}/${format}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  return response.blob();
}

/**
 * Batch analyze multiple videos
 */
export async function batchAnalyzeVideos(
  videos: File[],
  metadataList: VideoAnalysisRequest[]
): Promise<any> {
  const formData = new FormData();
  
  videos.forEach((video) => {
    formData.append('files', video);
  });
  
  formData.append('campaign_metadata_list', JSON.stringify(metadataList));

  const response = await fetch(`${API_BASE_URL}/batch/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Batch analysis failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get batch analysis status
 */
export async function getBatchStatus(batchId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/batch/${batchId}/status`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get batch status: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get analysis history
 */
export async function getAnalysisHistory(params?: {
  limit?: number;
  campaign_type?: string;
  min_ces_score?: number;
}): Promise<any> {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.campaign_type) queryParams.append('campaign_type', params.campaign_type);
  if (params?.min_ces_score) queryParams.append('min_ces_score', String(params.min_ces_score));

  const response = await fetch(`${API_BASE_URL}/analysis/history?${queryParams}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get analysis history: ${response.statusText}`);
  }

  return response.json();
}