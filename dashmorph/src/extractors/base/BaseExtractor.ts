/**
 * Base extractor interface for all dashboard sources
 */

import { DashboardSource, DissectedDashboard, ExtractorOptions } from '../../core/types';

export abstract class BaseExtractor {
  protected source: DashboardSource;
  protected options: ExtractorOptions;

  constructor(source: DashboardSource, options: ExtractorOptions = {}) {
    this.source = source;
    this.options = {
      timeout: 30000,
      retries: 3,
      includeData: true,
      includeInteractions: true,
      includeAssets: false,
      precision: 'medium',
      ...options
    };
  }

  /**
   * Main extraction method - must be implemented by each extractor
   */
  abstract extract(): Promise<DissectedDashboard>;

  /**
   * Validate source before extraction
   */
  abstract validateSource(): Promise<boolean>;

  /**
   * Get source metadata
   */
  abstract getMetadata(): Promise<any>;

  /**
   * Test connection to source
   */
  async testConnection(): Promise<boolean> {
    try {
      return await this.validateSource();
    } catch (error) {
      console.error(`Connection test failed for ${this.source.type}:`, error);
      return false;
    }
  }

  /**
   * Retry wrapper for network operations
   */
  protected async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = this.options.retries || 3
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (i === maxRetries) {
          throw lastError;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Common utility for HTTP requests
   */
  protected async makeRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'DashMorph/1.0.0',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Extract authentication headers from credentials
   */
  protected getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.source.credentials) {
      if (this.source.credentials.apiKey) {
        headers['Authorization'] = `Bearer ${this.source.credentials.apiKey}`;
      }
      if (this.source.credentials.token) {
        headers['X-Access-Token'] = this.source.credentials.token;
      }
      if (this.source.credentials.username && this.source.credentials.password) {
        const auth = btoa(`${this.source.credentials.username}:${this.source.credentials.password}`);
        headers['Authorization'] = `Basic ${auth}`;
      }
    }

    return headers;
  }

  /**
   * Log extraction progress
   */
  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] [${this.source.type.toUpperCase()}] ${message}`, data || '');
  }
}

// Common extractor options
export interface ExtractorOptions {
  timeout?: number;
  retries?: number;
  includeData?: boolean;
  includeInteractions?: boolean;
  includeAssets?: boolean;
  precision?: 'low' | 'medium' | 'high';
  outputDir?: string;
}

// Common extraction utilities
export class ExtractionUtils {
  /**
   * Parse color values to hex format
   */
  static normalizeColor(color: string): string {
    if (color.startsWith('#')) return color;

    if (color.startsWith('rgb')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }

    if (color.startsWith('rgba')) {
      const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }

    // Named colors
    const namedColors: Record<string, string> = {
      red: '#ff0000',
      green: '#008000',
      blue: '#0000ff',
      black: '#000000',
      white: '#ffffff',
      gray: '#808080',
      // Add more as needed
    };

    return namedColors[color.toLowerCase()] || color;
  }

  /**
   * Parse font declarations
   */
  static parseFont(fontString: string): {
    family: string;
    size: number;
    weight: number;
    style: string;
  } {
    // Default values
    let family = 'Arial, sans-serif';
    let size = 14;
    let weight = 400;
    let style = 'normal';

    // Parse font string (simplified)
    const parts = fontString.split(' ');

    for (const part of parts) {
      if (part.includes('px') || part.includes('pt') || part.includes('em')) {
        size = parseFloat(part);
      } else if (['bold', 'normal', 'lighter', 'bolder'].includes(part)) {
        weight = part === 'bold' ? 700 : part === 'normal' ? 400 : parseInt(part) || 400;
      } else if (['italic', 'oblique', 'normal'].includes(part)) {
        style = part;
      } else if (part.includes(',')) {
        family = part.replace(/['"]/g, '');
      }
    }

    return { family, size, weight, style };
  }

  /**
   * Calculate relative position and size
   */
  static calculateBounds(
    element: { x: number; y: number; width: number; height: number },
    container: { width: number; height: number }
  ) {
    return {
      x: element.x / container.width,
      y: element.y / container.height,
      width: element.width / container.width,
      height: element.height / container.height,
      absolute: element
    };
  }

  /**
   * Detect component type from element properties
   */
  static detectComponentType(element: any): 'chart' | 'kpi' | 'table' | 'filter' | 'text' | 'layout' {
    // Check for chart indicators
    if (element.tagName === 'svg' || element.classList?.contains('chart')) {
      return 'chart';
    }

    // Check for table indicators
    if (element.tagName === 'table' || element.classList?.contains('table')) {
      return 'table';
    }

    // Check for filter indicators
    if (['select', 'input'].includes(element.tagName) || element.classList?.contains('filter')) {
      return 'filter';
    }

    // Check for KPI indicators (numbers, metrics)
    if (element.classList?.contains('metric') || element.classList?.contains('kpi')) {
      return 'kpi';
    }

    // Check for text content
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'].includes(element.tagName)) {
      return 'text';
    }

    // Default to layout
    return 'layout';
  }

  /**
   * Extract data attributes and properties
   */
  static extractDataBindings(element: any): any {
    const bindings: any = {};

    // Extract data attributes
    if (element.dataset) {
      Object.keys(element.dataset).forEach(key => {
        if (key.startsWith('data-')) {
          bindings[key.replace('data-', '')] = element.dataset[key];
        }
      });
    }

    // Extract common BI tool attributes
    const biAttributes = [
      'data-field', 'data-measure', 'data-dimension',
      'data-source', 'data-query', 'data-filter'
    ];

    biAttributes.forEach(attr => {
      const value = element.getAttribute?.(attr);
      if (value) {
        bindings[attr.replace('data-', '')] = value;
      }
    });

    return bindings;
  }
}