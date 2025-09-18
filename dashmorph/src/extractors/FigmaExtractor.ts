/**
 * Figma Design Extractor - Converts Figma designs to dissected dashboard components
 */

import { BaseExtractor } from './base/BaseExtractor';
import { DashboardSource, DissectedDashboard, ExtractedComponent, ExtractedStyles } from '../core/types';

export class FigmaExtractor extends BaseExtractor {
  private figmaApiKey: string;
  private fileKey: string;

  constructor(source: DashboardSource, options = {}) {
    super(source, options);
    this.figmaApiKey = source.credentials?.apiKey || process.env.FIGMA_ACCESS_TOKEN || '';
    this.fileKey = this.extractFileKey(source.url || '');
  }

  async extract(): Promise<DissectedDashboard> {
    await this.validateSource();

    const startTime = Date.now();
    this.log('info', 'Starting Figma extraction', { fileKey: this.fileKey });

    try {
      // Get file metadata and structure
      const fileData = await this.getFigmaFile();
      const components = await this.extractComponents(fileData);
      const designSystem = await this.extractDesignSystem(fileData);

      const dashboard: DissectedDashboard = {
        metadata: {
          title: fileData.name || 'Figma Dashboard',
          description: fileData.description || 'Extracted from Figma design',
          source: this.source,
          extractedAt: new Date(),
          version: '1.0.0',
          tags: ['figma', 'design-system']
        },
        designSystem,
        layout: this.analyzeLayout(fileData),
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
      this.log('info', 'Figma extraction completed', {
        duration,
        components: components.length,
        designTokens: Object.keys(designSystem.colors.primary).length
      });

      return dashboard;

    } catch (error) {
      this.log('error', 'Figma extraction failed', error);
      throw error;
    }
  }

  async validateSource(): Promise<boolean> {
    if (!this.figmaApiKey) {
      throw new Error('Figma API key is required');
    }

    if (!this.fileKey) {
      throw new Error('Invalid Figma URL: cannot extract file key');
    }

    // Test API connection
    try {
      await this.makeRequest(`https://api.figma.com/v1/files/${this.fileKey}`, {
        headers: this.getAuthHeaders()
      });
      return true;
    } catch (error) {
      throw new Error(`Figma API validation failed: ${error}`);
    }
  }

  async getMetadata(): Promise<any> {
    const fileData = await this.getFigmaFile();
    return {
      name: fileData.name,
      version: fileData.version,
      lastModified: fileData.lastModified,
      thumbnailUrl: fileData.thumbnailUrl,
      components: fileData.components ? Object.keys(fileData.components).length : 0,
      styles: fileData.styles ? Object.keys(fileData.styles).length : 0
    };
  }

  private extractFileKey(url: string): string {
    const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    return match ? match[1] : '';
  }

  private async getFigmaFile(): Promise<any> {
    const response = await this.makeRequest(
      `https://api.figma.com/v1/files/${this.fileKey}`,
      {
        headers: this.getAuthHeaders()
      }
    );

    return response.json();
  }

  private async extractComponents(fileData: any): Promise<ExtractedComponent[]> {
    const components: ExtractedComponent[] = [];

    // Traverse Figma node tree
    const traverseNodes = (nodes: any[], parentBounds = { x: 0, y: 0, width: 1920, height: 1080 }) => {
      for (const node of nodes) {
        if (this.isComponentNode(node)) {
          const component = this.convertFigmaNodeToComponent(node, parentBounds);
          components.push(component);
        }

        // Recursively process children
        if (node.children) {
          traverseNodes(node.children, this.getNodeBounds(node));
        }
      }
    };

    // Start traversal from canvas
    if (fileData.document && fileData.document.children) {
      for (const canvas of fileData.document.children) {
        if (canvas.children) {
          traverseNodes(canvas.children);
        }
      }
    }

    return components;
  }

  private isComponentNode(node: any): boolean {
    // Identify nodes that represent dashboard components
    const componentTypes = ['FRAME', 'COMPONENT', 'INSTANCE', 'GROUP'];
    const dashboardKeywords = ['chart', 'graph', 'table', 'card', 'dashboard', 'widget', 'metric', 'kpi'];

    if (!componentTypes.includes(node.type)) {
      return false;
    }

    // Check if node name suggests it's a dashboard component
    const nodeName = (node.name || '').toLowerCase();
    return dashboardKeywords.some(keyword => nodeName.includes(keyword)) ||
           node.componentId || // Figma component instances
           (node.absoluteBoundingBox &&
            node.absoluteBoundingBox.width > 100 &&
            node.absoluteBoundingBox.height > 50); // Reasonable component size
  }

  private convertFigmaNodeToComponent(node: any, parentBounds: any): ExtractedComponent {
    const bounds = node.absoluteBoundingBox || { x: 0, y: 0, width: 100, height: 100 };

    return {
      id: node.id,
      type: this.inferComponentType(node),
      name: node.name || 'Unnamed Component',
      position: {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      },
      styles: this.extractNodeStyles(node),
      data: this.extractDataBindings(node),
      interactions: this.extractInteractions(node),
      children: node.children ? node.children.map((child: any) =>
        this.convertFigmaNodeToComponent(child, bounds)
      ) : []
    };
  }

  private inferComponentType(node: any): 'chart' | 'kpi' | 'table' | 'filter' | 'text' | 'layout' {
    const nodeName = (node.name || '').toLowerCase();

    // Chart indicators
    if (nodeName.includes('chart') || nodeName.includes('graph') ||
        nodeName.includes('pie') || nodeName.includes('bar') ||
        nodeName.includes('line')) {
      return 'chart';
    }

    // KPI indicators
    if (nodeName.includes('metric') || nodeName.includes('kpi') ||
        nodeName.includes('score') || nodeName.includes('total')) {
      return 'kpi';
    }

    // Table indicators
    if (nodeName.includes('table') || nodeName.includes('list') ||
        nodeName.includes('grid')) {
      return 'table';
    }

    // Filter indicators
    if (nodeName.includes('filter') || nodeName.includes('select') ||
        nodeName.includes('dropdown')) {
      return 'filter';
    }

    // Text indicators
    if (node.type === 'TEXT' || nodeName.includes('title') ||
        nodeName.includes('label') || nodeName.includes('heading')) {
      return 'text';
    }

    return 'layout';
  }

  private extractNodeStyles(node: any): ExtractedStyles {
    const styles: ExtractedStyles = {
      colors: {
        palette: []
      },
      typography: {},
      spacing: {},
      borders: {},
      layout: {}
    };

    // Extract fills (colors)
    if (node.fills && node.fills.length > 0) {
      const primaryFill = node.fills[0];
      if (primaryFill.type === 'SOLID') {
        styles.colors.primary = this.rgbaToHex(primaryFill.color, primaryFill.opacity);
      }
    }

    // Extract strokes (borders)
    if (node.strokes && node.strokes.length > 0) {
      const stroke = node.strokes[0];
      styles.borders = {
        width: node.strokeWeight || 1,
        color: stroke.type === 'SOLID' ? this.rgbaToHex(stroke.color, stroke.opacity) : undefined,
        style: 'solid'
      };
    }

    // Extract corner radius
    if (node.cornerRadius !== undefined) {
      styles.borders = {
        ...styles.borders,
        radius: node.cornerRadius
      };
    }

    // Extract typography (for text nodes)
    if (node.style) {
      styles.typography = {
        fontFamily: node.style.fontFamily,
        fontSize: node.style.fontSize,
        fontWeight: node.style.fontWeight,
        lineHeight: node.style.lineHeightPx / node.style.fontSize
      };
    }

    // Extract layout properties
    if (node.layoutMode) {
      styles.layout = {
        display: 'flex',
        flexDirection: node.layoutMode === 'VERTICAL' ? 'column' : 'row',
        justifyContent: this.mapFigmaAlignment(node.primaryAxisAlignMode),
        alignItems: this.mapFigmaAlignment(node.counterAxisAlignMode)
      };
    }

    return styles;
  }

  private extractDesignSystem(fileData: any): any {
    const designSystem = {
      colors: {
        primary: [],
        secondary: [],
        neutral: [],
        semantic: {
          success: '#00C851',
          warning: '#FF8800',
          error: '#FF4444',
          info: '#33B5E5'
        },
        chart: []
      },
      typography: {
        fontFamilies: {
          primary: 'Inter, sans-serif'
        },
        fontSizes: {},
        fontWeights: {},
        lineHeights: {}
      },
      spacing: {},
      shadows: {},
      borderRadius: {},
      breakpoints: [
        { name: 'mobile', width: 768 },
        { name: 'tablet', width: 1024 },
        { name: 'desktop', width: 1440 }
      ]
    };

    // Extract design tokens from Figma styles
    if (fileData.styles) {
      Object.values(fileData.styles).forEach((style: any) => {
        if (style.styleType === 'FILL') {
          designSystem.colors.primary.push(style.name);
        } else if (style.styleType === 'TEXT') {
          // Extract typography tokens
        }
      });
    }

    return designSystem;
  }

  private analyzeLayout(fileData: any): any {
    return {
      type: 'flex',
      responsive: [
        {
          breakpoint: 'desktop',
          layout: { type: 'grid', columns: 12 }
        },
        {
          breakpoint: 'tablet',
          layout: { type: 'grid', columns: 8 }
        },
        {
          breakpoint: 'mobile',
          layout: { type: 'flex' }
        }
      ]
    };
  }

  private extractDataBindings(node: any): any {
    // Extract any data binding information from component properties
    return {
      source: 'figma-design',
      fields: [],
      aggregations: [],
      filters: [],
      transformations: []
    };
  }

  private extractInteractions(node: any): any[] {
    const interactions: any[] = [];

    // Extract prototype interactions
    if (node.transitionNodeID) {
      interactions.push({
        trigger: 'click',
        action: 'navigate',
        target: node.transitionNodeID
      });
    }

    return interactions;
  }

  private getNodeBounds(node: any): any {
    return node.absoluteBoundingBox || { x: 0, y: 0, width: 100, height: 100 };
  }

  private rgbaToHex(color: any, opacity = 1): string {
    if (!color) return '#000000';

    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private mapFigmaAlignment(alignment: string): string {
    const alignmentMap: { [key: string]: string } = {
      'MIN': 'flex-start',
      'CENTER': 'center',
      'MAX': 'flex-end',
      'SPACE_BETWEEN': 'space-between'
    };

    return alignmentMap[alignment] || 'flex-start';
  }

  protected getAuthHeaders(): Record<string, string> {
    return {
      'X-Figma-Token': this.figmaApiKey,
      'Content-Type': 'application/json'
    };
  }
}