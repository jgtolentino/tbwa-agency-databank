// Type definitions for Scout AI Cross-Tab Analysis System

export interface CrossTabQuery {
  query: string;
  intent: QueryIntent;
  parameters: QueryParameters;
  timestamp: string;
}

export interface QueryIntent {
  type: 'time_analysis' | 'basket_analysis' | 'substitution_analysis' | 'demographic_analysis' | 'general_question';
  category: string;
  confidence: number;
  subcategory?: string;
}

export interface QueryParameters {
  timeframe?: string;
  category?: string;
  brand?: string;
  demographic?: string;
  metric?: string;
  store?: string;
}

export interface CrossTabResponse {
  answer: string;
  insights: CrossTabInsight[];
  metrics: CrossTabMetric[];
  recommendations: Recommendation[];
  visualization?: VisualizationConfig;
  confidence: number;
  relatedQueries: string[];
}

export interface CrossTabInsight {
  type: 'time_pattern' | 'basket_behavior' | 'substitution_pattern' | 'demographic_trend';
  title: string;
  finding: string;
  context: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface CrossTabMetric {
  name: string;
  value: number | string;
  unit: string;
  comparison?: {
    period: string;
    change: number;
    direction: 'up' | 'down' | 'stable';
  };
  benchmark?: {
    value: number;
    label: string;
  };
}

export interface Recommendation {
  action: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  roi: {
    monthly: string;
    confidence: number;
  };
  timeline: string;
  priority: number;
}

export interface VisualizationConfig {
  type: 'bar' | 'line' | 'pie' | 'heatmap' | 'scatter' | 'table';
  title: string;
  data: any[];
  config?: {
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    colors?: string[];
    annotations?: VisualizationAnnotation[];
  };
}

export interface VisualizationAnnotation {
  type: 'highlight' | 'arrow' | 'border' | 'label';
  target: string;
  style: {
    color?: string;
    size?: number;
    position?: string;
  };
  message?: string;
}

// Cross-Tab Analysis Types - All 16 patterns
export type CrossTabAnalysisType =
  // Time of Day (4 analyses)
  | 'time_product_category'
  | 'time_brand'
  | 'time_demographics'
  | 'time_emotions'
  // Basket Behavior (4 analyses)
  | 'basket_product_category'
  | 'basket_payment_method'
  | 'basket_customer_type'
  | 'basket_emotions'
  // Product/Brand Switching (3 analyses)
  | 'substitution_category'
  | 'substitution_reason'
  | 'suggestion_brand'
  // Demographics (5 analyses)
  | 'age_product_category'
  | 'age_brand'
  | 'age_pack_size'
  | 'gender_daypart'
  | 'payment_demographics';

export interface CrossTabAnalysisPattern {
  type: CrossTabAnalysisType;
  name: string;
  description: string;
  data: any[];
  insights: string[];
  keyMetrics: {
    primary: string;
    secondary: string[];
  };
  commonQueries: string[];
}

// Chat System Types
export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  response?: CrossTabResponse;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  context: ChatContext;
  startTime: Date;
  lastActivity: Date;
}

export interface ChatContext {
  currentSection?: string;
  recentQueries: string[];
  userPreferences: {
    detailLevel: 'brief' | 'detailed' | 'technical';
    focusArea: string[];
    language: 'en' | 'fil';
  };
}

// Quick Action Types
export interface QuickAction {
  id: string;
  label: string;
  query: string;
  icon: string;
  category: 'time' | 'basket' | 'demographics' | 'performance';
  popular: boolean;
}

// Response Templates
export interface ResponseTemplate {
  pattern: string;
  template: string;
  variables: string[];
  examples: string[];
}

// API Types
export interface ScoutAIRequest {
  query: string;
  context?: ChatContext;
  options?: {
    includeVisualization: boolean;
    detailLevel: 'brief' | 'detailed';
    maxRecommendations: number;
  };
}

export interface ScoutAIResponse {
  success: boolean;
  data?: CrossTabResponse;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata: {
    processingTime: number;
    cacheHit: boolean;
    confidence: number;
    version: string;
  };
}

// Data Integration Types
export interface DataSource {
  name: string;
  type: 'transaction' | 'inventory' | 'customer' | 'external';
  endpoint?: string;
  updateFrequency: number; // minutes
  lastUpdate: Date;
  status: 'active' | 'inactive' | 'error';
}

export interface DataCache {
  key: string;
  data: any;
  timestamp: Date;
  ttl: number; // time to live in minutes
  hitCount: number;
}

// Performance Metrics
export interface PerformanceMetrics {
  responseTime: number;
  cacheHitRate: number;
  queryAccuracy: number;
  userSatisfaction: number;
  activeUsers: number;
  queriesPerMinute: number;
}