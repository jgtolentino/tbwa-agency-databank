/**
 * HTML/DOM Extractor - Analyzes existing HTML dashboards and websites
 */

import { JSDOM } from 'jsdom';
import { BaseExtractor } from './base/BaseExtractor';
import { DashboardSource, DissectedDashboard, ExtractedComponent, ExtractedStyles } from '../core/types';

export class HTMLExtractor extends BaseExtractor {
  private dom: JSDOM | null = null;
  private document: Document | null = null;

  async extract(): Promise<DissectedDashboard> {
    await this.validateSource();

    const startTime = Date.now();
    this.log('info', 'Starting HTML extraction', { source: this.source.url || this.source.file });

    try {
      // Load and parse HTML
      await this.loadHTML();

      // Extract components from DOM
      const components = await this.extractComponents();
      const designSystem = await this.extractDesignSystem();
      const layout = this.analyzeLayout();

      const dashboard: DissectedDashboard = {
        metadata: {
          title: this.extractTitle(),
          description: this.extractDescription(),
          source: this.source,
          extractedAt: new Date(),
          version: '1.0.0',
          tags: ['html', 'web', 'dom']
        },
        designSystem,
        layout,
        components,
        dataModel: {
          sources: [],
          relationships: [],
          measures: []
        },
        interactions: {
          crossFiltering: [],
          drillDowns: [],
          tooltips: [],
          exports: []
        }
      };

      const duration = Date.now() - startTime;
      this.log('info', 'HTML extraction completed', {
        duration,
        components: components.length,
        designTokens: Object.keys(designSystem.colors.primary).length
      });

      return dashboard;

    } catch (error) {
      this.log('error', 'HTML extraction failed', error);
      throw error;
    }
  }

  async validateSource(): Promise<boolean> {
    if (!this.source.url && !this.source.file) {
      throw new Error('HTML source requires either URL or file path');
    }

    if (this.source.url) {
      try {
        const response = await this.makeRequest(this.source.url);
        return response.ok;
      } catch (error) {
        throw new Error(`Cannot access URL: ${error}`);
      }
    }

    return true;
  }

  async getMetadata(): Promise<any> {
    if (!this.document) {
      await this.loadHTML();
    }

    return {
      title: this.extractTitle(),
      description: this.extractDescription(),
      url: this.source.url,
      lang: this.document?.documentElement.lang || 'en',
      charset: this.document?.characterSet || 'UTF-8',
      viewport: this.getViewportMeta(),
      scripts: this.getScriptSources(),
      stylesheets: this.getStylesheetLinks()
    };
  }

  private async loadHTML(): Promise<void> {
    let htmlContent: string;

    if (this.source.url) {
      // Fetch from URL
      const response = await this.makeRequest(this.source.url!);
      htmlContent = await response.text();
    } else if (this.source.file) {
      // Load from file
      const fs = await import('fs');
      htmlContent = fs.readFileSync(this.source.file, 'utf-8');
    } else {
      throw new Error('No HTML source provided');
    }

    // Parse with JSDOM
    this.dom = new JSDOM(htmlContent, {
      url: this.source.url,
      resources: 'usable',
      runScripts: 'outside-only'
    });

    this.document = this.dom.window.document;
  }

  private async extractComponents(): Promise<ExtractedComponent[]> {
    if (!this.document) throw new Error('HTML not loaded');

    const components: ExtractedComponent[] = [];

    // Find all potential dashboard components
    const candidateElements = this.findCandidateElements();

    for (const element of candidateElements) {
      const component = this.convertElementToComponent(element);
      if (component) {
        components.push(component);
      }
    }

    return components;
  }

  private findCandidateElements(): Element[] {
    if (!this.document) return [];

    const candidates: Element[] = [];

    // Dashboard component selectors
    const selectors = [
      // Common dashboard classes
      '[class*="dashboard"]',
      '[class*="widget"]',
      '[class*="chart"]',
      '[class*="graph"]',
      '[class*="metric"]',
      '[class*="kpi"]',
      '[class*="card"]',
      '[class*="panel"]',
      '[class*="table"]',
      '[class*="grid"]',
      '[class*="filter"]',

      // Common chart libraries
      '[class*="recharts"]',
      '[class*="chartjs"]',
      '[class*="d3"]',
      '[class*="plotly"]',
      '[class*="highcharts"]',

      // Semantic elements
      'section',
      'article',
      'aside',
      'main',

      // Canvas and SVG (likely charts)
      'canvas',
      'svg',

      // Tables
      'table',

      // Forms (filters)
      'form',
      'fieldset'
    ];

    for (const selector of selectors) {
      try {
        const elements = this.document.querySelectorAll(selector);
        candidates.push(...Array.from(elements));
      } catch (error) {
        // Ignore invalid selectors
      }
    }

    // Remove duplicates and nested elements
    return this.filterCandidates(candidates);
  }

  private filterCandidates(candidates: Element[]): Element[] {
    const filtered: Element[] = [];

    for (const candidate of candidates) {
      // Skip if this element is contained within another candidate
      const isNested = candidates.some(other =>
        other !== candidate && other.contains(candidate)
      );

      if (!isNested && this.isValidComponent(candidate)) {
        filtered.push(candidate);
      }
    }

    return filtered;
  }

  private isValidComponent(element: Element): boolean {
    const rect = this.getElementBounds(element);

    // Must have reasonable dimensions
    if (rect.width < 50 || rect.height < 30) {
      return false;
    }

    // Must be visible
    const computedStyle = this.dom?.window.getComputedStyle(element as any);
    if (computedStyle?.display === 'none' || computedStyle?.visibility === 'hidden') {
      return false;
    }

    return true;
  }

  private convertElementToComponent(element: Element): ExtractedComponent | null {
    const bounds = this.getElementBounds(element);
    const styles = this.extractElementStyles(element);

    return {
      id: this.generateElementId(element),
      type: this.inferElementType(element),
      name: this.getElementName(element),
      position: bounds,
      styles,
      data: this.extractElementData(element),
      interactions: this.extractElementInteractions(element),
      children: this.extractChildComponents(element)
    };
  }

  private getElementBounds(element: Element): { x: number; y: number; width: number; height: number } {
    if (this.dom?.window) {
      const rect = (element as any).getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      };
    }

    // Fallback for server-side
    return { x: 0, y: 0, width: 100, height: 50 };
  }

  private extractElementStyles(element: Element): ExtractedStyles {
    const computedStyle = this.dom?.window.getComputedStyle(element as any);

    const styles: ExtractedStyles = {
      colors: {
        primary: computedStyle?.color,
        background: computedStyle?.backgroundColor,
        palette: []
      },
      typography: {
        fontFamily: computedStyle?.fontFamily,
        fontSize: this.parsePx(computedStyle?.fontSize),
        fontWeight: this.parseFontWeight(computedStyle?.fontWeight),
        lineHeight: this.parseNumber(computedStyle?.lineHeight)
      },
      spacing: {
        margin: computedStyle?.margin,
        padding: computedStyle?.padding
      },
      borders: {
        width: this.parsePx(computedStyle?.borderWidth),
        style: computedStyle?.borderStyle,
        color: computedStyle?.borderColor,
        radius: this.parsePx(computedStyle?.borderRadius)
      },
      layout: {
        display: computedStyle?.display,
        flexDirection: computedStyle?.flexDirection,
        justifyContent: computedStyle?.justifyContent,
        alignItems: computedStyle?.alignItems,
        gridTemplateColumns: computedStyle?.gridTemplateColumns,
        gridTemplateRows: computedStyle?.gridTemplateRows
      }
    };

    return styles;
  }

  private inferElementType(element: Element): 'chart' | 'kpi' | 'table' | 'filter' | 'text' | 'layout' {
    const tagName = element.tagName.toLowerCase();
    const className = element.className.toLowerCase();
    const textContent = element.textContent?.toLowerCase() || '';

    // Chart indicators
    if (tagName === 'canvas' || tagName === 'svg' ||
        className.includes('chart') || className.includes('graph') ||
        className.includes('plot')) {
      return 'chart';
    }

    // Table indicators
    if (tagName === 'table' || className.includes('table') || className.includes('grid')) {
      return 'table';
    }

    // Filter indicators
    if (tagName === 'form' || tagName === 'select' || tagName === 'input' ||
        className.includes('filter') || className.includes('search')) {
      return 'filter';
    }

    // KPI indicators
    if (className.includes('metric') || className.includes('kpi') ||
        className.includes('score') || className.includes('total') ||
        /\d+/.test(textContent) && textContent.length < 20) {
      return 'kpi';
    }

    // Text indicators
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(tagName) &&
        element.children.length === 0) {
      return 'text';
    }

    return 'layout';
  }

  private generateElementId(element: Element): string {
    const id = element.id || element.getAttribute('data-id');
    if (id) return id;

    const className = element.className.split(' ')[0];
    const tagName = element.tagName.toLowerCase();
    const timestamp = Date.now().toString(36);

    return `${tagName}-${className || 'element'}-${timestamp}`;
  }

  private getElementName(element: Element): string {
    // Try various methods to get a meaningful name
    const title = element.getAttribute('title');
    if (title) return title;

    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const dataName = element.getAttribute('data-name');
    if (dataName) return dataName;

    const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading?.textContent) return heading.textContent.trim();

    const className = element.className.split(' ')[0];
    if (className) return className.replace(/[-_]/g, ' ');

    return element.tagName.toLowerCase();
  }

  private extractElementData(element: Element): any {
    return {
      source: 'dom-extraction',
      fields: [],
      aggregations: [],
      filters: [],
      transformations: []
    };
  }

  private extractElementInteractions(element: Element): any[] {
    const interactions: any[] = [];

    // Check for click handlers
    if (element.getAttribute('onclick') || element.getAttribute('data-click')) {
      interactions.push({
        trigger: 'click',
        action: 'custom',
        params: {}
      });
    }

    // Check for links
    if (element.tagName === 'A' || element.closest('a')) {
      interactions.push({
        trigger: 'click',
        action: 'navigate',
        params: {}
      });
    }

    return interactions;
  }

  private extractChildComponents(element: Element): ExtractedComponent[] {
    // For now, don't extract nested components to avoid deep recursion
    return [];
  }

  private extractDesignSystem(): any {
    if (!this.document) return {};

    const styles = this.document.querySelectorAll('style, link[rel="stylesheet"]');
    const colors = this.extractColorsFromCSS();
    const typography = this.extractTypographyFromCSS();

    return {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        neutral: colors.neutral,
        semantic: {
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8'
        },
        chart: colors.chart
      },
      typography,
      spacing: this.extractSpacingScale(),
      shadows: {},
      borderRadius: {},
      breakpoints: [
        { name: 'mobile', width: 768 },
        { name: 'tablet', width: 1024 },
        { name: 'desktop', width: 1440 }
      ]
    };
  }

  private analyzeLayout(): any {
    if (!this.document) return { type: 'flex' };

    const body = this.document.body;
    const computedStyle = this.dom?.window.getComputedStyle(body);

    if (computedStyle?.display === 'grid') {
      return {
        type: 'grid',
        columns: this.parseGridColumns(computedStyle.gridTemplateColumns),
        responsive: []
      };
    }

    if (computedStyle?.display === 'flex') {
      return {
        type: 'flex',
        responsive: []
      };
    }

    return {
      type: 'absolute',
      responsive: []
    };
  }

  private extractTitle(): string {
    return this.document?.title || 'Extracted HTML Dashboard';
  }

  private extractDescription(): string {
    const metaDesc = this.document?.querySelector('meta[name="description"]');
    return metaDesc?.getAttribute('content') || 'Extracted from HTML source';
  }

  private getViewportMeta(): string {
    const viewport = this.document?.querySelector('meta[name="viewport"]');
    return viewport?.getAttribute('content') || '';
  }

  private getScriptSources(): string[] {
    const scripts = this.document?.querySelectorAll('script[src]');
    return Array.from(scripts || []).map(script => script.getAttribute('src')).filter(Boolean) as string[];
  }

  private getStylesheetLinks(): string[] {
    const links = this.document?.querySelectorAll('link[rel="stylesheet"]');
    return Array.from(links || []).map(link => link.getAttribute('href')).filter(Boolean) as string[];
  }

  private extractColorsFromCSS(): any {
    // This would analyze stylesheets for color values
    return {
      primary: ['#007bff', '#0056b3'],
      secondary: ['#6c757d', '#545b62'],
      neutral: ['#ffffff', '#f8f9fa', '#dee2e6'],
      chart: ['#007bff', '#28a745', '#ffc107', '#dc3545']
    };
  }

  private extractTypographyFromCSS(): any {
    return {
      fontFamilies: {
        primary: 'system-ui, -apple-system, sans-serif'
      },
      fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24
      },
      fontWeights: {
        normal: 400,
        medium: 500,
        bold: 700
      },
      lineHeights: {
        tight: 1.2,
        normal: 1.5,
        loose: 1.8
      }
    };
  }

  private extractSpacingScale(): any {
    return {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32
    };
  }

  // Utility parsers
  private parsePx(value?: string): number {
    if (!value) return 0;
    return parseFloat(value.replace('px', '')) || 0;
  }

  private parseFontWeight(value?: string): number {
    if (!value) return 400;
    const weightMap: { [key: string]: number } = {
      'normal': 400,
      'bold': 700,
      'lighter': 300,
      'bolder': 600
    };
    return weightMap[value] || parseInt(value) || 400;
  }

  private parseNumber(value?: string): number {
    if (!value) return 1;
    return parseFloat(value) || 1;
  }

  private parseGridColumns(value?: string): number {
    if (!value) return 1;
    return value.split(' ').length;
  }
}