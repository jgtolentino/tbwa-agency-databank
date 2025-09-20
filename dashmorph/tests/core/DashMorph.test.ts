/**
 * DashMorph Core Tests
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import DashMorph, { DashMorphUtils } from '../../src/core/DashMorph';
import { DashboardSource, TargetConfig } from '../../src/core/types';

describe('DashMorph', () => {
  let dashmorph: DashMorph;

  beforeEach(() => {
    dashmorph = new DashMorph();
  });

  describe('DashMorphUtils', () => {
    test('should detect source type from URL', () => {
      expect(DashMorphUtils.detectSourceType('https://figma.com/file/abc123')).toBe('figma');
      expect(DashMorphUtils.detectSourceType('https://app.powerbi.com/dashboard')).toBe('powerbi');
      expect(DashMorphUtils.detectSourceType('http://localhost:3000')).toBe('url');
    });

    test('should detect source type from file extension', () => {
      expect(DashMorphUtils.detectSourceType('dashboard.html')).toBe('html');
      expect(DashMorphUtils.detectSourceType('design.sketch')).toBe('sketch');
      expect(DashMorphUtils.detectSourceType('screenshot.png')).toBe('screenshot');
      expect(DashMorphUtils.detectSourceType('report.pdf')).toBe('pdf');
    });

    test('should generate unique component IDs', () => {
      const id1 = DashMorphUtils.generateComponentId('chart', 'Sales Chart');
      const id2 = DashMorphUtils.generateComponentId('chart', 'Sales Chart');

      expect(id1).toMatch(/^chart-sales-chart-/);
      expect(id2).toMatch(/^chart-sales-chart-/);
      expect(id1).not.toBe(id2);
    });

    test('should validate configuration', () => {
      const validSource: DashboardSource = {
        type: 'figma',
        url: 'https://figma.com/file/test'
      };

      const validTarget: TargetConfig = {
        framework: 'react',
        styling: 'tailwind',
        charts: 'recharts',
        typescript: true,
        outputDir: './output',
        packageManager: 'npm'
      };

      const errors = DashMorphUtils.validateConfig(validSource, validTarget);
      expect(errors).toHaveLength(0);
    });

    test('should validate configuration with errors', () => {
      const invalidSource: DashboardSource = {
        type: 'figma' as any,
        // Missing URL
      };

      const invalidTarget: TargetConfig = {
        framework: 'react',
        styling: 'tailwind',
        charts: 'recharts',
        typescript: true,
        outputDir: './output',
        packageManager: 'npm'
      };

      const errors = DashMorphUtils.validateConfig(invalidSource, invalidTarget);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain('Source URL or file is required');
    });
  });

  describe('Core Functionality', () => {
    test('should get supported sources', () => {
      const sources = dashmorph.getSupportedSources();
      expect(sources).toContain('figma');
      expect(sources).toContain('html');
      expect(sources).toContain('screenshot');
      expect(sources.length).toBeGreaterThan(0);
    });

    test('should get supported targets', () => {
      const targets = dashmorph.getSupportedTargets();
      expect(targets).toContain('react');
      expect(targets).toContain('vue');
      expect(targets).toContain('angular');
      expect(targets.length).toBeGreaterThan(0);
    });

    test('should register custom extractor', () => {
      const mockExtractor = {
        extract: jest.fn()
      };

      dashmorph.registerExtractor('custom' as any, mockExtractor);
      expect(dashmorph.getSupportedSources()).toContain('custom');
    });

    test('should register custom mapper', () => {
      const mockMapper = {
        generate: jest.fn()
      };

      dashmorph.registerMapper('custom-framework', mockMapper);
      expect(dashmorph.getSupportedTargets()).toContain('custom-framework');
    });
  });

  describe('Error Handling', () => {
    test('should handle unsupported source type', async () => {
      const invalidSource: DashboardSource = {
        type: 'unsupported' as any,
        url: 'test'
      };

      await expect(dashmorph.extract(invalidSource))
        .rejects
        .toThrow('No extractor available for source type: unsupported');
    });
  });
});