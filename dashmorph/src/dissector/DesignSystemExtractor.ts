/**
 * Design System Extractor - Analyzes and extracts design tokens from dashboard components
 */

import { DissectedDashboard, DesignSystem, ExtractedComponent, DissectOptions } from '../core/types';

export class DesignSystemExtractor {
  async extract(dashboard: DissectedDashboard, options: DissectOptions = {}): Promise<DesignSystem> {
    const components = dashboard.components;

    const designSystem: DesignSystem = {
      colors: await this.extractColorPalette(components),
      typography: this.extractTypographyScale(components),
      spacing: this.extractSpacingScale(components),
      shadows: this.extractShadowScale(components),
      borderRadius: this.extractBorderRadiusScale(components),
      breakpoints: this.extractBreakpoints(components)
    };

    // Apply consistency normalization
    this.normalizeDesignSystem(designSystem);

    return designSystem;
  }

  private async extractColorPalette(components: ExtractedComponent[]): Promise<any> {
    const colorFrequency = new Map<string, number>();
    const colorsByContext = {
      background: new Set<string>(),
      text: new Set<string>(),
      border: new Set<string>(),
      primary: new Set<string>(),
      accent: new Set<string>()
    };

    // Collect all colors from components
    components.forEach(component => {
      this.collectColorsFromComponent(component, colorFrequency, colorsByContext);
    });

    // Analyze and categorize colors
    const sortedColors = Array.from(colorFrequency.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .map(([color]) => color);

    return {
      primary: this.extractPrimaryColors(sortedColors, colorsByContext),
      secondary: this.extractSecondaryColors(sortedColors, colorsByContext),
      neutral: this.extractNeutralColors(sortedColors, colorsByContext),
      semantic: this.extractSemanticColors(sortedColors, colorsByContext),
      chart: this.extractChartColors(components)
    };
  }

  private collectColorsFromComponent(
    component: ExtractedComponent,
    colorFrequency: Map<string, number>,
    colorsByContext: any
  ): void {
    const styles = component.styles;

    // Background colors
    if (styles.colors?.background) {
      const color = this.normalizeColor(styles.colors.background);
      if (color) {
        colorFrequency.set(color, (colorFrequency.get(color) || 0) + 1);
        colorsByContext.background.add(color);
      }
    }

    // Text colors
    if (styles.colors?.text) {
      const color = this.normalizeColor(styles.colors.text);
      if (color) {
        colorFrequency.set(color, (colorFrequency.get(color) || 0) + 1);
        colorsByContext.text.add(color);
      }
    }

    // Primary colors
    if (styles.colors?.primary) {
      const color = this.normalizeColor(styles.colors.primary);
      if (color) {
        colorFrequency.set(color, (colorFrequency.get(color) || 0) + 2); // Weight primary colors higher
        colorsByContext.primary.add(color);
      }
    }

    // Border colors
    if (styles.borders?.color) {
      const color = this.normalizeColor(styles.borders.color);
      if (color) {
        colorFrequency.set(color, (colorFrequency.get(color) || 0) + 1);
        colorsByContext.border.add(color);
      }
    }

    // Palette colors
    if (styles.colors?.palette) {
      styles.colors.palette.forEach((paletteColor: string) => {
        const color = this.normalizeColor(paletteColor);
        if (color) {
          colorFrequency.set(color, (colorFrequency.get(color) || 0) + 1);
        }
      });
    }

    // Recursively process children
    if (component.children) {
      component.children.forEach(child =>
        this.collectColorsFromComponent(child, colorFrequency, colorsByContext)
      );
    }
  }

  private normalizeColor(color: string): string | null {
    if (!color || color === 'transparent' || color === 'inherit') {
      return null;
    }

    // Convert to hex format
    const hexColor = this.toHex(color);
    return hexColor;
  }

  private toHex(color: string): string {
    // If already hex, return as-is
    if (color.startsWith('#')) {
      return color.toLowerCase();
    }

    // Convert rgb/rgba to hex
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    // Named colors
    const namedColors: { [key: string]: string } = {
      black: '#000000',
      white: '#ffffff',
      red: '#ff0000',
      green: '#008000',
      blue: '#0000ff',
      yellow: '#ffff00',
      cyan: '#00ffff',
      magenta: '#ff00ff',
      silver: '#c0c0c0',
      gray: '#808080',
      grey: '#808080'
    };

    return namedColors[color.toLowerCase()] || color;
  }

  private extractPrimaryColors(sortedColors: string[], colorsByContext: any): string[] {
    const primaryColors: string[] = [];

    // Use colors marked as primary
    colorsByContext.primary.forEach((color: string) => {
      if (!primaryColors.includes(color)) {
        primaryColors.push(color);
      }
    });

    // Add most frequent non-neutral colors
    for (const color of sortedColors) {
      if (primaryColors.length >= 3) break;
      if (!this.isNeutralColor(color) && !primaryColors.includes(color)) {
        primaryColors.push(color);
      }
    }

    return primaryColors.slice(0, 3);
  }

  private extractSecondaryColors(sortedColors: string[], colorsByContext: any): string[] {
    const primaryColors = this.extractPrimaryColors(sortedColors, colorsByContext);
    const secondaryColors: string[] = [];

    for (const color of sortedColors) {
      if (secondaryColors.length >= 3) break;
      if (!this.isNeutralColor(color) &&
          !primaryColors.includes(color) &&
          !secondaryColors.includes(color)) {
        secondaryColors.push(color);
      }
    }

    return secondaryColors;
  }

  private extractNeutralColors(sortedColors: string[], colorsByContext: any): string[] {
    const neutralColors: string[] = [];

    for (const color of sortedColors) {
      if (this.isNeutralColor(color) && !neutralColors.includes(color)) {
        neutralColors.push(color);
      }
    }

    return neutralColors.slice(0, 5);
  }

  private extractSemanticColors(sortedColors: string[], colorsByContext: any): any {
    return {
      success: this.findSemanticColor(sortedColors, 'success') || '#28a745',
      warning: this.findSemanticColor(sortedColors, 'warning') || '#ffc107',
      error: this.findSemanticColor(sortedColors, 'error') || '#dc3545',
      info: this.findSemanticColor(sortedColors, 'info') || '#17a2b8'
    };
  }

  private extractChartColors(components: ExtractedComponent[]): string[] {
    const chartColors = new Set<string>();

    components
      .filter(component => component.type === 'chart')
      .forEach(chart => {
        if (chart.styles.colors?.palette) {
          chart.styles.colors.palette.forEach((color: string) => {
            const normalizedColor = this.normalizeColor(color);
            if (normalizedColor) {
              chartColors.add(normalizedColor);
            }
          });
        }
      });

    // Default chart palette if none found
    if (chartColors.size === 0) {
      return ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#e83e8c', '#20c997', '#fd7e14'];
    }

    return Array.from(chartColors).slice(0, 8);
  }

  private isNeutralColor(color: string): boolean {
    // Simple heuristic: check if color is grayscale
    const hex = color.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);

      // Check if RGB values are close to each other (grayscale)
      const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
      return maxDiff < 30;
    }

    return false;
  }

  private findSemanticColor(colors: string[], semantic: string): string | null {
    // Simple heuristic based on color ranges
    const semanticRanges = {
      success: { hue: [90, 150], saturation: [40, 100] }, // Green range
      warning: { hue: [35, 60], saturation: [70, 100] },  // Yellow/Orange range
      error: { hue: [330, 30], saturation: [70, 100] },   // Red range
      info: { hue: [180, 240], saturation: [50, 100] }    // Blue range
    };

    const range = semanticRanges[semantic as keyof typeof semanticRanges];
    if (!range) return null;

    for (const color of colors) {
      const hsl = this.hexToHsl(color);
      if (hsl && this.isInRange(hsl.h, range.hue) && this.isInRange(hsl.s, range.saturation)) {
        return color;
      }
    }

    return null;
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } | null {
    const r = parseInt(hex.substr(1, 2), 16) / 255;
    const g = parseInt(hex.substr(3, 2), 16) / 255;
    const b = parseInt(hex.substr(5, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private isInRange(value: number, range: number[]): boolean {
    if (range[0] > range[1]) {
      // Handle wraparound (e.g., red hue range 330-30)
      return value >= range[0] || value <= range[1];
    }
    return value >= range[0] && value <= range[1];
  }

  private extractTypographyScale(components: ExtractedComponent[]): any {
    const fontFamilies = new Set<string>();
    const fontSizes = new Set<number>();
    const fontWeights = new Set<number>();
    const lineHeights = new Set<number>();

    // Collect typography data
    components.forEach(component => {
      this.collectTypographyFromComponent(component, fontFamilies, fontSizes, fontWeights, lineHeights);
    });

    return {
      fontFamilies: {
        primary: this.getMostCommonFontFamily(fontFamilies),
        secondary: this.getSecondaryFontFamily(fontFamilies),
        monospace: this.getMonospaceFont(fontFamilies)
      },
      fontSizes: this.createFontSizeScale(Array.from(fontSizes)),
      fontWeights: this.createFontWeightScale(Array.from(fontWeights)),
      lineHeights: this.createLineHeightScale(Array.from(lineHeights))
    };
  }

  private collectTypographyFromComponent(
    component: ExtractedComponent,
    fontFamilies: Set<string>,
    fontSizes: Set<number>,
    fontWeights: Set<number>,
    lineHeights: Set<number>
  ): void {
    const typography = component.styles.typography;

    if (typography?.fontFamily) {
      fontFamilies.add(typography.fontFamily);
    }
    if (typography?.fontSize && typography.fontSize > 0) {
      fontSizes.add(typography.fontSize);
    }
    if (typography?.fontWeight && typography.fontWeight > 0) {
      fontWeights.add(typography.fontWeight);
    }
    if (typography?.lineHeight && typography.lineHeight > 0) {
      lineHeights.add(typography.lineHeight);
    }

    if (component.children) {
      component.children.forEach(child =>
        this.collectTypographyFromComponent(child, fontFamilies, fontSizes, fontWeights, lineHeights)
      );
    }
  }

  private getMostCommonFontFamily(fontFamilies: Set<string>): string {
    if (fontFamilies.size === 0) return 'system-ui, -apple-system, sans-serif';
    return Array.from(fontFamilies)[0]; // Simplified - would use frequency in real implementation
  }

  private getSecondaryFontFamily(fontFamilies: Set<string>): string | undefined {
    const families = Array.from(fontFamilies);
    return families.length > 1 ? families[1] : undefined;
  }

  private getMonospaceFont(fontFamilies: Set<string>): string | undefined {
    const monospaceFonts = ['Monaco', 'Menlo', 'Consolas', 'monospace'];
    for (const family of fontFamilies) {
      if (monospaceFonts.some(mono => family.toLowerCase().includes(mono.toLowerCase()))) {
        return family;
      }
    }
    return undefined;
  }

  private createFontSizeScale(fontSizes: number[]): Record<string, number> {
    if (fontSizes.length === 0) {
      return { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, xxl: 32 };
    }

    const sorted = fontSizes.sort((a, b) => a - b);
    const scale: Record<string, number> = {};
    const labels = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    // Map sorted sizes to scale labels
    sorted.forEach((size, index) => {
      if (index < labels.length) {
        scale[labels[index]] = size;
      }
    });

    return scale;
  }

  private createFontWeightScale(fontWeights: number[]): Record<string, number> {
    const weightMap: Record<string, number> = {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    };

    if (fontWeights.length === 0) {
      return { normal: 400, medium: 500, bold: 700 };
    }

    const result: Record<string, number> = {};
    const sorted = fontWeights.sort((a, b) => a - b);

    // Map weights to nearest standard weights
    sorted.forEach(weight => {
      const entry = Object.entries(weightMap).find(([, value]) => Math.abs(value - weight) < 50);
      if (entry && !result[entry[0]]) {
        result[entry[0]] = weight;
      }
    });

    return result;
  }

  private createLineHeightScale(lineHeights: number[]): Record<string, number> {
    if (lineHeights.length === 0) {
      return { tight: 1.2, normal: 1.5, loose: 1.8 };
    }

    const sorted = lineHeights.sort((a, b) => a - b);
    const scale: Record<string, number> = {};

    if (sorted.length >= 1) scale.tight = sorted[0];
    if (sorted.length >= 2) scale.normal = sorted[Math.floor(sorted.length / 2)];
    if (sorted.length >= 3) scale.loose = sorted[sorted.length - 1];

    return scale;
  }

  private extractSpacingScale(components: ExtractedComponent[]): Record<string, number> {
    const spacingValues = new Set<number>();

    components.forEach(component => {
      this.collectSpacingFromComponent(component, spacingValues);
    });

    if (spacingValues.size === 0) {
      return { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
    }

    const sorted = Array.from(spacingValues).sort((a, b) => a - b);
    const scale: Record<string, number> = {};
    const labels = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    sorted.forEach((value, index) => {
      if (index < labels.length) {
        scale[labels[index]] = value;
      }
    });

    return scale;
  }

  private collectSpacingFromComponent(component: ExtractedComponent, spacingValues: Set<number>): void {
    const spacing = component.styles.spacing;

    if (spacing?.margin) {
      const marginValue = this.parseSpacingValue(spacing.margin);
      if (marginValue > 0) spacingValues.add(marginValue);
    }

    if (spacing?.padding) {
      const paddingValue = this.parseSpacingValue(spacing.padding);
      if (paddingValue > 0) spacingValues.add(paddingValue);
    }

    if (spacing?.gap && typeof spacing.gap === 'number') {
      spacingValues.add(spacing.gap);
    }

    if (component.children) {
      component.children.forEach(child =>
        this.collectSpacingFromComponent(child, spacingValues)
      );
    }
  }

  private parseSpacingValue(value: string | number): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/px|rem|em/, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  private extractShadowScale(components: ExtractedComponent[]): Record<string, string> {
    const shadows = new Set<string>();

    components.forEach(component => {
      if (component.styles.shadows) {
        component.styles.shadows.forEach((shadow: string) => shadows.add(shadow));
      }
    });

    if (shadows.size === 0) {
      return {
        sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
        md: '0 4px 6px rgba(0, 0, 0, 0.15)',
        lg: '0 10px 25px rgba(0, 0, 0, 0.2)',
        xl: '0 20px 40px rgba(0, 0, 0, 0.25)'
      };
    }

    const result: Record<string, string> = {};
    const labels = ['sm', 'md', 'lg', 'xl'];
    Array.from(shadows).forEach((shadow, index) => {
      if (index < labels.length) {
        result[labels[index]] = shadow;
      }
    });

    return result;
  }

  private extractBorderRadiusScale(components: ExtractedComponent[]): Record<string, number> {
    const radiusValues = new Set<number>();

    components.forEach(component => {
      if (component.styles.borders?.radius && component.styles.borders.radius > 0) {
        radiusValues.add(component.styles.borders.radius);
      }
    });

    if (radiusValues.size === 0) {
      return { sm: 4, md: 8, lg: 12, xl: 16, round: 9999 };
    }

    const sorted = Array.from(radiusValues).sort((a, b) => a - b);
    const scale: Record<string, number> = {};
    const labels = ['sm', 'md', 'lg', 'xl'];

    sorted.forEach((value, index) => {
      if (index < labels.length) {
        scale[labels[index]] = value;
      }
    });

    // Always include round for fully rounded elements
    scale.round = 9999;

    return scale;
  }

  private extractBreakpoints(components: ExtractedComponent[]): any[] {
    // Analyze component positions to infer common breakpoints
    const widths = components.map(c => c.position.width + c.position.x);
    const maxWidth = Math.max(...widths);

    const standardBreakpoints = [
      { name: 'mobile', width: 768 },
      { name: 'tablet', width: 1024 },
      { name: 'desktop', width: 1440 },
      { name: 'wide', width: 1920 }
    ];

    // Return breakpoints that make sense for the content width
    return standardBreakpoints.filter(bp => bp.width <= maxWidth + 200);
  }

  private normalizeDesignSystem(designSystem: DesignSystem): void {
    // Ensure minimum required values
    if (designSystem.colors.primary.length === 0) {
      designSystem.colors.primary = ['#007bff'];
    }

    if (Object.keys(designSystem.typography.fontSizes).length === 0) {
      designSystem.typography.fontSizes = { md: 16 };
    }

    if (Object.keys(designSystem.spacing).length === 0) {
      designSystem.spacing = { md: 16 };
    }

    // Ensure semantic colors exist
    const semanticDefaults = {
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8'
    };

    Object.entries(semanticDefaults).forEach(([key, value]) => {
      if (!designSystem.colors.semantic[key as keyof typeof designSystem.colors.semantic]) {
        (designSystem.colors.semantic as any)[key] = value;
      }
    });
  }
}