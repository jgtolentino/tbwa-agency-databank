/**
 * Core types for DashMorph - Universal Dashboard Dissection & Reconstruction
 */

// Source types that can be extracted from
export type SourceType =
  | 'tableau' | 'powerbi' | 'looker' | 'qlik' | 'metabase' | 'superset'
  | 'figma' | 'sketch' | 'xd' | 'framer'
  | 'html' | 'react' | 'vue' | 'angular'
  | 'screenshot' | 'pdf' | 'url';

// Target frameworks for generation
export type TargetFramework =
  | 'react' | 'vue' | 'angular' | 'svelte' | 'nextjs' | 'nuxt' | 'sveltekit';

// Styling systems
export type StyleSystem =
  | 'tailwind' | 'bootstrap' | 'materialui' | 'antd' | 'chakra'
  | 'styled-components' | 'emotion' | 'css-modules' | 'vanilla-css';

// Chart libraries
export type ChartLibrary =
  | 'recharts' | 'd3' | 'plotly' | 'chartjs' | 'vega' | 'echarts'
  | 'visx' | 'nivo' | 'tremor' | 'ant-charts';

// State management
export type StateManagement =
  | 'zustand' | 'redux' | 'mobx' | 'context' | 'valtio' | 'jotai';

// Component categories
export type ComponentType =
  | 'chart' | 'kpi' | 'table' | 'filter' | 'map' | 'text' | 'layout' | 'input';

// Chart subtypes
export type ChartType =
  | 'bar' | 'line' | 'pie' | 'donut' | 'scatter' | 'bubble' | 'heatmap'
  | 'treemap' | 'sunburst' | 'funnel' | 'gauge' | 'sparkline';

// Dashboard source input
export interface DashboardSource {
  type: SourceType;
  url?: string;
  file?: string;
  credentials?: Record<string, any>;
  options?: Record<string, any>;
}

// Extracted component from source
export interface ExtractedComponent {
  id: string;
  type: ComponentType;
  subtype?: ChartType;
  name: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles: ExtractedStyles;
  data?: DataBinding;
  interactions?: Interaction[];
  children?: ExtractedComponent[];
}

// Style information extracted from source
export interface ExtractedStyles {
  colors: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    border?: string;
    palette?: string[];
  };
  typography: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    letterSpacing?: number;
  };
  spacing: {
    margin?: string | number;
    padding?: string | number;
    gap?: number;
  };
  borders: {
    width?: number;
    style?: string;
    color?: string;
    radius?: number;
  };
  shadows?: string[];
  layout: {
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gridTemplateColumns?: string;
    gridTemplateRows?: string;
  };
}

// Data binding information
export interface DataBinding {
  source: string;
  query?: string;
  fields: DataField[];
  aggregations?: Aggregation[];
  filters?: Filter[];
  transformations?: Transformation[];
}

export interface DataField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  role: 'dimension' | 'measure' | 'calculated';
  format?: string;
}

export interface Aggregation {
  field: string;
  function: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'distinct';
}

export interface Filter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface Transformation {
  type: 'calculate' | 'group' | 'sort' | 'limit';
  expression: string;
}

// Interaction definitions
export interface Interaction {
  trigger: 'click' | 'hover' | 'select' | 'drill';
  action: 'filter' | 'highlight' | 'navigate' | 'tooltip' | 'export';
  target?: string;
  params?: Record<string, any>;
}

// Complete dissected dashboard
export interface DissectedDashboard {
  metadata: DashboardMetadata;
  designSystem: DesignSystem;
  layout: LayoutStructure;
  components: ExtractedComponent[];
  dataModel: DataModel;
  interactions: InteractionModel;
}

export interface DashboardMetadata {
  title: string;
  description?: string;
  source: DashboardSource;
  extractedAt: Date;
  version: string;
  tags?: string[];
}

export interface DesignSystem {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  shadows: ShadowScale;
  borderRadius: BorderRadiusScale;
  breakpoints: Breakpoint[];
}

export interface ColorPalette {
  primary: string[];
  secondary: string[];
  neutral: string[];
  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  chart: string[];
}

export interface TypographyScale {
  fontFamilies: {
    primary: string;
    secondary?: string;
    monospace?: string;
  };
  fontSizes: Record<string, number>;
  fontWeights: Record<string, number>;
  lineHeights: Record<string, number>;
}

export interface SpacingScale {
  [key: string]: number; // xs: 4, sm: 8, md: 16, etc.
}

export interface ShadowScale {
  [key: string]: string; // sm: '0 1px 3px rgba(0,0,0,0.12)', etc.
}

export interface BorderRadiusScale {
  [key: string]: number; // sm: 4, md: 8, lg: 12, etc.
}

export interface Breakpoint {
  name: string;
  width: number;
}

export interface LayoutStructure {
  type: 'grid' | 'flex' | 'absolute';
  columns?: number;
  rows?: number;
  areas?: string[][];
  responsive?: ResponsiveLayout[];
}

export interface ResponsiveLayout {
  breakpoint: string;
  layout: LayoutStructure;
}

export interface DataModel {
  sources: DataSource[];
  relationships: DataRelationship[];
  measures: CalculatedMeasure[];
}

export interface DataSource {
  id: string;
  name: string;
  type: 'sql' | 'api' | 'file' | 'mock';
  connection: string;
  schema?: Record<string, any>;
}

export interface DataRelationship {
  from: { source: string; field: string };
  to: { source: string; field: string };
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface CalculatedMeasure {
  name: string;
  expression: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  dependencies: string[];
}

export interface InteractionModel {
  crossFiltering: CrossFilter[];
  drillDowns: DrillDown[];
  tooltips: TooltipConfig[];
  exports: ExportConfig[];
}

export interface CrossFilter {
  source: string;
  targets: string[];
  field: string;
}

export interface DrillDown {
  component: string;
  hierarchy: string[];
  action: 'replace' | 'overlay';
}

export interface TooltipConfig {
  component: string;
  fields: string[];
  template?: string;
}

export interface ExportConfig {
  component: string;
  formats: ('png' | 'pdf' | 'csv' | 'xlsx')[];
}

// Target configuration for generation
export interface TargetConfig {
  framework: TargetFramework;
  styling: StyleSystem;
  charts: ChartLibrary;
  state?: StateManagement;
  typescript: boolean;
  outputDir: string;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  eslint?: boolean;
  prettier?: boolean;
  testing?: 'jest' | 'vitest' | 'cypress';
}

// Generated output structure
export interface GeneratedDashboard {
  components: GeneratedComponent[];
  styles: GeneratedStyles;
  data: GeneratedData;
  tests: GeneratedTest[];
  stories: GeneratedStory[];
  config: GeneratedConfig;
}

export interface GeneratedComponent {
  name: string;
  path: string;
  content: string;
  dependencies: string[];
  exports: string[];
}

export interface GeneratedStyles {
  system: string; // Design system tokens
  components: Record<string, string>; // Component styles
  global: string; // Global styles
}

export interface GeneratedData {
  hooks: Record<string, string>; // Custom hooks
  queries: Record<string, string>; // Query functions
  transformers: Record<string, string>; // Data transformers
  mocks: Record<string, any>; // Mock data
}

export interface GeneratedTest {
  name: string;
  path: string;
  content: string;
  type: 'unit' | 'integration' | 'e2e';
}

export interface GeneratedStory {
  name: string;
  path: string;
  content: string;
}

export interface GeneratedConfig {
  package: any; // package.json
  tsconfig?: any; // tsconfig.json
  eslint?: any; // .eslintrc
  prettier?: any; // .prettierrc
  vite?: any; // vite.config
  webpack?: any; // webpack.config
  tailwind?: any; // tailwind.config
}

// Validation results
export interface ValidationResult {
  pixelMatch: number; // 0-100 percentage
  styleDiff: StyleDifference[];
  dimensionDiff: DimensionDifference[];
  interactionDiff: InteractionDifference[];
  report: ValidationReport;
  passed: boolean;
  threshold: number;
}

export interface StyleDifference {
  component: string;
  property: string;
  expected: any;
  actual: any;
  severity: 'critical' | 'major' | 'minor';
}

export interface DimensionDifference {
  component: string;
  dimension: 'width' | 'height' | 'x' | 'y';
  expected: number;
  actual: number;
  diff: number;
  severity: 'critical' | 'major' | 'minor';
}

export interface InteractionDifference {
  component: string;
  interaction: string;
  expected: boolean;
  actual: boolean;
  severity: 'critical' | 'major' | 'minor';
}

export interface ValidationReport {
  summary: {
    totalComponents: number;
    passedComponents: number;
    failedComponents: number;
    criticalIssues: number;
    majorIssues: number;
    minorIssues: number;
  };
  details: {
    screenshots: {
      original: string;
      generated: string;
      diff: string;
    };
    components: ComponentValidation[];
  };
  recommendations: string[];
}

export interface ComponentValidation {
  name: string;
  pixelMatch: number;
  passed: boolean;
  issues: (StyleDifference | DimensionDifference | InteractionDifference)[];
}