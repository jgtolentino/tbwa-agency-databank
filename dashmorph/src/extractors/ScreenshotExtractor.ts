/**
 * Screenshot Extractor - OCR and computer vision analysis of dashboard images
 */

import { createWorker } from 'tesseract.js';
import * as Vibrant from 'node-vibrant';
import { BaseExtractor } from './base/BaseExtractor';
import { DashboardSource, DissectedDashboard, ExtractedComponent, ExtractedStyles } from '../core/types';

export class ScreenshotExtractor extends BaseExtractor {
  private imagePath: string;
  private ocrWorker: any = null;

  constructor(source: DashboardSource, options = {}) {
    super(source, options);
    this.imagePath = source.file || source.url || '';
  }

  async extract(): Promise<DissectedDashboard> {
    await this.validateSource();

    const startTime = Date.now();
    this.log('info', 'Starting screenshot extraction', { image: this.imagePath });

    try {
      // Initialize OCR worker
      await this.initializeOCR();

      // Analyze image composition
      const imageAnalysis = await this.analyzeImage();

      // Extract text and layout
      const ocrResults = await this.performOCR();

      // Detect UI components
      const components = await this.detectComponents(imageAnalysis, ocrResults);

      // Extract color palette
      const colorPalette = await this.extractColors();

      const dashboard: DissectedDashboard = {
        metadata: {
          title: this.extractTitleFromOCR(ocrResults) || 'Screenshot Dashboard',
          description: 'Extracted from screenshot using computer vision',
          source: this.source,
          extractedAt: new Date(),
          version: '1.0.0',
          tags: ['screenshot', 'ocr', 'computer-vision']
        },
        designSystem: this.buildDesignSystem(colorPalette, imageAnalysis),
        layout: this.inferLayout(components),
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

      await this.cleanupOCR();

      const duration = Date.now() - startTime;
      this.log('info', 'Screenshot extraction completed', {
        duration,
        components: components.length,
        textBlocks: ocrResults.data.paragraphs?.length || 0
      });

      return dashboard;

    } catch (error) {
      this.log('error', 'Screenshot extraction failed', error);
      await this.cleanupOCR();
      throw error;
    }
  }

  async validateSource(): Promise<boolean> {
    if (!this.imagePath) {
      throw new Error('Screenshot source requires image file or URL');
    }

    // Check if file exists or URL is accessible
    if (this.imagePath.startsWith('http')) {
      try {
        const response = await this.makeRequest(this.imagePath);
        return response.ok;
      } catch (error) {
        throw new Error(`Cannot access image URL: ${error}`);
      }
    } else {
      const fs = await import('fs');
      if (!fs.existsSync(this.imagePath)) {
        throw new Error(`Image file not found: ${this.imagePath}`);
      }
    }

    return true;
  }

  async getMetadata(): Promise<any> {
    const sharp = await import('sharp');
    let metadata;

    try {
      if (this.imagePath.startsWith('http')) {
        const response = await this.makeRequest(this.imagePath);
        const buffer = await response.arrayBuffer();
        metadata = await sharp.default(Buffer.from(buffer)).metadata();
      } else {
        metadata = await sharp.default(this.imagePath).metadata();
      }

      return {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        channels: metadata.channels,
        density: metadata.density,
        hasAlpha: metadata.hasAlpha
      };
    } catch (error) {
      return { error: `Failed to read image metadata: ${error}` };
    }
  }

  private async initializeOCR(): Promise<void> {
    this.ocrWorker = await createWorker('eng');
    await this.ocrWorker.setParameters({
      tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?@#$%^&*()_+-=[]{}|;:,.<>/?~ ',
      tessedit_pageseg_mode: '6' // Uniform block of text
    });
  }

  private async cleanupOCR(): Promise<void> {
    if (this.ocrWorker) {
      await this.ocrWorker.terminate();
      this.ocrWorker = null;
    }
  }

  private async analyzeImage(): Promise<any> {
    const sharp = await import('sharp');
    let imageBuffer: Buffer;

    // Get image buffer
    if (this.imagePath.startsWith('http')) {
      const response = await this.makeRequest(this.imagePath);
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      const fs = await import('fs');
      imageBuffer = fs.readFileSync(this.imagePath);
    }

    // Analyze image properties
    const metadata = await sharp.default(imageBuffer).metadata();
    const stats = await sharp.default(imageBuffer).stats();

    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format,
      channels: metadata.channels || 3,
      stats,
      aspectRatio: (metadata.width || 1) / (metadata.height || 1)
    };
  }

  private async performOCR(): Promise<any> {
    if (!this.ocrWorker) {
      throw new Error('OCR worker not initialized');
    }

    const result = await this.ocrWorker.recognize(this.imagePath);
    return result;
  }

  private async detectComponents(imageAnalysis: any, ocrResults: any): Promise<ExtractedComponent[]> {
    const components: ExtractedComponent[] = [];

    // Analyze text blocks to identify potential components
    if (ocrResults.data?.paragraphs) {
      for (const paragraph of ocrResults.data.paragraphs) {
        const component = this.createComponentFromTextBlock(paragraph, imageAnalysis);
        if (component) {
          components.push(component);
        }
      }
    }

    // Detect chart-like regions (areas with fewer text blocks)
    const chartRegions = this.detectChartRegions(imageAnalysis, ocrResults);
    components.push(...chartRegions);

    // Detect layout containers
    const layoutComponents = this.detectLayoutComponents(imageAnalysis, components);
    components.push(...layoutComponents);

    return components;
  }

  private createComponentFromTextBlock(paragraph: any, imageAnalysis: any): ExtractedComponent | null {
    const bbox = paragraph.bbox;
    if (!bbox || bbox.x1 - bbox.x0 < 20 || bbox.y1 - bbox.y0 < 10) {
      return null; // Too small to be meaningful
    }

    const text = paragraph.text?.trim();
    if (!text || text.length < 2) {
      return null;
    }

    const width = bbox.x1 - bbox.x0;
    const height = bbox.y1 - bbox.y0;

    return {
      id: `ocr-${bbox.x0}-${bbox.y0}`,
      type: this.inferComponentTypeFromText(text, width, height),
      name: text.length > 30 ? text.substring(0, 30) + '...' : text,
      position: {
        x: bbox.x0,
        y: bbox.y0,
        width,
        height
      },
      styles: {
        colors: {
          palette: []
        },
        typography: {
          fontSize: this.estimateFontSize(height)
        },
        spacing: {},
        borders: {},
        layout: {}
      },
      data: {
        source: 'ocr-extracted',
        fields: [],
        aggregations: [],
        filters: [],
        transformations: []
      },
      interactions: [],
      children: []
    };
  }

  private inferComponentTypeFromText(text: string, width: number, height: number): 'chart' | 'kpi' | 'table' | 'filter' | 'text' | 'layout' {
    const lowerText = text.toLowerCase();

    // Check for numeric KPIs
    const isNumeric = /^\$?\d{1,3}(,?\d{3})*(\.\d{2})?%?$/.test(text.trim());
    const hasNumbers = /\d/.test(text);

    if (isNumeric || (hasNumbers && text.length < 20 && height < 40)) {
      return 'kpi';
    }

    // Check for filter indicators
    if (lowerText.includes('filter') || lowerText.includes('select') ||
        lowerText.includes('dropdown') || lowerText.includes('search')) {
      return 'filter';
    }

    // Check for table headers
    if (width > 100 && height < 30 && text.includes('\t')) {
      return 'table';
    }

    // Check for chart labels
    if (lowerText.includes('chart') || lowerText.includes('graph') ||
        hasNumbers && width > 200) {
      return 'chart';
    }

    return 'text';
  }

  private detectChartRegions(imageAnalysis: any, ocrResults: any): ExtractedComponent[] {
    const charts: ExtractedComponent[] = [];

    // This is a simplified approach - in a full implementation,
    // you'd use computer vision to detect chart patterns
    const imageWidth = imageAnalysis.width;
    const imageHeight = imageAnalysis.height;

    // Look for regions with minimal text (likely charts)
    const textBlocks = ocrResults.data?.paragraphs || [];
    const gridSize = 50;
    const grid: number[][] = [];

    // Initialize grid
    for (let i = 0; i < Math.ceil(imageHeight / gridSize); i++) {
      grid[i] = new Array(Math.ceil(imageWidth / gridSize)).fill(0);
    }

    // Mark grid cells with text
    for (const block of textBlocks) {
      if (block.bbox) {
        const startX = Math.floor(block.bbox.x0 / gridSize);
        const startY = Math.floor(block.bbox.y0 / gridSize);
        const endX = Math.floor(block.bbox.x1 / gridSize);
        const endY = Math.floor(block.bbox.y1 / gridSize);

        for (let y = startY; y <= endY && y < grid.length; y++) {
          for (let x = startX; x <= endX && x < grid[y].length; x++) {
            grid[y][x] = 1;
          }
        }
      }
    }

    // Find large empty regions (potential charts)
    for (let y = 0; y < grid.length - 3; y++) {
      for (let x = 0; x < grid[y].length - 3; x++) {
        let isEmpty = true;
        let minSize = 4; // Minimum 4x4 grid cells

        for (let dy = 0; dy < minSize && y + dy < grid.length; dy++) {
          for (let dx = 0; dx < minSize && x + dx < grid[y + dy].length; dx++) {
            if (grid[y + dy][x + dx] === 1) {
              isEmpty = false;
              break;
            }
          }
          if (!isEmpty) break;
        }

        if (isEmpty) {
          charts.push({
            id: `chart-region-${x}-${y}`,
            type: 'chart',
            name: 'Detected Chart Area',
            position: {
              x: x * gridSize,
              y: y * gridSize,
              width: minSize * gridSize,
              height: minSize * gridSize
            },
            styles: {
              colors: { palette: [] },
              typography: {},
              spacing: {},
              borders: {},
              layout: {}
            },
            data: {
              source: 'vision-detected',
              fields: [],
              aggregations: [],
              filters: [],
              transformations: []
            },
            interactions: [],
            children: []
          });

          // Mark this region as used
          for (let dy = 0; dy < minSize; dy++) {
            for (let dx = 0; dx < minSize; dx++) {
              if (y + dy < grid.length && x + dx < grid[y + dy].length) {
                grid[y + dy][x + dx] = 1;
              }
            }
          }
        }
      }
    }

    return charts;
  }

  private detectLayoutComponents(imageAnalysis: any, existingComponents: ExtractedComponent[]): ExtractedComponent[] {
    const layouts: ExtractedComponent[] = [];

    // Create a main container
    layouts.push({
      id: 'main-container',
      type: 'layout',
      name: 'Main Dashboard Container',
      position: {
        x: 0,
        y: 0,
        width: imageAnalysis.width,
        height: imageAnalysis.height
      },
      styles: {
        colors: { palette: [] },
        typography: {},
        spacing: {},
        borders: {},
        layout: {
          display: 'grid'
        }
      },
      data: {
        source: 'layout-detection',
        fields: [],
        aggregations: [],
        filters: [],
        transformations: []
      },
      interactions: [],
      children: []
    });

    return layouts;
  }

  private async extractColors(): Promise<any> {
    try {
      const palette = await Vibrant.from(this.imagePath).getPalette();

      const colors = {
        primary: [],
        secondary: [],
        neutral: [],
        chart: []
      };

      if (palette.Vibrant) colors.primary.push(palette.Vibrant.hex);
      if (palette.Muted) colors.secondary.push(palette.Muted.hex);
      if (palette.DarkVibrant) colors.chart.push(palette.DarkVibrant.hex);
      if (palette.LightVibrant) colors.chart.push(palette.LightVibrant.hex);
      if (palette.DarkMuted) colors.neutral.push(palette.DarkMuted.hex);
      if (palette.LightMuted) colors.neutral.push(palette.LightMuted.hex);

      return colors;
    } catch (error) {
      this.log('warn', 'Color extraction failed, using defaults', error);
      return {
        primary: ['#007bff'],
        secondary: ['#6c757d'],
        neutral: ['#ffffff', '#f8f9fa'],
        chart: ['#007bff', '#28a745', '#ffc107', '#dc3545']
      };
    }
  }

  private buildDesignSystem(colorPalette: any, imageAnalysis: any): any {
    return {
      colors: {
        primary: colorPalette.primary,
        secondary: colorPalette.secondary,
        neutral: colorPalette.neutral,
        semantic: {
          success: '#28a745',
          warning: '#ffc107',
          error: '#dc3545',
          info: '#17a2b8'
        },
        chart: colorPalette.chart
      },
      typography: {
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
          bold: 700
        },
        lineHeights: {
          normal: 1.5
        }
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32
      },
      shadows: {},
      borderRadius: {},
      breakpoints: [
        { name: 'mobile', width: 768 },
        { name: 'tablet', width: 1024 },
        { name: 'desktop', width: imageAnalysis.width || 1440 }
      ]
    };
  }

  private inferLayout(components: ExtractedComponent[]): any {
    // Simple grid detection based on component positions
    const hasGridPattern = this.detectGridPattern(components);

    if (hasGridPattern) {
      return {
        type: 'grid',
        columns: hasGridPattern.columns,
        rows: hasGridPattern.rows,
        responsive: []
      };
    }

    return {
      type: 'absolute',
      responsive: []
    };
  }

  private detectGridPattern(components: ExtractedComponent[]): { columns: number; rows: number } | null {
    if (components.length < 4) return null;

    // Group components by approximate Y positions (rows)
    const tolerance = 20;
    const rows: ExtractedComponent[][] = [];

    for (const component of components) {
      let addedToRow = false;
      for (const row of rows) {
        if (Math.abs(row[0].position.y - component.position.y) <= tolerance) {
          row.push(component);
          addedToRow = true;
          break;
        }
      }
      if (!addedToRow) {
        rows.push([component]);
      }
    }

    // Check if we have a regular grid
    const maxColumns = Math.max(...rows.map(row => row.length));
    const minColumns = Math.min(...rows.map(row => row.length));

    if (rows.length >= 2 && maxColumns >= 2 && maxColumns - minColumns <= 1) {
      return {
        rows: rows.length,
        columns: maxColumns
      };
    }

    return null;
  }

  private extractTitleFromOCR(ocrResults: any): string | null {
    if (!ocrResults.data?.paragraphs) return null;

    // Look for the largest text block in the top 20% of the image
    const topBlocks = ocrResults.data.paragraphs.filter((p: any) =>
      p.bbox && p.bbox.y0 < (ocrResults.data.height || 1000) * 0.2
    );

    if (topBlocks.length === 0) return null;

    // Find the block with the largest font size (estimated by height)
    const titleBlock = topBlocks.reduce((largest: any, current: any) => {
      const currentHeight = current.bbox.y1 - current.bbox.y0;
      const largestHeight = largest.bbox.y1 - largest.bbox.y0;
      return currentHeight > largestHeight ? current : largest;
    });

    return titleBlock.text?.trim() || null;
  }

  private estimateFontSize(textHeight: number): number {
    // Rough estimation: text height is usually about 1.2-1.5x font size
    return Math.round(textHeight / 1.3);
  }
}