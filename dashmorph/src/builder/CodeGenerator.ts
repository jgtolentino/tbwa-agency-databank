/**
 * Code Generator - Converts dissected dashboard components to target framework code
 */

import { DissectedDashboard, TargetConfig, GeneratedDashboard, GenerateOptions, ExtractedComponent } from '../core/types';

export class CodeGenerator {
  private config: TargetConfig;
  private options: GenerateOptions;

  constructor(config: TargetConfig) {
    this.config = config;
    this.options = {};
  }

  async generate(dashboard: DissectedDashboard, options: GenerateOptions = {}): Promise<GeneratedDashboard> {
    this.options = { ...this.options, ...options };

    const components = await this.generateComponents(dashboard.components, dashboard);
    const styles = await this.generateStyles(dashboard.designSystem);
    const data = await this.generateDataLayer(dashboard.dataModel);
    const tests = this.options.includeTests ? await this.generateTests(components) : [];
    const stories = this.options.includeStories ? await this.generateStories(components) : [];
    const config = await this.generateProjectConfig();

    return {
      components,
      styles,
      data,
      tests,
      stories,
      config
    };
  }

  private async generateComponents(
    components: ExtractedComponent[],
    dashboard: DissectedDashboard
  ): Promise<any[]> {
    const generatedComponents = [];

    for (const component of components) {
      const generated = await this.generateComponent(component, dashboard);
      generatedComponents.push(generated);
    }

    // Generate main dashboard component
    const mainComponent = await this.generateMainDashboard(components, dashboard);
    generatedComponents.unshift(mainComponent);

    return generatedComponents;
  }

  private async generateComponent(
    component: ExtractedComponent,
    dashboard: DissectedDashboard
  ): Promise<any> {
    const componentName = this.sanitizeComponentName(component.name);
    const framework = this.config.framework;

    switch (framework) {
      case 'react':
      case 'nextjs':
        return this.generateReactComponent(component, dashboard);
      case 'vue':
      case 'nuxt':
        return this.generateVueComponent(component, dashboard);
      case 'angular':
        return this.generateAngularComponent(component, dashboard);
      case 'svelte':
      case 'sveltekit':
        return this.generateSvelteComponent(component, dashboard);
      default:
        throw new Error(`Unsupported framework: ${framework}`);
    }
  }

  private generateReactComponent(
    component: ExtractedComponent,
    dashboard: DissectedDashboard
  ): any {
    const componentName = this.sanitizeComponentName(component.name);
    const isTypeScript = this.config.typescript;
    const extension = isTypeScript ? 'tsx' : 'jsx';

    const imports = this.generateReactImports(component, dashboard);
    const types = isTypeScript ? this.generateTypeScript(component) : '';
    const styles = this.generateComponentStyles(component);
    const jsx = this.generateReactJSX(component, dashboard);

    const content = `${imports}

${types}

export const ${componentName}${isTypeScript ? ': React.FC<' + componentName + 'Props>' : ''} = (${isTypeScript ? 'props' : '{ ...props }'}) => {
  ${this.generateReactHooks(component)}

  return (
    ${jsx}
  );
};

${this.generateReactDefaultProps(component)}
`;

    return {
      name: componentName,
      path: `src/components/${componentName}.${extension}`,
      content,
      dependencies: this.extractDependencies(component),
      exports: [componentName]
    };
  }

  private generateReactImports(component: ExtractedComponent, dashboard: DissectedDashboard): string {
    const imports = ['import React'];

    if (this.hasState(component)) {
      imports[0] += ', { useState, useEffect }';
    }

    imports[0] += " from 'react';";

    // Chart library imports
    if (component.type === 'chart') {
      switch (this.config.charts) {
        case 'recharts':
          imports.push(this.generateRechartsImports(component));
          break;
        case 'd3':
          imports.push("import * as d3 from 'd3';");
          break;
        case 'plotly':
          imports.push("import Plot from 'react-plotly.js';");
          break;
        case 'chartjs':
          imports.push("import { Chart } from 'react-chartjs-2';");
          break;
      }
    }

    // Styling imports
    if (this.config.styling === 'styled-components') {
      imports.push("import styled from 'styled-components';");
    } else if (this.config.styling === 'emotion') {
      imports.push("import styled from '@emotion/styled';");
    }

    // Type imports
    if (this.config.typescript) {
      imports.push(`import type { ${this.sanitizeComponentName(component.name)}Props } from './types';`);
    }

    return imports.join('\n');
  }

  private generateRechartsImports(component: ExtractedComponent): string {
    const chartType = component.subtype || 'bar';

    const chartComponents = {
      bar: 'BarChart, Bar',
      line: 'LineChart, Line',
      pie: 'PieChart, Pie',
      scatter: 'ScatterChart, Scatter',
      treemap: 'Treemap',
      funnel: 'FunnelChart, Funnel'
    };

    const chartImport = chartComponents[chartType as keyof typeof chartComponents] || 'BarChart, Bar';

    return `import {
  ${chartImport},
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';`;
  }

  private generateTypeScript(component: ExtractedComponent): string {
    if (!this.config.typescript) return '';

    const componentName = this.sanitizeComponentName(component.name);
    const props = this.generateComponentProps(component);

    return `interface ${componentName}Props {
  ${props}
}`;
  }

  private generateComponentProps(component: ExtractedComponent): string {
    const props = ['className?: string;'];

    // Data props
    if (component.data && component.data.fields.length > 0) {
      props.push('data?: any[];');
    }

    // Style props
    if (component.styles.colors?.primary) {
      props.push('primaryColor?: string;');
    }

    // Interaction props
    if (component.interactions && component.interactions.length > 0) {
      component.interactions.forEach(interaction => {
        if (interaction.action === 'click') {
          props.push('onClick?: () => void;');
        } else if (interaction.action === 'filter') {
          props.push('onFilter?: (value: any) => void;');
        }
      });
    }

    // Size props for responsive components
    if (component.metadata?.responsiveness !== 'fixed') {
      props.push('width?: number | string;');
      props.push('height?: number | string;');
    }

    return props.join('\n  ');
  }

  private generateReactHooks(component: ExtractedComponent): string {
    const hooks: string[] = [];

    // State management
    if (this.hasState(component)) {
      if (component.type === 'filter') {
        hooks.push('const [selectedValue, setSelectedValue] = useState(null);');
      }
      if (component.type === 'chart') {
        hooks.push('const [isLoading, setIsLoading] = useState(false);');
      }
    }

    // Data fetching
    if (component.data && component.data.source !== 'static') {
      hooks.push(`
  useEffect(() => {
    // Fetch data logic here
    setIsLoading(true);
    // ... data fetching implementation
    setIsLoading(false);
  }, []);`);
    }

    return hooks.join('\n  ');
  }

  private generateReactJSX(component: ExtractedComponent, dashboard: DissectedDashboard): string {
    const styles = this.generateInlineStyles(component);
    const className = this.generateClassName(component);

    switch (component.type) {
      case 'chart':
        return this.generateChartJSX(component, dashboard);
      case 'kpi':
        return this.generateKPIJSX(component);
      case 'table':
        return this.generateTableJSX(component);
      case 'filter':
        return this.generateFilterJSX(component);
      case 'text':
        return this.generateTextJSX(component);
      default:
        return this.generateLayoutJSX(component);
    }
  }

  private generateChartJSX(component: ExtractedComponent, dashboard: DissectedDashboard): string {
    const chartType = component.subtype || 'bar';

    switch (this.config.charts) {
      case 'recharts':
        return this.generateRechartsJSX(component, chartType);
      case 'd3':
        return this.generateD3JSX(component, chartType);
      case 'plotly':
        return this.generatePlotlyJSX(component, chartType);
      default:
        return `<div className="${this.generateClassName(component)}">Chart Component</div>`;
    }
  }

  private generateRechartsJSX(component: ExtractedComponent, chartType: string): string {
    const chartComponents = {
      bar: 'BarChart',
      line: 'LineChart',
      pie: 'PieChart',
      scatter: 'ScatterChart'
    };

    const ChartComponent = chartComponents[chartType as keyof typeof chartComponents] || 'BarChart';
    const dataKey = component.data?.fields?.[0]?.name || 'value';
    const nameKey = component.data?.fields?.find(f => f.role === 'dimension')?.name || 'name';

    return `<div className="${this.generateClassName(component)}">
      <ResponsiveContainer width="100%" height={${component.position.height}}>
        <${ChartComponent} data={props.data || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="${nameKey}" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="${dataKey}" fill="${component.styles.colors?.primary || '#007bff'}" />
        </${ChartComponent}>
      </ResponsiveContainer>
    </div>`;
  }

  private generateKPIJSX(component: ExtractedComponent): string {
    return `<div className="${this.generateClassName(component)}">
      <div className="kpi-value">
        {props.value || '${this.extractKPIValue(component)}'}
      </div>
      <div className="kpi-label">
        ${component.name}
      </div>
    </div>`;
  }

  private generateTableJSX(component: ExtractedComponent): string {
    const columns = component.data?.fields || [];

    return `<div className="${this.generateClassName(component)}">
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th key="${col.name}">${col.name}</th>`).join('\n            ')}
          </tr>
        </thead>
        <tbody>
          {(props.data || []).map((row, index) => (
            <tr key={index}>
              ${columns.map(col => `<td key="${col.name}">{row.${col.name}}</td>`).join('\n              ')}
            </tr>
          ))}
        </tbody>
      </table>
    </div>`;
  }

  private generateFilterJSX(component: ExtractedComponent): string {
    return `<div className="${this.generateClassName(component)}">
      <select
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          props.onFilter?.(e.target.value);
        }}
      >
        <option value="">Select ${component.name}</option>
        {(props.options || []).map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>`;
  }

  private generateTextJSX(component: ExtractedComponent): string {
    const textContent = this.extractTextContent(component);
    const tag = this.inferTextTag(component);

    return `<${tag} className="${this.generateClassName(component)}">
      {props.children || '${textContent}'}
    </${tag}>`;
  }

  private generateLayoutJSX(component: ExtractedComponent): string {
    return `<div className="${this.generateClassName(component)}">
      {props.children}
    </div>`;
  }

  private generateMainDashboard(
    components: ExtractedComponent[],
    dashboard: DissectedDashboard
  ): any {
    const isTypeScript = this.config.typescript;
    const extension = isTypeScript ? 'tsx' : 'jsx';

    const imports = components.map(c =>
      `import { ${this.sanitizeComponentName(c.name)} } from './components/${this.sanitizeComponentName(c.name)}';`
    ).join('\n');

    const layout = this.generateLayoutStructure(dashboard.layout, components);

    const content = `import React from 'react';
${imports}
${this.generateStyleImports()}

export const Dashboard${isTypeScript ? ': React.FC' : ''} = () => {
  return (
    <div className="dashboard-container">
      ${layout}
    </div>
  );
};

export default Dashboard;`;

    return {
      name: 'Dashboard',
      path: `src/Dashboard.${extension}`,
      content,
      dependencies: components.map(c => this.sanitizeComponentName(c.name)),
      exports: ['Dashboard']
    };
  }

  private generateLayoutStructure(layout: any, components: ExtractedComponent[]): string {
    if (layout.type === 'grid') {
      return this.generateGridLayout(components);
    } else if (layout.type === 'flex') {
      return this.generateFlexLayout(components);
    } else {
      return this.generateAbsoluteLayout(components);
    }
  }

  private generateGridLayout(components: ExtractedComponent[]): string {
    return `<div className="dashboard-grid">
      ${components.map(component => `
        <${this.sanitizeComponentName(component.name)}
          key="${component.id}"
          className="grid-item"
        />
      `).join('')}
    </div>`;
  }

  private generateFlexLayout(components: ExtractedComponent[]): string {
    return `<div className="dashboard-flex">
      ${components.map(component => `
        <${this.sanitizeComponentName(component.name)}
          key="${component.id}"
          className="flex-item"
        />
      `).join('')}
    </div>`;
  }

  private generateAbsoluteLayout(components: ExtractedComponent[]): string {
    return components.map(component => `
      <${this.sanitizeComponentName(component.name)}
        key="${component.id}"
        style={{
          position: 'absolute',
          left: ${component.position.x}px,
          top: ${component.position.y}px,
          width: ${component.position.width}px,
          height: ${component.position.height}px
        }}
      />
    `).join('');
  }

  private async generateStyles(designSystem: any): Promise<any> {
    const system = this.generateDesignSystemTokens(designSystem);
    const components = this.generateComponentStyles(designSystem);
    const global = this.generateGlobalStyles(designSystem);

    return { system, components, global };
  }

  private generateDesignSystemTokens(designSystem: any): string {
    switch (this.config.styling) {
      case 'tailwind':
        return this.generateTailwindConfig(designSystem);
      case 'styled-components':
      case 'emotion':
        return this.generateThemeObject(designSystem);
      case 'css-modules':
      case 'vanilla-css':
        return this.generateCSSVariables(designSystem);
      default:
        return this.generateCSSVariables(designSystem);
    }
  }

  private generateTailwindConfig(designSystem: any): string {
    return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          ${designSystem.colors.primary.map((color: string, i: number) =>
            `'${(i + 1) * 100}': '${color}'`
          ).join(',\n          ')}
        },
        secondary: {
          ${designSystem.colors.secondary.map((color: string, i: number) =>
            `'${(i + 1) * 100}': '${color}'`
          ).join(',\n          ')}
        }
      },
      fontFamily: {
        primary: ['${designSystem.typography.fontFamilies.primary}'],
        ${designSystem.typography.fontFamilies.secondary ?
          `secondary: ['${designSystem.typography.fontFamilies.secondary}']` : ''}
      },
      fontSize: {
        ${Object.entries(designSystem.typography.fontSizes).map(([key, value]) =>
          `'${key}': '${value}px'`
        ).join(',\n        ')}
      },
      spacing: {
        ${Object.entries(designSystem.spacing).map(([key, value]) =>
          `'${key}': '${value}px'`
        ).join(',\n        ')}
      }
    }
  }
};`;
  }

  private generateThemeObject(designSystem: any): string {
    return `export const theme = {
  colors: {
    primary: ${JSON.stringify(designSystem.colors.primary, null, 2)},
    secondary: ${JSON.stringify(designSystem.colors.secondary, null, 2)},
    neutral: ${JSON.stringify(designSystem.colors.neutral, null, 2)},
    semantic: ${JSON.stringify(designSystem.colors.semantic, null, 2)}
  },
  typography: ${JSON.stringify(designSystem.typography, null, 2)},
  spacing: ${JSON.stringify(designSystem.spacing, null, 2)},
  shadows: ${JSON.stringify(designSystem.shadows, null, 2)},
  borderRadius: ${JSON.stringify(designSystem.borderRadius, null, 2)}
};`;
  }

  private generateCSSVariables(designSystem: any): string {
    const variables: string[] = [];

    // Colors
    designSystem.colors.primary.forEach((color: string, i: number) => {
      variables.push(`  --color-primary-${(i + 1) * 100}: ${color};`);
    });

    // Typography
    Object.entries(designSystem.typography.fontSizes).forEach(([key, value]) => {
      variables.push(`  --font-size-${key}: ${value}px;`);
    });

    // Spacing
    Object.entries(designSystem.spacing).forEach(([key, value]) => {
      variables.push(`  --spacing-${key}: ${value}px;`);
    });

    return `:root {
${variables.join('\n')}
}`;
  }

  private async generateDataLayer(dataModel: any): Promise<any> {
    const hooks = this.generateDataHooks(dataModel);
    const queries = this.generateDataQueries(dataModel);
    const transformers = this.generateDataTransformers(dataModel);
    const mocks = this.generateMockData(dataModel);

    return { hooks, queries, transformers, mocks };
  }

  private generateDataHooks(dataModel: any): Record<string, string> {
    const hooks: Record<string, string> = {};

    // Generate useData hook
    hooks.useData = `import { useState, useEffect } from 'react';

export const useData = (source: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Implement data fetching logic
        const response = await fetch(\`/api/data/\${source}\`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [source]);

  return { data, loading, error };
};`;

    return hooks;
  }

  private generateDataQueries(dataModel: any): Record<string, string> {
    return {
      fetchDashboardData: `export const fetchDashboardData = async () => {
  // Implement data fetching logic
  return [];
};`
    };
  }

  private generateDataTransformers(dataModel: any): Record<string, string> {
    return {
      transformChartData: `export const transformChartData = (data: any[]) => {
  // Implement data transformation logic
  return data;
};`
    };
  }

  private generateMockData(dataModel: any): Record<string, any> {
    return {
      sampleData: [
        { name: 'Category A', value: 100 },
        { name: 'Category B', value: 200 },
        { name: 'Category C', value: 150 }
      ]
    };
  }

  private async generateTests(components: any[]): Promise<any[]> {
    return components.map(component => ({
      name: `${component.name}.test`,
      path: `src/__tests__/${component.name}.test.${this.config.typescript ? 'tsx' : 'jsx'}`,
      content: this.generateComponentTest(component),
      type: 'unit' as const
    }));
  }

  private generateComponentTest(component: any): string {
    return `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${component.name} } from '../components/${component.name}';

describe('${component.name}', () => {
  it('renders without crashing', () => {
    render(<${component.name} />);
  });

  it('displays the correct content', () => {
    render(<${component.name} />);
    // Add specific test assertions
  });
});`;
  }

  private async generateStories(components: any[]): Promise<any[]> {
    return components.map(component => ({
      name: `${component.name}.stories`,
      path: `src/stories/${component.name}.stories.${this.config.typescript ? 'tsx' : 'jsx'}`,
      content: this.generateComponentStory(component)
    }));
  }

  private generateComponentStory(component: any): string {
    return `import type { Meta, StoryObj } from '@storybook/react';
import { ${component.name} } from '../components/${component.name}';

const meta: Meta<typeof ${component.name}> = {
  title: 'Dashboard/${component.name}',
  component: ${component.name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Add default props
  },
};`;
  }

  private async generateProjectConfig(): Promise<any> {
    const packageJson = this.generatePackageJson();
    const tsconfig = this.config.typescript ? this.generateTsConfig() : undefined;
    const eslint = this.config.eslint ? this.generateEslintConfig() : undefined;
    const prettier = this.config.prettier ? this.generatePrettierConfig() : undefined;

    return { package: packageJson, tsconfig, eslint, prettier };
  }

  private generatePackageJson(): any {
    const dependencies: Record<string, string> = {
      'react': '^18.0.0',
      'react-dom': '^18.0.0'
    };

    // Framework-specific dependencies
    if (this.config.framework === 'nextjs') {
      dependencies['next'] = '^14.0.0';
    }

    // Chart library dependencies
    switch (this.config.charts) {
      case 'recharts':
        dependencies['recharts'] = '^2.8.0';
        break;
      case 'd3':
        dependencies['d3'] = '^7.8.0';
        break;
      case 'plotly':
        dependencies['react-plotly.js'] = '^2.6.0';
        dependencies['plotly.js'] = '^2.26.0';
        break;
      case 'chartjs':
        dependencies['react-chartjs-2'] = '^5.2.0';
        dependencies['chart.js'] = '^4.4.0';
        break;
    }

    // Styling dependencies
    switch (this.config.styling) {
      case 'styled-components':
        dependencies['styled-components'] = '^6.1.0';
        break;
      case 'emotion':
        dependencies['@emotion/react'] = '^11.11.0';
        dependencies['@emotion/styled'] = '^11.11.0';
        break;
      case 'tailwind':
        dependencies['tailwindcss'] = '^3.3.0';
        break;
    }

    if (this.config.typescript) {
      dependencies['typescript'] = '^5.0.0';
      dependencies['@types/react'] = '^18.0.0';
      dependencies['@types/react-dom'] = '^18.0.0';
    }

    return {
      name: 'generated-dashboard',
      version: '1.0.0',
      private: true,
      dependencies,
      scripts: {
        dev: this.config.framework === 'nextjs' ? 'next dev' : 'vite dev',
        build: this.config.framework === 'nextjs' ? 'next build' : 'vite build',
        start: this.config.framework === 'nextjs' ? 'next start' : 'vite preview',
        lint: this.config.eslint ? 'eslint src --ext .js,.jsx,.ts,.tsx' : undefined,
        test: this.config.testing ? 'jest' : undefined
      }
    };
  }

  private generateTsConfig(): any {
    return {
      compilerOptions: {
        target: 'ES2020',
        lib: ['DOM', 'DOM.Iterable', 'ES6'],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx'
      },
      include: ['src/**/*'],
      exclude: ['node_modules']
    };
  }

  private generateEslintConfig(): any {
    return {
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react'],
      rules: {
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off'
      },
      settings: {
        react: {
          version: 'detect'
        }
      }
    };
  }

  private generatePrettierConfig(): any {
    return {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2
    };
  }

  // Utility methods
  private sanitizeComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, 'Component$&')
      .replace(/^./, str => str.toUpperCase());
  }

  private hasState(component: ExtractedComponent): boolean {
    return component.type === 'filter' ||
           (component.interactions && component.interactions.length > 0) ||
           (component.data && component.data.source !== 'static');
  }

  private generateClassName(component: ExtractedComponent): string {
    const baseName = component.type;
    const modifiers = [];

    if (component.metadata?.complexity === 'high') modifiers.push('complex');
    if (component.metadata?.interactivity !== 'static') modifiers.push('interactive');

    return [baseName, ...modifiers].join(' ');
  }

  private generateInlineStyles(component: ExtractedComponent): string {
    const styles: string[] = [];

    if (component.position) {
      styles.push(`width: ${component.position.width}px`);
      styles.push(`height: ${component.position.height}px`);
    }

    return styles.join('; ');
  }

  private generateComponentStyles(component: ExtractedComponent): string {
    // This would generate component-specific styles
    return '';
  }

  private extractDependencies(component: ExtractedComponent): string[] {
    const deps = ['react'];

    if (component.type === 'chart') {
      deps.push(this.config.charts);
    }

    return deps;
  }

  private extractKPIValue(component: ExtractedComponent): string {
    // Extract numeric value from component name or content
    const match = component.name.match(/[\d,]+/);
    return match ? match[0] : '0';
  }

  private extractTextContent(component: ExtractedComponent): string {
    return component.name || '';
  }

  private inferTextTag(component: ExtractedComponent): string {
    const name = component.name.toLowerCase();

    if (name.includes('heading') || name.includes('title')) return 'h2';
    if (name.includes('subtitle')) return 'h3';
    if (name.includes('label')) return 'label';

    return 'p';
  }

  private generateStyleImports(): string {
    switch (this.config.styling) {
      case 'tailwind':
        return "import './styles/globals.css';";
      case 'css-modules':
        return "import styles from './Dashboard.module.css';";
      default:
        return "import './Dashboard.css';";
    }
  }

  // Vue.js generation methods (simplified)
  private generateVueComponent(component: ExtractedComponent, dashboard: DissectedDashboard): any {
    const componentName = this.sanitizeComponentName(component.name);

    const content = `<template>
  <div class="${this.generateClassName(component)}">
    <!-- Vue component template -->
  </div>
</template>

<script${this.config.typescript ? ' lang="ts"' : ''}>
export default {
  name: '${componentName}',
  props: {
    // Component props
  },
  data() {
    return {
      // Component data
    };
  }
};
</script>

<style scoped>
/* Component styles */
</style>`;

    return {
      name: componentName,
      path: `src/components/${componentName}.vue`,
      content,
      dependencies: this.extractDependencies(component),
      exports: [componentName]
    };
  }

  // Angular generation methods (simplified)
  private generateAngularComponent(component: ExtractedComponent, dashboard: DissectedDashboard): any {
    const componentName = this.sanitizeComponentName(component.name);

    const content = `import { Component } from '@angular/core';

@Component({
  selector: 'app-${componentName.toLowerCase()}',
  template: \`
    <div class="${this.generateClassName(component)}">
      <!-- Angular component template -->
    </div>
  \`,
  styleUrls: ['./${componentName.toLowerCase()}.component.css']
})
export class ${componentName}Component {
  // Component logic
}`;

    return {
      name: `${componentName}Component`,
      path: `src/app/components/${componentName.toLowerCase()}/${componentName.toLowerCase()}.component.ts`,
      content,
      dependencies: this.extractDependencies(component),
      exports: [`${componentName}Component`]
    };
  }

  // Svelte generation methods (simplified)
  private generateSvelteComponent(component: ExtractedComponent, dashboard: DissectedDashboard): any {
    const componentName = this.sanitizeComponentName(component.name);

    const content = `<script${this.config.typescript ? ' lang="ts"' : ''}>
  // Component logic
</script>

<div class="${this.generateClassName(component)}">
  <!-- Svelte component template -->
</div>

<style>
  /* Component styles */
</style>`;

    return {
      name: componentName,
      path: `src/lib/components/${componentName}.svelte`,
      content,
      dependencies: this.extractDependencies(component),
      exports: [componentName]
    };
  }

  private generateD3JSX(component: ExtractedComponent, chartType: string): string {
    return `<div className="${this.generateClassName(component)}" ref={chartRef}>
      <!-- D3 chart will be rendered here -->
    </div>`;
  }

  private generatePlotlyJSX(component: ExtractedComponent, chartType: string): string {
    return `<Plot
      data={[{
        x: props.data?.map(d => d.x) || [],
        y: props.data?.map(d => d.y) || [],
        type: '${chartType === 'bar' ? 'bar' : 'scatter'}'
      }]}
      layout={{
        width: ${component.position.width},
        height: ${component.position.height},
        title: '${component.name}'
      }}
    />`;
  }

  private generateGlobalStyles(designSystem: any): string {
    return `/* Global Dashboard Styles */
body {
  font-family: ${designSystem.typography.fontFamilies.primary};
  color: ${designSystem.colors.neutral[0] || '#000000'};
  background: ${designSystem.colors.neutral[designSystem.colors.neutral.length - 1] || '#ffffff'};
}

.dashboard-container {
  min-height: 100vh;
  padding: ${designSystem.spacing.lg || 24}px;
}

.dashboard-grid {
  display: grid;
  gap: ${designSystem.spacing.md || 16}px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.dashboard-flex {
  display: flex;
  flex-wrap: wrap;
  gap: ${designSystem.spacing.md || 16}px;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: ${designSystem.spacing.sm || 8}px;
  }
}`;
  }
}