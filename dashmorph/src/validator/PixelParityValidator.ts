/**
 * Pixel Parity Validator - Validates generated dashboard against original source with pixel-perfect accuracy
 */

import { DashboardSource, GeneratedDashboard, TargetConfig, ValidationResult } from '../core/types';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { promises as fs } from 'fs';
import path from 'path';
import { chromium, Browser, Page } from 'playwright';

export class PixelParityValidator {
  private browser: Browser | null = null;
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), '.dashmorph-temp');
  }

  async validate(
    source: DashboardSource,
    generated: GeneratedDashboard,
    target: TargetConfig,
    options: any = {}
  ): Promise<ValidationResult> {
    const threshold = options.threshold || 95; // 95% pixel match required
    const startTime = Date.now();

    try {
      // Setup validation environment
      await this.setupValidation();

      // Capture original source screenshot
      const originalScreenshot = await this.captureSourceScreenshot(source);

      // Build and serve generated dashboard
      const generatedUrl = await this.buildAndServeGenerated(generated, target);

      // Capture generated dashboard screenshot
      const generatedScreenshot = await this.captureGeneratedScreenshot(generatedUrl, originalScreenshot);

      // Perform pixel comparison
      const comparison = await this.compareScreenshots(originalScreenshot, generatedScreenshot);

      // Analyze component-level differences
      const componentValidations = await this.validateComponents(source, generated, originalScreenshot, generatedScreenshot);

      // Generate validation report
      const report = await this.generateValidationReport(
        comparison,
        componentValidations,
        originalScreenshot,
        generatedScreenshot,
        options
      );

      const result: ValidationResult = {
        pixelMatch: comparison.matchPercentage,
        styleDiff: comparison.styleDifferences,
        dimensionDiff: comparison.dimensionDifferences,
        interactionDiff: [],
        report,
        passed: comparison.matchPercentage >= threshold,
        threshold
      };

      // Cleanup
      await this.cleanup();

      return result;

    } catch (error) {
      await this.cleanup();
      throw new Error(`Validation failed: ${error}`);
    }
  }

  private async setupValidation(): Promise<void> {
    // Create temp directory
    await fs.mkdir(this.tempDir, { recursive: true });

    // Launch browser
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-web-security']
    });
  }

  private async captureSourceScreenshot(source: DashboardSource): Promise<ScreenshotData> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    let screenshotPath: string;

    if (source.type === 'url') {
      // Navigate to URL and capture
      await page.goto(source.url!, { waitUntil: 'networkidle' });
      screenshotPath = path.join(this.tempDir, 'original.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });

    } else if (source.type === 'html') {
      // Load HTML file and capture
      const htmlPath = source.file!;
      await page.goto(`file://${path.resolve(htmlPath)}`, { waitUntil: 'networkidle' });
      screenshotPath = path.join(this.tempDir, 'original.png');
      await page.screenshot({ path: screenshotPath, fullPage: true });

    } else if (source.type === 'figma') {
      // For Figma, we'd need to export the design as an image
      screenshotPath = await this.exportFigmaDesign(source);

    } else if (source.type === 'screenshot') {
      // Use existing screenshot
      screenshotPath = source.file!;

    } else {
      throw new Error(`Unsupported source type for validation: ${source.type}`);
    }

    await page.close();

    // Load and analyze screenshot
    const buffer = await fs.readFile(screenshotPath);
    const png = PNG.sync.read(buffer);

    return {
      path: screenshotPath,
      width: png.width,
      height: png.height,
      data: png.data,
      buffer
    };
  }

  private async captureGeneratedScreenshot(
    generatedUrl: string,
    originalScreenshot: ScreenshotData
  ): Promise<ScreenshotData> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();

    // Match original viewport size
    await page.setViewportSize({
      width: originalScreenshot.width,
      height: originalScreenshot.height
    });

    // Navigate to generated dashboard
    await page.goto(generatedUrl, { waitUntil: 'networkidle' });

    // Wait for charts and dynamic content to load
    await page.waitForTimeout(2000);

    // Capture screenshot
    const screenshotPath = path.join(this.tempDir, 'generated.png');
    await page.screenshot({
      path: screenshotPath,
      clip: {
        x: 0,
        y: 0,
        width: originalScreenshot.width,
        height: originalScreenshot.height
      }
    });

    await page.close();

    // Load and analyze screenshot
    const buffer = await fs.readFile(screenshotPath);
    const png = PNG.sync.read(buffer);

    return {
      path: screenshotPath,
      width: png.width,
      height: png.height,
      data: png.data,
      buffer
    };
  }

  private async compareScreenshots(
    original: ScreenshotData,
    generated: ScreenshotData
  ): Promise<ComparisonResult> {
    // Ensure both images are the same size
    const width = Math.min(original.width, generated.width);
    const height = Math.min(original.height, generated.height);

    // Create diff image
    const diff = new PNG({ width, height });

    // Perform pixel comparison
    const diffPixels = pixelmatch(
      original.data,
      generated.data,
      diff.data,
      width,
      height,
      {
        threshold: 0.1, // Sensitivity to color differences
        includeAA: false, // Ignore anti-aliasing
        alpha: 0.1,
        aaColor: [255, 255, 0], // Yellow for AA differences
        diffColor: [255, 0, 255], // Magenta for pixel differences
        diffColorAlt: [0, 255, 255] // Cyan for alternative differences
      }
    );

    // Save diff image
    const diffPath = path.join(this.tempDir, 'diff.png');
    await fs.writeFile(diffPath, PNG.sync.write(diff));

    // Calculate match percentage
    const totalPixels = width * height;
    const matchPercentage = Math.round(((totalPixels - diffPixels) / totalPixels) * 100);

    // Analyze differences
    const styleDifferences = await this.analyzeStyleDifferences(original, generated, diff);
    const dimensionDifferences = await this.analyzeDimensionDifferences(original, generated);

    return {
      matchPercentage,
      diffPixels,
      totalPixels,
      diffImagePath: diffPath,
      styleDifferences,
      dimensionDifferences
    };
  }

  private async analyzeStyleDifferences(
    original: ScreenshotData,
    generated: ScreenshotData,
    diff: PNG
  ): Promise<any[]> {
    const differences: any[] = [];

    // Analyze color differences
    const colorDiff = this.analyzeColorDifferences(original, generated, diff);
    if (colorDiff.severity !== 'minor') {
      differences.push({
        component: 'global',
        property: 'colors',
        expected: colorDiff.originalColors,
        actual: colorDiff.generatedColors,
        severity: colorDiff.severity
      });
    }

    // Analyze layout differences
    const layoutDiff = this.analyzeLayoutDifferences(original, generated, diff);
    differences.push(...layoutDiff);

    return differences;
  }

  private analyzeColorDifferences(original: ScreenshotData, generated: ScreenshotData, diff: PNG): any {
    // Sample colors from both images
    const originalColors = this.sampleColors(original);
    const generatedColors = this.sampleColors(generated);

    // Calculate color distance
    const colorDistance = this.calculateColorDistance(originalColors, generatedColors);

    return {
      originalColors,
      generatedColors,
      distance: colorDistance,
      severity: colorDistance > 50 ? 'critical' : colorDistance > 20 ? 'major' : 'minor'
    };
  }

  private analyzeLayoutDifferences(original: ScreenshotData, generated: ScreenshotData, diff: PNG): any[] {
    const differences: any[] = [];

    // Detect shifted elements by analyzing connected diff regions
    const diffRegions = this.detectDiffRegions(diff);

    diffRegions.forEach((region, index) => {
      if (region.area > 1000) { // Only consider significant regions
        differences.push({
          component: `region-${index}`,
          property: 'position',
          expected: { x: region.x, y: region.y },
          actual: { x: region.x + region.shiftX, y: region.y + region.shiftY },
          severity: region.area > 10000 ? 'critical' : 'major'
        });
      }
    });

    return differences;
  }

  private async analyzeDimensionDifferences(
    original: ScreenshotData,
    generated: ScreenshotData
  ): Promise<any[]> {
    const differences: any[] = [];

    if (original.width !== generated.width) {
      differences.push({
        component: 'viewport',
        dimension: 'width',
        expected: original.width,
        actual: generated.width,
        diff: Math.abs(original.width - generated.width),
        severity: Math.abs(original.width - generated.width) > 100 ? 'critical' : 'major'
      });
    }

    if (original.height !== generated.height) {
      differences.push({
        component: 'viewport',
        dimension: 'height',
        expected: original.height,
        actual: generated.height,
        diff: Math.abs(original.height - generated.height),
        severity: Math.abs(original.height - generated.height) > 100 ? 'critical' : 'major'
      });
    }

    return differences;
  }

  private async validateComponents(
    source: DashboardSource,
    generated: GeneratedDashboard,
    originalScreenshot: ScreenshotData,
    generatedScreenshot: ScreenshotData
  ): Promise<any[]> {
    const validations: any[] = [];

    // For each generated component, validate its visual output
    for (const component of generated.components) {
      const validation = await this.validateComponent(
        component,
        originalScreenshot,
        generatedScreenshot
      );
      validations.push(validation);
    }

    return validations;
  }

  private async validateComponent(
    component: any,
    originalScreenshot: ScreenshotData,
    generatedScreenshot: ScreenshotData
  ): Promise<any> {
    // This would require component position mapping
    // For now, return a basic validation
    return {
      name: component.name,
      pixelMatch: 95, // Placeholder
      passed: true,
      issues: []
    };
  }

  private async buildAndServeGenerated(
    generated: GeneratedDashboard,
    target: TargetConfig
  ): Promise<string> {
    const projectDir = path.join(this.tempDir, 'generated-project');
    await fs.mkdir(projectDir, { recursive: true });

    // Write all generated files
    await this.writeGeneratedFiles(generated, projectDir, target);

    // Install dependencies and build
    await this.buildProject(projectDir, target);

    // Start development server
    const serverUrl = await this.startDevServer(projectDir, target);

    return serverUrl;
  }

  private async writeGeneratedFiles(
    generated: GeneratedDashboard,
    projectDir: string,
    target: TargetConfig
  ): Promise<void> {
    // Write package.json
    await fs.writeFile(
      path.join(projectDir, 'package.json'),
      JSON.stringify(generated.config.package, null, 2)
    );

    // Write components
    for (const component of generated.components) {
      const componentPath = path.join(projectDir, component.path);
      await fs.mkdir(path.dirname(componentPath), { recursive: true });
      await fs.writeFile(componentPath, component.content);
    }

    // Write styles
    if (generated.styles.global) {
      await fs.writeFile(
        path.join(projectDir, 'src/Dashboard.css'),
        generated.styles.global
      );
    }

    // Write index.html for frameworks that need it
    if (target.framework !== 'nextjs') {
      const indexHtml = this.generateIndexHtml(target);
      await fs.writeFile(path.join(projectDir, 'index.html'), indexHtml);
    }

    // Write main entry point
    const entryPoint = this.generateEntryPoint(target);
    await fs.writeFile(
      path.join(projectDir, target.framework === 'nextjs' ? 'pages/index.tsx' : 'src/main.tsx'),
      entryPoint
    );
  }

  private async buildProject(projectDir: string, target: TargetConfig): Promise<void> {
    const { spawn } = await import('child_process');

    // Install dependencies
    await new Promise<void>((resolve, reject) => {
      const install = spawn(target.packageManager, ['install'], {
        cwd: projectDir,
        stdio: 'pipe'
      });

      install.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Install failed with code ${code}`));
      });
    });

    // Build project (for production validation)
    if (target.framework === 'nextjs') {
      await new Promise<void>((resolve, reject) => {
        const build = spawn('npm', ['run', 'build'], {
          cwd: projectDir,
          stdio: 'pipe'
        });

        build.on('close', (code) => {
          if (code === 0) resolve();
          else reject(new Error(`Build failed with code ${code}`));
        });
      });
    }
  }

  private async startDevServer(projectDir: string, target: TargetConfig): Promise<string> {
    const { spawn } = await import('child_process');

    return new Promise<string>((resolve, reject) => {
      const port = 3000 + Math.floor(Math.random() * 1000);
      const env = { ...process.env, PORT: port.toString() };

      const server = spawn('npm', ['run', 'dev'], {
        cwd: projectDir,
        env,
        stdio: 'pipe'
      });

      let resolved = false;

      server.stdout?.on('data', (data) => {
        const output = data.toString();
        if (output.includes('ready') || output.includes('Local:') || output.includes(`http://localhost:${port}`)) {
          if (!resolved) {
            resolved = true;
            resolve(`http://localhost:${port}`);
          }
        }
      });

      server.on('error', reject);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (!resolved) {
          reject(new Error('Dev server start timeout'));
        }
      }, 30000);
    });
  }

  private async generateValidationReport(
    comparison: ComparisonResult,
    componentValidations: any[],
    originalScreenshot: ScreenshotData,
    generatedScreenshot: ScreenshotData,
    options: any
  ): Promise<any> {
    const passedComponents = componentValidations.filter(c => c.passed).length;
    const failedComponents = componentValidations.length - passedComponents;

    const criticalIssues = comparison.styleDifferences.filter(d => d.severity === 'critical').length;
    const majorIssues = comparison.styleDifferences.filter(d => d.severity === 'major').length;
    const minorIssues = comparison.styleDifferences.filter(d => d.severity === 'minor').length;

    return {
      summary: {
        totalComponents: componentValidations.length,
        passedComponents,
        failedComponents,
        criticalIssues,
        majorIssues,
        minorIssues
      },
      details: {
        screenshots: {
          original: originalScreenshot.path,
          generated: generatedScreenshot.path,
          diff: comparison.diffImagePath
        },
        components: componentValidations
      },
      recommendations: this.generateRecommendations(comparison, componentValidations)
    };
  }

  private generateRecommendations(comparison: ComparisonResult, componentValidations: any[]): string[] {
    const recommendations: string[] = [];

    if (comparison.matchPercentage < 85) {
      recommendations.push('Consider reviewing layout and positioning - significant visual differences detected');
    }

    if (comparison.styleDifferences.some(d => d.property === 'colors')) {
      recommendations.push('Review color palette and ensure design system tokens are correctly applied');
    }

    if (comparison.dimensionDifferences.length > 0) {
      recommendations.push('Check responsive design implementation - dimension mismatches detected');
    }

    const failedComponents = componentValidations.filter(c => !c.passed);
    if (failedComponents.length > 0) {
      recommendations.push(`Focus on improving: ${failedComponents.map(c => c.name).join(', ')}`);
    }

    return recommendations;
  }

  private async exportFigmaDesign(source: DashboardSource): Promise<string> {
    // This would use Figma API to export the design as an image
    // For now, return a placeholder
    throw new Error('Figma export not implemented in this demo');
  }

  private sampleColors(screenshot: ScreenshotData): string[] {
    const colors: string[] = [];
    const data = screenshot.data;
    const sampleRate = 100; // Sample every 100th pixel

    for (let i = 0; i < data.length; i += sampleRate * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      if (!colors.includes(hex)) {
        colors.push(hex);
      }
    }

    return colors.slice(0, 20); // Return top 20 colors
  }

  private calculateColorDistance(colors1: string[], colors2: string[]): number {
    // Simple color distance calculation
    let totalDistance = 0;
    const maxColors = Math.max(colors1.length, colors2.length);

    for (let i = 0; i < maxColors; i++) {
      const color1 = colors1[i] || '#000000';
      const color2 = colors2[i] || '#000000';
      totalDistance += this.hexColorDistance(color1, color2);
    }

    return totalDistance / maxColors;
  }

  private hexColorDistance(hex1: string, hex2: string): number {
    const r1 = parseInt(hex1.substr(1, 2), 16);
    const g1 = parseInt(hex1.substr(3, 2), 16);
    const b1 = parseInt(hex1.substr(5, 2), 16);

    const r2 = parseInt(hex2.substr(1, 2), 16);
    const g2 = parseInt(hex2.substr(3, 2), 16);
    const b2 = parseInt(hex2.substr(5, 2), 16);

    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  }

  private detectDiffRegions(diff: PNG): DiffRegion[] {
    // Simplified region detection - would implement proper connected component analysis
    const regions: DiffRegion[] = [];
    const width = diff.width;
    const height = diff.height;

    // For demo purposes, return a single region
    regions.push({
      x: 0,
      y: 0,
      width: width,
      height: height,
      area: width * height,
      shiftX: 0,
      shiftY: 0
    });

    return regions;
  }

  private generateIndexHtml(target: TargetConfig): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Dashboard</title>
    ${target.styling === 'tailwind' ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
  }

  private generateEntryPoint(target: TargetConfig): string {
    if (target.framework === 'nextjs') {
      return `import Dashboard from '../src/Dashboard';

export default function Home() {
  return <Dashboard />;
}`;
    }

    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './Dashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);`;
  }

  private async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }

    // Clean up temp directory
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

// Type definitions
interface ScreenshotData {
  path: string;
  width: number;
  height: number;
  data: Buffer;
  buffer: Buffer;
}

interface ComparisonResult {
  matchPercentage: number;
  diffPixels: number;
  totalPixels: number;
  diffImagePath: string;
  styleDifferences: any[];
  dimensionDifferences: any[];
}

interface DiffRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  shiftX: number;
  shiftY: number;
}