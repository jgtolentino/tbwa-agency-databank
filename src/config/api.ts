/**
 * API Configuration
 */

// Base URL for API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Video Analysis API endpoints
export const VIDEO_API_ENDPOINTS = {
  analyze: '/analyze/video',
  results: '/analysis',
  query: '/analysis/query',
  export: '/analysis/export',
  batch: '/batch/analyze',
  history: '/analysis/history',
};

// Campaign API endpoints
export const CAMPAIGN_API_ENDPOINTS = {
  analytics: '/campaigns/analytics',
  benchmarks: '/campaigns/benchmarks',
  details: '/campaigns',
  search: '/campaigns/search',
};

// Document API endpoints
export const DOCUMENT_API_ENDPOINTS = {
  upload: '/documents/upload',
  extract: '/documents/extract',
  search: '/documents/search',
  insights: '/documents/insights',
};

// Authentication configuration
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 3600, // 1 hour in seconds
};

// Request timeout configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// File upload configuration
export const UPLOAD_CONFIG = {
  maxFileSize: 500 * 1024 * 1024, // 500MB
  acceptedVideoFormats: ['.mp4', '.mov', '.avi', '.webm'],
  acceptedDocumentFormats: ['.pdf', '.ppt', '.pptx', '.doc', '.docx'],
};

// WebSocket configuration for real-time updates
export const WS_CONFIG = {
  url: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws',
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
};