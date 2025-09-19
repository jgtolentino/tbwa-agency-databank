/**
 * Component Dissector - Intelligent analysis and categorization of dashboard components
 */

import { ExtractedComponent, DissectOptions, ChartType } from '../core/types';

export class ComponentDissector {
  private readonly componentPatterns = {
    chart: {
      keywords: ['chart', 'graph', 'plot', 'viz', 'visual', 'diagram'],
      elements: ['svg', 'canvas', 'path', 'rect', 'circle', 'line'],
      classes: ['recharts', 'd3', 'chartjs', 'plotly', 'highcharts', 'chart'],
      indicators: ['axis', 'legend', 'tooltip', 'grid', 'series']
    },
    kpi: {
      keywords: ['metric', 'kpi', 'indicator', 'score', 'total', 'count', 'sum'],
      patterns: [/^\$?\d{1,3}(,?\d{3})*(\.\d{2})?%?$/, /^\d+(\.\d+)?[KMB]?$/, /^\d+%$/],
      classes: ['metric', 'kpi', 'stat', 'number', 'value'],
      indicators: ['currency', 'percentage', 'trend', 'delta']
    },
    table: {
      keywords: ['table', 'grid', 'list', 'data', 'rows', 'columns'],
      elements: ['table', 'thead', 'tbody', 'tr', 'td', 'th'],
      classes: ['table', 'grid', 'datagrid', 'datatable'],
      indicators: ['sortable', 'pagination', 'header', 'cell']
    },
    filter: {
      keywords: ['filter', 'search', 'select', 'dropdown', 'picker', 'facet'],
      elements: ['select', 'input', 'button', 'form', 'fieldset'],
      classes: ['filter', 'search', 'select', 'dropdown', 'picker'],
      indicators: ['options', 'multiselect', 'date-range', 'checkbox']
    },
    map: {
      keywords: ['map', 'geo', 'location', 'region', 'country', 'state'],
      elements: ['svg', 'canvas', 'img'],
      classes: ['map', 'leaflet', 'mapbox', 'googlemaps'],
      indicators: ['coordinates', 'markers', 'zoom', 'layers']
    }
  };

  async analyze(components: ExtractedComponent[], options: DissectOptions = {}): Promise<ExtractedComponent[]> {
    const enhancedComponents = await Promise.all(
      components.map(component => this.analyzeComponent(component, options))
    );

    // Apply post-processing analysis
    const processedComponents = this.applySemanticAnalysis(enhancedComponents);
    const hierarchicalComponents = this.buildComponentHierarchy(processedComponents);

    if (options.aiEnhanced) {
      return this.applyAIEnhancements(hierarchicalComponents, options);
    }

    return hierarchicalComponents;
  }

  private async analyzeComponent(component: ExtractedComponent, options: DissectOptions): Promise<ExtractedComponent> {
    const enhanced = { ...component };

    // Enhanced type classification
    enhanced.type = this.classifyComponentType(component);
    enhanced.subtype = this.identifyChartSubtype(component);

    // Analyze component complexity
    enhanced.metadata = {
      complexity: this.assessComplexity(component),
      interactivity: this.assessInteractivity(component),
      responsiveness: this.assessResponsiveness(component),
      dataIntensity: this.assessDataIntensity(component),
      visualComplexity: this.assessVisualComplexity(component)
    };

    // Extract semantic information
    enhanced.semantics = this.extractSemantics(component);

    // Enhance style analysis
    enhanced.styles = this.enhanceStyleAnalysis(component.styles, component);

    // Analyze data patterns
    if (options.includeData) {
      enhanced.dataPatterns = this.analyzeDataPatterns(component);
    }

    // Detect responsive behavior
    if (options.includeResponsive) {
      enhanced.responsiveBehavior = this.analyzeResponsiveBehavior(component);
    }

    // Enhance interaction analysis
    if (options.includeInteractions) {
      enhanced.interactions = this.enhanceInteractionAnalysis(component.interactions || []);
    }

    return enhanced;
  }

  private classifyComponentType(component: ExtractedComponent): 'chart' | 'kpi' | 'table' | 'filter' | 'map' | 'text' | 'layout' | 'input' {
    const name = component.name.toLowerCase();
    const position = component.position;
    const hasChildren = component.children && component.children.length > 0;

    // Multi-factor scoring system
    const scores = {
      chart: this.scoreComponentType(component, 'chart'),
      kpi: this.scoreComponentType(component, 'kpi'),
      table: this.scoreComponentType(component, 'table'),
      filter: this.scoreComponentType(component, 'filter'),
      map: this.scoreComponentType(component, 'map'),
      text: this.scoreTextComponent(component),
      layout: this.scoreLayoutComponent(component),
      input: this.scoreInputComponent(component)
    };

    // Find the highest scoring type
    const bestMatch = Object.entries(scores).reduce((a, b) =>
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    );

    return bestMatch[0] as any;
  }

  private scoreComponentType(component: ExtractedComponent, type: keyof typeof this.componentPatterns): number {
    const patterns = this.componentPatterns[type];
    let score = 0;

    const name = component.name.toLowerCase();
    const classNames = this.extractClassNames(component);

    // Keyword matching (40% weight)
    const keywordMatches = patterns.keywords.filter(keyword => name.includes(keyword)).length;
    score += (keywordMatches / patterns.keywords.length) * 0.4;

    // Class name matching (30% weight)
    const classMatches = patterns.classes.filter(cls =>
      classNames.some(className => className.includes(cls))
    ).length;
    score += (classMatches / patterns.classes.length) * 0.3;

    // Element type matching (20% weight)
    if (patterns.elements) {
      const elementMatches = patterns.elements.filter(element =>
        name.includes(element) || this.hasElementType(component, element)
      ).length;
      score += (elementMatches / patterns.elements.length) * 0.2;
    }

    // Pattern matching for specific types (10% weight)
    if (type === 'kpi' && patterns.patterns) {
      const textContent = this.extractTextContent(component);
      const patternMatches = (patterns.patterns as RegExp[]).filter(pattern =>
        pattern.test(textContent)
      ).length;
      score += (patternMatches / patterns.patterns.length) * 0.1;
    }

    return Math.min(score, 1);
  }

  private scoreTextComponent(component: ExtractedComponent): number {
    const textContent = this.extractTextContent(component);
    const hasMinimalChildren = !component.children || component.children.length <= 1;
    const isTextLike = textContent.length > 0 && textContent.length < 200;
    const hasTextElements = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'text'].some(tag =>
      component.name.toLowerCase().includes(tag)
    );

    let score = 0;
    if (isTextLike) score += 0.4;
    if (hasMinimalChildren) score += 0.3;
    if (hasTextElements) score += 0.3;

    return score;
  }

  private scoreLayoutComponent(component: ExtractedComponent): number {
    const hasChildren = component.children && component.children.length > 1;
    const isLargeEnough = component.position.width > 200 && component.position.height > 100;
    const hasLayoutKeywords = ['container', 'wrapper', 'layout', 'section', 'panel'].some(keyword =>
      component.name.toLowerCase().includes(keyword)
    );

    let score = 0;
    if (hasChildren) score += 0.5;
    if (isLargeEnough) score += 0.3;
    if (hasLayoutKeywords) score += 0.2;

    return score;
  }

  private scoreInputComponent(component: ExtractedComponent): number {
    const inputKeywords = ['input', 'form', 'field', 'control', 'entry'];
    const hasInputKeywords = inputKeywords.some(keyword =>
      component.name.toLowerCase().includes(keyword)
    );

    return hasInputKeywords ? 0.8 : 0;
  }

  private identifyChartSubtype(component: ExtractedComponent): ChartType | undefined {
    if (component.type !== 'chart') return undefined;

    const name = component.name.toLowerCase();
    const subtypeKeywords = {
      bar: ['bar', 'column', 'histogram'],
      line: ['line', 'trend', 'time', 'series'],
      pie: ['pie', 'donut', 'doughnut'],
      scatter: ['scatter', 'bubble', 'correlation'],
      heatmap: ['heatmap', 'heat', 'density'],
      treemap: ['treemap', 'tree', 'hierarchy'],
      gauge: ['gauge', 'meter', 'speedometer'],
      funnel: ['funnel', 'conversion']
    };

    for (const [subtype, keywords] of Object.entries(subtypeKeywords)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return subtype as ChartType;
      }
    }

    // Analyze aspect ratio for hints
    const aspectRatio = component.position.width / component.position.height;
    if (aspectRatio > 2) return 'line'; // Wide charts are often line charts
    if (aspectRatio < 1.2) return 'pie'; // Square-ish charts might be pie charts

    return 'bar'; // Default fallback
  }

  private assessComplexity(component: ExtractedComponent): 'low' | 'medium' | 'high' {
    let complexityScore = 0;

    // Factor in children count
    const childrenCount = component.children?.length || 0;
    complexityScore += Math.min(childrenCount / 10, 1) * 0.3;

    // Factor in size
    const area = component.position.width * component.position.height;
    complexityScore += Math.min(area / 100000, 1) * 0.2;

    // Factor in interactions
    const interactionCount = component.interactions?.length || 0;
    complexityScore += Math.min(interactionCount / 5, 1) * 0.2;

    // Factor in styling complexity
    const styleComplexity = this.calculateStyleComplexity(component.styles);
    complexityScore += styleComplexity * 0.3;

    if (complexityScore < 0.3) return 'low';
    if (complexityScore < 0.7) return 'medium';
    return 'high';
  }

  private assessInteractivity(component: ExtractedComponent): 'static' | 'basic' | 'interactive' | 'advanced' {
    const interactionCount = component.interactions?.length || 0;
    const hasComplexInteractions = component.interactions?.some(i =>
      ['drill', 'filter', 'highlight'].includes(i.action)
    ) || false;

    if (interactionCount === 0) return 'static';
    if (interactionCount <= 2 && !hasComplexInteractions) return 'basic';
    if (interactionCount <= 5 || hasComplexInteractions) return 'interactive';
    return 'advanced';
  }

  private assessResponsiveness(component: ExtractedComponent): 'fixed' | 'flexible' | 'responsive' {
    // Analyze styling for responsive indicators
    const styles = component.styles;

    if (styles.layout?.display === 'flex' || styles.layout?.display === 'grid') {
      return 'responsive';
    }

    if (styles.spacing?.margin?.includes('%') || styles.spacing?.padding?.includes('%')) {
      return 'flexible';
    }

    return 'fixed';
  }

  private assessDataIntensity(component: ExtractedComponent): 'static' | 'light' | 'moderate' | 'heavy' {
    const dataFields = component.data?.fields?.length || 0;
    const hasAggregations = component.data?.aggregations && component.data.aggregations.length > 0;
    const hasTransformations = component.data?.transformations && component.data.transformations.length > 0;

    if (dataFields === 0) return 'static';
    if (dataFields <= 3 && !hasAggregations) return 'light';
    if (dataFields <= 10 || hasAggregations || hasTransformations) return 'moderate';
    return 'heavy';
  }

  private assessVisualComplexity(component: ExtractedComponent): 'simple' | 'moderate' | 'complex' {
    let visualScore = 0;

    // Color complexity
    const colorCount = (component.styles.colors?.palette?.length || 0) +
                     Object.values(component.styles.colors || {}).length;
    visualScore += Math.min(colorCount / 10, 1) * 0.3;

    // Typography variety
    const typographyComplexity = Object.keys(component.styles.typography || {}).length;
    visualScore += Math.min(typographyComplexity / 5, 1) * 0.2;

    // Border and shadow complexity
    const effectsComplexity = (component.styles.borders ? 1 : 0) +
                             (component.styles.shadows?.length || 0);
    visualScore += Math.min(effectsComplexity / 3, 1) * 0.2;

    // Layout complexity
    const layoutComplexity = Object.keys(component.styles.layout || {}).length;
    visualScore += Math.min(layoutComplexity / 6, 1) * 0.3;

    if (visualScore < 0.3) return 'simple';
    if (visualScore < 0.7) return 'moderate';
    return 'complex';
  }

  private extractSemantics(component: ExtractedComponent): any {
    return {
      purpose: this.inferComponentPurpose(component),
      dataContext: this.inferDataContext(component),
      userIntent: this.inferUserIntent(component),
      businessValue: this.inferBusinessValue(component)
    };
  }

  private inferComponentPurpose(component: ExtractedComponent): string {
    const name = component.name.toLowerCase();

    const purposeMap = {
      'overview': ['overview', 'summary', 'dashboard', 'main'],
      'monitoring': ['monitor', 'status', 'health', 'alert'],
      'analysis': ['analysis', 'breakdown', 'detail', 'deep'],
      'comparison': ['compare', 'vs', 'versus', 'trend'],
      'performance': ['performance', 'kpi', 'metric', 'score'],
      'navigation': ['nav', 'menu', 'breadcrumb', 'tab'],
      'input': ['input', 'form', 'filter', 'search', 'select']
    };

    for (const [purpose, keywords] of Object.entries(purposeMap)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return purpose;
      }
    }

    return 'general';
  }

  private inferDataContext(component: ExtractedComponent): string {
    const fields = component.data?.fields || [];
    const fieldTypes = fields.map(f => f.type);

    if (fieldTypes.includes('date')) return 'temporal';
    if (fieldTypes.includes('number')) return 'quantitative';
    if (fields.some(f => f.role === 'dimension')) return 'categorical';

    return 'mixed';
  }

  private inferUserIntent(component: ExtractedComponent): string[] {
    const intents: string[] = [];

    if (component.interactions?.some(i => i.action === 'filter')) {
      intents.push('filtering');
    }
    if (component.interactions?.some(i => i.action === 'drill')) {
      intents.push('exploration');
    }
    if (component.type === 'kpi') {
      intents.push('monitoring');
    }
    if (component.type === 'chart') {
      intents.push('analysis');
    }
    if (component.interactions?.some(i => i.action === 'export')) {
      intents.push('export');
    }

    return intents.length > 0 ? intents : ['viewing'];
  }

  private inferBusinessValue(component: ExtractedComponent): 'low' | 'medium' | 'high' | 'critical' {
    const hasKPI = component.type === 'kpi';
    const hasInteractions = (component.interactions?.length || 0) > 0;
    const isLarge = component.position.width * component.position.height > 50000;
    const hasData = (component.data?.fields?.length || 0) > 0;

    let valueScore = 0;
    if (hasKPI) valueScore += 0.4;
    if (hasInteractions) valueScore += 0.3;
    if (isLarge) valueScore += 0.2;
    if (hasData) valueScore += 0.1;

    if (valueScore < 0.2) return 'low';
    if (valueScore < 0.5) return 'medium';
    if (valueScore < 0.8) return 'high';
    return 'critical';
  }

  private enhanceStyleAnalysis(styles: any, component: ExtractedComponent): any {
    return {
      ...styles,
      computed: {
        accessibility: this.assessAccessibility(styles),
        consistency: this.assessStyleConsistency(styles),
        modernization: this.assessModernization(styles),
        responsiveness: this.assessStyleResponsiveness(styles)
      }
    };
  }

  private analyzeDataPatterns(component: ExtractedComponent): any {
    return {
      updateFrequency: this.inferUpdateFrequency(component),
      dataVolume: this.inferDataVolume(component),
      dataQuality: this.assessDataQuality(component),
      cacheability: this.assessCacheability(component)
    };
  }

  private analyzeResponsiveBehavior(component: ExtractedComponent): any {
    return {
      breakpoints: this.identifyBreakpoints(component),
      adaptationStrategies: this.identifyAdaptationStrategies(component),
      mobileOptimization: this.assessMobileOptimization(component)
    };
  }

  private enhanceInteractionAnalysis(interactions: any[]): any[] {
    return interactions.map(interaction => ({
      ...interaction,
      complexity: this.assessInteractionComplexity(interaction),
      accessibility: this.assessInteractionAccessibility(interaction),
      performance: this.assessInteractionPerformance(interaction)
    }));
  }

  private applySemanticAnalysis(components: ExtractedComponent[]): ExtractedComponent[] {
    // Analyze relationships between components
    return components.map(component => ({
      ...component,
      relationships: this.findComponentRelationships(component, components),
      dependencies: this.findComponentDependencies(component, components)
    }));
  }

  private buildComponentHierarchy(components: ExtractedComponent[]): ExtractedComponent[] {
    // Build a proper parent-child hierarchy based on positioning and semantics
    const hierarchy = [...components];

    // Sort by z-index and containment
    hierarchy.sort((a, b) => {
      const aArea = a.position.width * a.position.height;
      const bArea = b.position.width * b.position.height;
      return bArea - aArea; // Larger components first (likely containers)
    });

    // Establish parent-child relationships
    for (let i = 0; i < hierarchy.length; i++) {
      for (let j = i + 1; j < hierarchy.length; j++) {
        if (this.isContained(hierarchy[j], hierarchy[i])) {
          hierarchy[i].children = hierarchy[i].children || [];
          hierarchy[i].children.push(hierarchy[j]);
          hierarchy.splice(j, 1);
          j--; // Adjust index after removal
        }
      }
    }

    return hierarchy;
  }

  private async applyAIEnhancements(components: ExtractedComponent[], options: DissectOptions): Promise<ExtractedComponent[]> {
    // AI-powered enhancements would go here
    // For now, return components as-is
    return components;
  }

  // Utility methods
  private extractClassNames(component: ExtractedComponent): string[] {
    // Extract class names from component name or metadata
    const name = component.name.toLowerCase();
    return name.split(/[\s-_.]/).filter(Boolean);
  }

  private hasElementType(component: ExtractedComponent, elementType: string): boolean {
    return component.name.toLowerCase().includes(elementType);
  }

  private extractTextContent(component: ExtractedComponent): string {
    // Extract text content from component (simplified)
    return component.name || '';
  }

  private calculateStyleComplexity(styles: any): number {
    let complexity = 0;

    // Count style properties
    const styleKeys = Object.keys(styles || {});
    complexity += styleKeys.length / 20; // Normalize

    // Factor in nested objects
    styleKeys.forEach(key => {
      if (typeof styles[key] === 'object' && styles[key] !== null) {
        complexity += Object.keys(styles[key]).length / 40;
      }
    });

    return Math.min(complexity, 1);
  }

  private assessAccessibility(styles: any): 'poor' | 'basic' | 'good' | 'excellent' {
    // Simplified accessibility assessment
    const hasGoodContrast = true; // Would calculate actual contrast
    const hasProperSizing = styles.typography?.fontSize >= 14;
    const hasFocusStates = Boolean(styles.focus);

    let score = 0;
    if (hasGoodContrast) score += 0.4;
    if (hasProperSizing) score += 0.3;
    if (hasFocusStates) score += 0.3;

    if (score < 0.3) return 'poor';
    if (score < 0.6) return 'basic';
    if (score < 0.9) return 'good';
    return 'excellent';
  }

  private assessStyleConsistency(styles: any): number {
    // Assess how consistent the styles are with common patterns
    return 0.8; // Placeholder
  }

  private assessModernization(styles: any): number {
    // Assess how modern the styles are
    const hasFlexbox = styles.layout?.display === 'flex';
    const hasGrid = styles.layout?.display === 'grid';
    const hasModernUnits = JSON.stringify(styles).includes('rem') || JSON.stringify(styles).includes('vh');

    let score = 0;
    if (hasFlexbox || hasGrid) score += 0.5;
    if (hasModernUnits) score += 0.3;

    return Math.min(score, 1);
  }

  private assessStyleResponsiveness(styles: any): number {
    // Assess responsive design indicators in styles
    return 0.7; // Placeholder
  }

  private inferUpdateFrequency(component: ExtractedComponent): 'static' | 'hourly' | 'daily' | 'realtime' {
    if (component.type === 'kpi') return 'hourly';
    if (component.type === 'chart') return 'daily';
    return 'static';
  }

  private inferDataVolume(component: ExtractedComponent): 'small' | 'medium' | 'large' | 'massive' {
    const fieldCount = component.data?.fields?.length || 0;
    if (fieldCount <= 5) return 'small';
    if (fieldCount <= 15) return 'medium';
    if (fieldCount <= 50) return 'large';
    return 'massive';
  }

  private assessDataQuality(component: ExtractedComponent): number {
    return 0.8; // Placeholder
  }

  private assessCacheability(component: ExtractedComponent): 'none' | 'short' | 'medium' | 'long' {
    if (component.type === 'kpi') return 'short';
    if (component.type === 'chart') return 'medium';
    return 'long';
  }

  private identifyBreakpoints(component: ExtractedComponent): string[] {
    return ['mobile', 'tablet', 'desktop']; // Placeholder
  }

  private identifyAdaptationStrategies(component: ExtractedComponent): string[] {
    return ['hide', 'stack', 'resize']; // Placeholder
  }

  private assessMobileOptimization(component: ExtractedComponent): number {
    return 0.6; // Placeholder
  }

  private assessInteractionComplexity(interaction: any): 'simple' | 'moderate' | 'complex' {
    if (interaction.action === 'click') return 'simple';
    if (interaction.action === 'filter') return 'moderate';
    return 'complex';
  }

  private assessInteractionAccessibility(interaction: any): number {
    return 0.8; // Placeholder
  }

  private assessInteractionPerformance(interaction: any): number {
    return 0.7; // Placeholder
  }

  private findComponentRelationships(component: ExtractedComponent, allComponents: ExtractedComponent[]): any[] {
    // Find related components
    return []; // Placeholder
  }

  private findComponentDependencies(component: ExtractedComponent, allComponents: ExtractedComponent[]): any[] {
    // Find component dependencies
    return []; // Placeholder
  }

  private isContained(child: ExtractedComponent, parent: ExtractedComponent): boolean {
    const childPos = child.position;
    const parentPos = parent.position;

    return (
      childPos.x >= parentPos.x &&
      childPos.y >= parentPos.y &&
      childPos.x + childPos.width <= parentPos.x + parentPos.width &&
      childPos.y + childPos.height <= parentPos.y + parentPos.height
    );
  }
}