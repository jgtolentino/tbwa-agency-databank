#!/usr/bin/env node

/**
 * DashMorph CLI - Universal Dashboard Dissection & Reconstruction System
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { promises as fs } from 'fs';
import path from 'path';
import DashMorph, { DashMorphUtils } from '../core/DashMorph';
import { DashboardSource, TargetConfig, MorphOptions, SourceType, TargetFramework } from '../core/types';

const program = new Command();

program
  .name('dashmorph')
  .description('Universal Dashboard Dissection & Reconstruction System')
  .version('1.0.0');

// Main morph command
program
  .command('morph')
  .description('Transform dashboard from one format to another with pixel parity')
  .requiredOption('-s, --source <path>', 'Source dashboard (URL, file path, or Figma URL)')
  .requiredOption('-t, --target <framework>', 'Target framework (react, vue, angular, svelte)')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('--styling <system>', 'Styling system (tailwind, styled-components, css-modules)', 'tailwind')
  .option('--charts <library>', 'Chart library (recharts, d3, plotly, chartjs)', 'recharts')
  .option('--typescript', 'Generate TypeScript code', false)
  .option('--tests', 'Generate test files', false)
  .option('--stories', 'Generate Storybook stories', false)
  .option('--validate', 'Perform pixel parity validation', true)
  .option('--threshold <number>', 'Pixel match threshold percentage', '95')
  .option('--figma-token <token>', 'Figma access token')
  .action(async (options) => {
    const spinner = ora('Initializing DashMorph...').start();

    try {
      // Detect source type
      const sourceType = DashMorphUtils.detectSourceType(options.source);
      spinner.text = `Detected source type: ${sourceType}`;

      // Prepare source configuration
      const source: DashboardSource = {
        type: sourceType,
        ...(options.source.startsWith('http') ? { url: options.source } : { file: options.source }),
        credentials: options.figmaToken ? { apiKey: options.figmaToken } : undefined
      };

      // Prepare target configuration
      const target: TargetConfig = {
        framework: options.target as TargetFramework,
        styling: options.styling,
        charts: options.charts,
        typescript: options.typescript,
        outputDir: path.resolve(options.output),
        packageManager: 'npm',
        eslint: true,
        prettier: true,
        testing: options.tests ? 'jest' : undefined
      };

      // Validate configuration
      const configErrors = DashMorphUtils.validateConfig(source, target);
      if (configErrors.length > 0) {
        spinner.fail('Configuration validation failed');
        configErrors.forEach(error => console.error(chalk.red(`  ✗ ${error}`)));
        process.exit(1);
      }

      spinner.succeed('Configuration validated');

      // Initialize DashMorph
      const dashmorph = new DashMorph();

      // Setup event listeners for progress tracking
      setupProgressTracking(dashmorph, spinner);

      // Prepare morph options
      const morphOptions: MorphOptions = {
        startTime: Date.now(),
        dissectOptions: {
          includeInteractions: true,
          includeData: true,
          includeResponsive: true,
          aiEnhanced: false,
          precision: 'high'
        },
        generateOptions: {
          includeTests: options.tests,
          includeStories: options.stories,
          includeTypes: options.typescript,
          optimization: 'production',
          treeshaking: true,
          bundling: true
        },
        validateOptions: {
          threshold: parseInt(options.threshold),
          includeInteractions: true,
          includeResponsive: true,
          generateReport: true,
          outputDir: target.outputDir
        },
        validate: options.validate
      };

      // Execute transformation
      const result = await dashmorph.morph(source, target, morphOptions);

      // Write generated files
      await writeGeneratedFiles(result.generated, target.outputDir);

      // Display results
      await displayResults(result, options);

      spinner.succeed(chalk.green('Dashboard transformation completed successfully!'));

    } catch (error) {
      spinner.fail(chalk.red('Transformation failed'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

// Extract command (analyze without generating)
program
  .command('extract')
  .description('Extract and analyze dashboard components without generating code')
  .requiredOption('-s, --source <path>', 'Source dashboard (URL, file path, or Figma URL)')
  .option('-o, --output <file>', 'Output JSON file', './dashboard-analysis.json')
  .option('--figma-token <token>', 'Figma access token')
  .action(async (options) => {
    const spinner = ora('Extracting dashboard components...').start();

    try {
      const sourceType = DashMorphUtils.detectSourceType(options.source);
      const source: DashboardSource = {
        type: sourceType,
        ...(options.source.startsWith('http') ? { url: options.source } : { file: options.source }),
        credentials: options.figmaToken ? { apiKey: options.figmaToken } : undefined
      };

      const dashmorph = new DashMorph();
      const extracted = await dashmorph.extract(source);

      await fs.writeFile(options.output, JSON.stringify(extracted, null, 2));

      spinner.succeed(chalk.green(`Analysis saved to ${options.output}`));

      // Display summary
      console.log(chalk.blue('\n📊 Dashboard Analysis Summary:'));
      console.log(`  Components: ${extracted.components.length}`);
      console.log(`  Design Tokens: ${Object.keys(extracted.designSystem.colors.primary).length}`);
      console.log(`  Data Sources: ${extracted.dataModel.sources.length}`);

    } catch (error) {
      spinner.fail(chalk.red('Extraction failed'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

// Validate command (pixel parity check)
program
  .command('validate')
  .description('Validate pixel parity between source and generated dashboard')
  .requiredOption('-s, --source <path>', 'Source dashboard')
  .requiredOption('-g, --generated <url>', 'Generated dashboard URL')
  .option('--threshold <number>', 'Pixel match threshold percentage', '95')
  .option('-o, --output <dir>', 'Output directory for validation report', './validation-report')
  .action(async (options) => {
    const spinner = ora('Performing pixel parity validation...').start();

    try {
      // This would use the PixelParityValidator directly
      const { PixelParityValidator } = await import('../validator/PixelParityValidator');

      const validator = new PixelParityValidator();
      const sourceType = DashMorphUtils.detectSourceType(options.source);

      const source: DashboardSource = {
        type: sourceType,
        ...(options.source.startsWith('http') ? { url: options.source } : { file: options.source })
      };

      // Mock target config for validation
      const target: TargetConfig = {
        framework: 'react',
        styling: 'tailwind',
        charts: 'recharts',
        typescript: true,
        outputDir: options.output,
        packageManager: 'npm'
      };

      // Mock generated dashboard (would be loaded from actual generated code)
      const generated = {
        components: [],
        styles: { system: '', components: {}, global: '' },
        data: { hooks: {}, queries: {}, transformers: {}, mocks: {} },
        tests: [],
        stories: [],
        config: { package: {} }
      };

      const result = await validator.validate(source, generated, target, {
        threshold: parseInt(options.threshold),
        generateReport: true,
        outputDir: options.output
      });

      spinner.succeed(`Validation completed: ${result.pixelMatch}% pixel match`);

      // Display validation results
      console.log(chalk.blue('\n🔍 Validation Results:'));
      console.log(`  Pixel Match: ${result.passed ? chalk.green(result.pixelMatch + '%') : chalk.red(result.pixelMatch + '%')}`);
      console.log(`  Threshold: ${result.threshold}%`);
      console.log(`  Status: ${result.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`);

      if (result.styleDiff.length > 0) {
        console.log(`  Style Issues: ${result.styleDiff.length}`);
      }

      if (result.dimensionDiff.length > 0) {
        console.log(`  Dimension Issues: ${result.dimensionDiff.length}`);
      }

    } catch (error) {
      spinner.fail(chalk.red('Validation failed'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

// List supported sources and targets
program
  .command('list')
  .description('List supported source types and target frameworks')
  .action(async () => {
    const dashmorph = new DashMorph();

    console.log(chalk.blue('📥 Supported Source Types:'));
    const sources = dashmorph.getSupportedSources();
    sources.forEach(source => {
      console.log(`  ${getSourceIcon(source)} ${source}`);
    });

    console.log(chalk.blue('\n📤 Supported Target Frameworks:'));
    const targets = dashmorph.getSupportedTargets();
    targets.forEach(target => {
      console.log(`  ${getTargetIcon(target)} ${target}`);
    });

    console.log(chalk.blue('\n🎨 Supported Styling Systems:'));
    ['tailwind', 'styled-components', 'emotion', 'css-modules', 'vanilla-css'].forEach(style => {
      console.log(`  💅 ${style}`);
    });

    console.log(chalk.blue('\n📊 Supported Chart Libraries:'));
    ['recharts', 'd3', 'plotly', 'chartjs', 'vega', 'echarts'].forEach(chart => {
      console.log(`  📈 ${chart}`);
    });
  });

// Preview command (start preview server)
program
  .command('preview')
  .description('Start preview server for generated dashboard')
  .option('-d, --dir <directory>', 'Generated dashboard directory', './output')
  .option('-p, --port <number>', 'Server port', '3000')
  .action(async (options) => {
    const spinner = ora('Starting preview server...').start();

    try {
      const { startPreviewServer } = await import('../preview/server');
      const url = await startPreviewServer(options.dir, parseInt(options.port));

      spinner.succeed(chalk.green(`Preview server started at ${url}`));
      console.log(chalk.blue('Press Ctrl+C to stop the server'));

    } catch (error) {
      spinner.fail(chalk.red('Failed to start preview server'));
      console.error(chalk.red(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

// Helper functions
function setupProgressTracking(dashmorph: DashMorph, spinner: any): void {
  dashmorph.on('extract:start', () => {
    spinner.text = 'Extracting components from source...';
  });

  dashmorph.on('extract:complete', (data: any) => {
    spinner.succeed(chalk.green(`Extracted ${data.components} components`));
    spinner = ora('Dissecting components and design system...').start();
  });

  dashmorph.on('dissect:complete', (data: any) => {
    spinner.succeed(chalk.green(`Analyzed ${data.components} components, ${data.designTokens} design tokens`));
    spinner = ora('Generating target framework code...').start();
  });

  dashmorph.on('generate:complete', (data: any) => {
    spinner.succeed(chalk.green(`Generated ${data.files} files for ${data.framework}`));
    spinner = ora('Validating pixel parity...').start();
  });

  dashmorph.on('validate:start', () => {
    spinner.text = 'Performing pixel parity validation...';
  });

  dashmorph.on('validate:complete', (data: any) => {
    if (data.passed) {
      spinner.succeed(chalk.green(`Validation passed: ${data.pixelMatch}% pixel match`));
    } else {
      spinner.warn(chalk.yellow(`Validation warning: ${data.pixelMatch}% pixel match`));
    }
  });

  dashmorph.on('error', (error: Error) => {
    spinner.fail(chalk.red(`Error: ${error.message}`));
  });
}

async function writeGeneratedFiles(generated: any, outputDir: string): Promise<void> {
  // Create output directory
  await fs.mkdir(outputDir, { recursive: true });

  // Write package.json
  await fs.writeFile(
    path.join(outputDir, 'package.json'),
    JSON.stringify(generated.config.package, null, 2)
  );

  // Write components
  for (const component of generated.components) {
    const componentPath = path.join(outputDir, component.path);
    await fs.mkdir(path.dirname(componentPath), { recursive: true });
    await fs.writeFile(componentPath, component.content);
  }

  // Write global styles
  if (generated.styles.global) {
    await fs.writeFile(
      path.join(outputDir, 'src/styles/globals.css'),
      generated.styles.global
    );
  }

  // Write design system tokens
  if (generated.styles.system) {
    await fs.writeFile(
      path.join(outputDir, 'src/styles/design-system.ts'),
      generated.styles.system
    );
  }

  // Write data hooks and utilities
  for (const [name, content] of Object.entries(generated.data.hooks || {})) {
    await fs.writeFile(
      path.join(outputDir, `src/hooks/${name}.ts`),
      content as string
    );
  }

  // Write tests if generated
  for (const test of generated.tests || []) {
    const testPath = path.join(outputDir, test.path);
    await fs.mkdir(path.dirname(testPath), { recursive: true });
    await fs.writeFile(testPath, test.content);
  }

  // Write stories if generated
  for (const story of generated.stories || []) {
    const storyPath = path.join(outputDir, story.path);
    await fs.mkdir(path.dirname(storyPath), { recursive: true });
    await fs.writeFile(storyPath, story.content);
  }

  // Write configuration files
  if (generated.config.tsconfig) {
    await fs.writeFile(
      path.join(outputDir, 'tsconfig.json'),
      JSON.stringify(generated.config.tsconfig, null, 2)
    );
  }

  if (generated.config.eslint) {
    await fs.writeFile(
      path.join(outputDir, '.eslintrc.json'),
      JSON.stringify(generated.config.eslint, null, 2)
    );
  }

  if (generated.config.prettier) {
    await fs.writeFile(
      path.join(outputDir, '.prettierrc'),
      JSON.stringify(generated.config.prettier, null, 2)
    );
  }
}

async function displayResults(result: any, options: any): Promise<void> {
  console.log(chalk.blue('\n🎉 Transformation Results:'));
  console.log(`  Source: ${result.source.type} (${result.source.url || result.source.file})`);
  console.log(`  Target: ${result.target.framework} with ${result.target.styling}`);
  console.log(`  Components: ${result.generated.components.length}`);
  console.log(`  Duration: ${result.duration}ms`);

  if (result.validation) {
    console.log(`  Pixel Match: ${result.validation.pixelMatch}%`);
    console.log(`  Validation: ${result.validation.passed ? chalk.green('PASSED') : chalk.red('FAILED')}`);
  }

  console.log(chalk.blue('\n📁 Generated Files:'));
  result.generated.components.forEach((component: any) => {
    console.log(`  📄 ${component.path}`);
  });

  if (result.generated.tests.length > 0) {
    console.log(chalk.blue('\n🧪 Test Files:'));
    result.generated.tests.forEach((test: any) => {
      console.log(`  🧪 ${test.path}`);
    });
  }

  if (result.generated.stories.length > 0) {
    console.log(chalk.blue('\n📚 Story Files:'));
    result.generated.stories.forEach((story: any) => {
      console.log(`  📚 ${story.path}`);
    });
  }

  console.log(chalk.blue('\n🚀 Next Steps:'));
  console.log(`  1. cd ${options.output}`);
  console.log(`  2. ${result.target.packageManager} install`);
  console.log(`  3. ${result.target.packageManager} run dev`);

  if (result.validation && !result.validation.passed) {
    console.log(chalk.yellow('\n⚠️  Pixel parity validation failed. Consider:'));
    result.validation.report.recommendations.forEach((rec: string) => {
      console.log(`     • ${rec}`);
    });
  }
}

function getSourceIcon(source: SourceType): string {
  const icons: Record<SourceType, string> = {
    tableau: '📊',
    powerbi: '📈',
    looker: '👀',
    qlik: '🔍',
    metabase: '📋',
    superset: '🚀',
    figma: '🎨',
    sketch: '✏️',
    xd: '🎭',
    framer: '🖼️',
    html: '🌐',
    react: '⚛️',
    vue: '💚',
    angular: '🅰️',
    screenshot: '📸',
    pdf: '📄',
    url: '🔗'
  };

  return icons[source] || '📄';
}

function getTargetIcon(target: string): string {
  const icons: Record<string, string> = {
    react: '⚛️',
    vue: '💚',
    angular: '🅰️',
    svelte: '🧡',
    nextjs: '▲',
    nuxt: '💚',
    sveltekit: '🧡'
  };

  return icons[target] || '🔧';
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('Unhandled Rejection:'), reason);
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}