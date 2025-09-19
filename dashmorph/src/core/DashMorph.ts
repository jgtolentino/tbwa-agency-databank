/**
 * DashMorph - Main orchestrator for dashboard dissection and reconstruction
 */

import { EventEmitter } from 'events';
import {
  DashboardSource,
  DissectedDashboard,
  TargetConfig,
  GeneratedDashboard,
  ValidationResult,
  SourceType,
  ComponentType
} from './types';

export class DashMorph extends EventEmitter {
  private extractors: Map<SourceType, any> = new Map();
  private mappers: Map<string, any> = new Map();
  private validators: any[] = [];

  constructor() {
    super();
    this.setupExtractors();
    this.setupMappers();
    this.setupValidators();
  }

  /**
   * Main method: Extract → Dissect → Generate → Validate
   */
  async morph(
    source: DashboardSource,
    target: TargetConfig,
    options: MorphOptions = {}
  ): Promise<MorphResult> {
    try {
      this.emit('start', { source, target });

      // Step 1: Extract from source
      this.emit('extract:start');
      const extracted = await this.extract(source);
      this.emit('extract:complete', { components: extracted.components.length });

      // Step 2: Dissect into components
      this.emit('dissect:start');
      const dissected = await this.dissect(extracted, options.dissectOptions);
      this.emit('dissect:complete', {
        components: dissected.components.length,
        designTokens: Object.keys(dissected.designSystem.colors.primary).length
      });

      // Step 3: Generate target code
      this.emit('generate:start');
      const generated = await this.generate(dissected, target, options.generateOptions);
      this.emit('generate:complete', {
        files: generated.components.length,
        framework: target.framework
      });

      // Step 4: Validate pixel parity (if requested)
      let validation: ValidationResult | undefined;
      if (options.validate !== false) {
        this.emit('validate:start');
        validation = await this.validate(source, generated, target, options.validateOptions);
        this.emit('validate:complete', {
          pixelMatch: validation.pixelMatch,
          passed: validation.passed
        });
      }

      const result: MorphResult = {
        source,
        target,
        dissected,
        generated,
        validation,
        success: true,
        duration: Date.now() - (options.startTime || Date.now())
      };

      this.emit('complete', result);
      return result;

    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Extract dashboard from any source
   */
  async extract(source: DashboardSource): Promise<DissectedDashboard> {
    const extractor = this.extractors.get(source.type);
    if (!extractor) {
      throw new Error(`No extractor available for source type: ${source.type}`);
    }

    return await extractor.extract(source);
  }

  /**
   * Dissect extracted dashboard into components and design system
   */
  async dissect(
    dashboard: DissectedDashboard,
    options: DissectOptions = {}
  ): Promise<DissectedDashboard> {
    const { ComponentDissector } = await import('../dissector/ComponentDissector');
    const { DesignSystemExtractor } = await import('../dissector/DesignSystemExtractor');
    const { DataModelAnalyzer } = await import('../dissector/DataModelAnalyzer');

    const dissector = new ComponentDissector();
    const designExtractor = new DesignSystemExtractor();
    const dataAnalyzer = new DataModelAnalyzer();

    // Enhance component analysis
    const enhancedComponents = await dissector.analyze(dashboard.components, options);

    // Extract design system tokens
    const designSystem = await designExtractor.extract(dashboard, options);

    // Analyze data relationships
    const dataModel = await dataAnalyzer.analyze(dashboard, options);

    return {
      ...dashboard,
      components: enhancedComponents,
      designSystem,
      dataModel
    };
  }

  /**
   * Generate target framework code
   */
  async generate(
    dashboard: DissectedDashboard,
    target: TargetConfig,
    options: GenerateOptions = {}
  ): Promise<GeneratedDashboard> {
    const { CodeGenerator } = await import('../builder/CodeGenerator');
    const generator = new CodeGenerator(target);

    return await generator.generate(dashboard, options);
  }

  /**
   * Validate pixel parity between source and generated
   */
  async validate(
    source: DashboardSource,
    generated: GeneratedDashboard,
    target: TargetConfig,
    options: ValidateOptions = {}
  ): Promise<ValidationResult> {
    const { PixelParityValidator } = await import('../validator/PixelParityValidator');
    const validator = new PixelParityValidator();

    return await validator.validate(source, generated, target, options);
  }

  /**
   * Get supported source types
   */
  getSupportedSources(): SourceType[] {
    return Array.from(this.extractors.keys());
  }

  /**
   * Get supported target frameworks
   */
  getSupportedTargets(): string[] {
    return Array.from(this.mappers.keys());
  }

  /**
   * Register custom extractor
   */
  registerExtractor(type: SourceType, extractor: any) {
    this.extractors.set(type, extractor);
  }

  /**
   * Register custom mapper
   */
  registerMapper(target: string, mapper: any) {
    this.mappers.set(target, mapper);
  }

  private setupExtractors() {
    // BI Tools
    this.extractors.set('tableau', null); // Lazy loaded
    this.extractors.set('powerbi', null);
    this.extractors.set('looker', null);
    this.extractors.set('qlik', null);
    this.extractors.set('metabase', null);
    this.extractors.set('superset', null);

    // Design Tools
    this.extractors.set('figma', null);
    this.extractors.set('sketch', null);
    this.extractors.set('xd', null);
    this.extractors.set('framer', null);

    // Code Sources
    this.extractors.set('html', null);
    this.extractors.set('react', null);
    this.extractors.set('vue', null);
    this.extractors.set('angular', null);

    // Other
    this.extractors.set('screenshot', null);
    this.extractors.set('pdf', null);
    this.extractors.set('url', null);
  }

  private setupMappers() {
    this.mappers.set('react', null);
    this.mappers.set('vue', null);
    this.mappers.set('angular', null);
    this.mappers.set('svelte', null);
    this.mappers.set('nextjs', null);
    this.mappers.set('nuxt', null);
    this.mappers.set('sveltekit', null);
  }

  private setupValidators() {
    // Validators will be loaded dynamically
  }
}

// Configuration interfaces
export interface MorphOptions {
  startTime?: number;
  dissectOptions?: DissectOptions;
  generateOptions?: GenerateOptions;
  validateOptions?: ValidateOptions;
  validate?: boolean;
}

export interface DissectOptions {
  includeInteractions?: boolean;
  includeData?: boolean;
  includeResponsive?: boolean;
  aiEnhanced?: boolean;
  precision?: 'low' | 'medium' | 'high';
}

export interface GenerateOptions {
  includeTests?: boolean;
  includeStories?: boolean;
  includeTypes?: boolean;
  optimization?: 'development' | 'production';
  treeshaking?: boolean;
  bundling?: boolean;
}

export interface ValidateOptions {
  threshold?: number; // 0-100 percentage
  includeInteractions?: boolean;
  includeResponsive?: boolean;
  generateReport?: boolean;
  outputDir?: string;
}

export interface MorphResult {
  source: DashboardSource;
  target: TargetConfig;
  dissected: DissectedDashboard;
  generated: GeneratedDashboard;
  validation?: ValidationResult;
  success: boolean;
  duration: number;
  errors?: Error[];
}

// Utility methods
export class DashMorphUtils {
  /**
   * Detect source type from URL or file
   */
  static detectSourceType(input: string): SourceType {
    // URL patterns
    if (input.includes('tableau.')) return 'tableau';
    if (input.includes('powerbi.') || input.includes('app.powerbi.')) return 'powerbi';
    if (input.includes('looker.') || input.includes('lookerstudio.')) return 'looker';
    if (input.includes('qlik.') || input.includes('qliksense.')) return 'qlik';
    if (input.includes('metabase.')) return 'metabase';
    if (input.includes('superset.')) return 'superset';
    if (input.includes('figma.com')) return 'figma';
    if (input.includes('sketch.com')) return 'sketch';
    if (input.includes('adobe.com/xd')) return 'xd';
    if (input.includes('framer.com')) return 'framer';

    // File extensions
    if (input.endsWith('.pbix')) return 'powerbi';
    if (input.endsWith('.twb') || input.endsWith('.twbx')) return 'tableau';
    if (input.endsWith('.sketch')) return 'sketch';
    if (input.endsWith('.xd')) return 'xd';
    if (input.endsWith('.html') || input.endsWith('.htm')) return 'html';
    if (input.endsWith('.pdf')) return 'pdf';
    if (input.endsWith('.png') || input.endsWith('.jpg') || input.endsWith('.jpeg')) return 'screenshot';

    // Default to URL
    return 'url';
  }

  /**
   * Generate unique component ID
   */
  static generateComponentId(type: ComponentType, name: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${type}-${name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-${random}`;
  }

  /**
   * Validate configuration
   */
  static validateConfig(source: DashboardSource, target: TargetConfig): string[] {
    const errors: string[] = [];

    // Validate source
    if (!source.type) errors.push('Source type is required');
    if (!source.url && !source.file) errors.push('Source URL or file is required');

    // Validate target
    if (!target.framework) errors.push('Target framework is required');
    if (!target.styling) errors.push('Target styling system is required');
    if (!target.charts) errors.push('Target chart library is required');
    if (!target.outputDir) errors.push('Output directory is required');

    return errors;
  }
}

export default DashMorph;