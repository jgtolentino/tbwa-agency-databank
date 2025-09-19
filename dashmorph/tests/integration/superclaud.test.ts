/**
 * SuperClaude Integration Tests
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { SuperClaudeIntegration } from '../../src/integrations/superclaud';

describe('SuperClaude Integration', () => {
  let integration: SuperClaudeIntegration;

  beforeEach(() => {
    integration = new SuperClaudeIntegration();
  });

  describe('Command Parsing', () => {
    test('should handle /design command', async () => {
      const args = ['@figma/dashboard-url', '--target', 'react', '--pixel-perfect'];
      const context = { persona: 'frontend', complexity: 'medium' as const };

      // Mock the actual implementation since it requires real sources
      const mockExecute = jest.spyOn(integration as any, 'handleDesignCommand')
        .mockResolvedValue({ success: true });

      await integration.executeCommand('/design', args, context);

      expect(mockExecute).toHaveBeenCalledWith(args, context);
    });

    test('should handle /analyze command', async () => {
      const args = ['@dashboard/url', '--components', '--design-system'];
      const context = { persona: 'analyzer' };

      const mockExecute = jest.spyOn(integration as any, 'handleAnalyzeCommand')
        .mockResolvedValue({ dashboard: {}, components: [] });

      await integration.executeCommand('/analyze', args, context);

      expect(mockExecute).toHaveBeenCalledWith(args, context);
    });

    test('should throw error for unsupported command', async () => {
      await expect(integration.executeCommand('/unsupported', [], {}))
        .rejects
        .toThrow('Unsupported command: /unsupported');
    });
  });

  describe('Source Argument Parsing', () => {
    test('should parse Figma source argument', () => {
      const parseSource = (integration as any).parseSourceArgument;
      const result = parseSource.call(integration, '@figma/file123');

      expect(result).toEqual({
        type: 'figma',
        url: 'file123'
      });
    });

    test('should parse HTML source argument', () => {
      const parseSource = (integration as any).parseSourceArgument;
      const result = parseSource.call(integration, '@html/dashboard.html');

      expect(result).toEqual({
        type: 'html',
        file: 'dashboard.html'
      });
    });

    test('should auto-detect source type for unknown prefixes', () => {
      const parseSource = (integration as any).parseSourceArgument;
      const result = parseSource.call(integration, '@unknown/test.png');

      expect(result.type).toBe('screenshot');
    });
  });

  describe('Target Configuration', () => {
    test('should parse target configuration from args', () => {
      const args = ['--react', '--tailwind', '--recharts', '--typescript'];
      const context = { persona: 'frontend' };

      const parseTarget = (integration as any).parseTargetFromArgs;
      const result = parseTarget.call(integration, args, context);

      expect(result.framework).toBe('react');
      expect(result.styling).toBe('tailwind');
      expect(result.charts).toBe('recharts');
      expect(result.typescript).toBe(true);
    });

    test('should use defaults when no specific args provided', () => {
      const args = ['some-other-arg'];
      const context = {};

      const parseTarget = (integration as any).parseTargetFromArgs;
      const result = parseTarget.call(integration, args, context);

      expect(result.framework).toBe('react');
      expect(result.styling).toBe('tailwind');
      expect(result.charts).toBe('recharts');
    });
  });

  describe('Context-Aware Configuration', () => {
    test('should adapt precision based on context', () => {
      const getPrecision = (integration as any).getPrecisionFromContext;

      expect(getPrecision.call(integration, { persona: 'performance' })).toBe('medium');
      expect(getPrecision.call(integration, { complexity: 'high' })).toBe('high');
      expect(getPrecision.call(integration, {})).toBe('medium');
    });

    test('should adapt validation threshold based on context', () => {
      const getThreshold = (integration as any).getValidationThreshold;

      expect(getThreshold.call(integration, [], { persona: 'qa' })).toBe(98);
      expect(getThreshold.call(integration, [], { complexity: 'high' })).toBe(95);
      expect(getThreshold.call(integration, ['--threshold=85'], {})).toBe(85);
    });
  });

  describe('Dashboard Complexity Assessment', () => {
    test('should assess dashboard complexity correctly', () => {
      const assessComplexity = (integration as any).assessDashboardComplexity;

      // Low complexity
      const lowComplexity = [
        { interactions: [] },
        { interactions: [] }
      ];
      expect(assessComplexity.call(integration, lowComplexity)).toBe('low');

      // High complexity
      const highComplexity = Array(25).fill({ interactions: [{ action: 'click' }] });
      expect(assessComplexity.call(integration, highComplexity)).toBe('high');
    });
  });

  describe('Component Recommendations', () => {
    test('should generate appropriate recommendations', () => {
      const generateRecs = (integration as any).generateComponentRecommendations;

      const manyCharts = Array(15).fill({ type: 'chart' });
      const context = { persona: 'accessibility' };

      const recommendations = generateRecs.call(integration, manyCharts, context);

      expect(recommendations).toContain('Consider using a chart library with virtualization for performance');
      expect(recommendations).toContain('Ensure all interactive components have proper ARIA labels');
    });
  });

  describe('Output Directory Handling', () => {
    test('should extract output directory from args', () => {
      const getOutputDir = (integration as any).getOutputDir;

      expect(getOutputDir.call(integration, ['--output=./custom-output'])).toBe('./custom-output');
      expect(getOutputDir.call(integration, ['-o=./another-dir'])).toBe('./another-dir');
      expect(getOutputDir.call(integration, [])).toBe('./generated-dashboard');
    });
  });

  describe('Package Manager Detection', () => {
    test('should detect package manager from args', () => {
      const getPackageManager = (integration as any).getPackageManager;

      expect(getPackageManager.call(integration, ['--yarn'])).toBe('yarn');
      expect(getPackageManager.call(integration, ['--pnpm'])).toBe('pnpm');
      expect(getPackageManager.call(integration, [])).toBe('npm');
    });
  });
});