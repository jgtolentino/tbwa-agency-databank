/**
 * Figma Extractor Tests
 */

import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { FigmaExtractor } from '../../src/extractors/FigmaExtractor';
import { DashboardSource } from '../../src/core/types';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('FigmaExtractor', () => {
  let extractor: FigmaExtractor;
  let mockSource: DashboardSource;

  beforeEach(() => {
    mockSource = {
      type: 'figma',
      url: 'https://figma.com/file/abc123/Test-Dashboard',
      credentials: {
        apiKey: 'test-api-key'
      }
    };

    extractor = new FigmaExtractor(mockSource);

    // Reset fetch mock
    (fetch as jest.MockedFunction<typeof fetch>).mockReset();
  });

  describe('Source Validation', () => {
    test('should validate valid Figma source', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ name: 'Test Dashboard' })
      } as Response);

      const isValid = await extractor.validateSource();
      expect(isValid).toBe(true);
    });

    test('should fail validation without API key', async () => {
      const sourceWithoutKey: DashboardSource = {
        type: 'figma',
        url: 'https://figma.com/file/abc123/Test-Dashboard'
      };

      const extractorWithoutKey = new FigmaExtractor(sourceWithoutKey);

      await expect(extractorWithoutKey.validateSource())
        .rejects
        .toThrow('Figma API key is required');
    });

    test('should fail validation with invalid URL', async () => {
      const sourceWithInvalidUrl: DashboardSource = {
        type: 'figma',
        url: 'https://invalid-url.com',
        credentials: { apiKey: 'test-key' }
      };

      const extractorWithInvalidUrl = new FigmaExtractor(sourceWithInvalidUrl);

      await expect(extractorWithInvalidUrl.validateSource())
        .rejects
        .toThrow('Invalid Figma URL: cannot extract file key');
    });
  });

  describe('Metadata Extraction', () => {
    test('should extract file metadata', async () => {
      const mockFileData = {
        name: 'Test Dashboard',
        version: '1.0',
        lastModified: '2024-01-01T00:00:00Z',
        thumbnailUrl: 'https://figma.com/thumb.png',
        components: { comp1: {}, comp2: {} },
        styles: { style1: {}, style2: {} }
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFileData)
      } as Response);

      const metadata = await extractor.getMetadata();

      expect(metadata).toEqual({
        name: 'Test Dashboard',
        version: '1.0',
        lastModified: '2024-01-01T00:00:00Z',
        thumbnailUrl: 'https://figma.com/thumb.png',
        components: 2,
        styles: 2
      });
    });
  });

  describe('Component Extraction', () => {
    test('should extract dashboard successfully', async () => {
      const mockFileData = {
        name: 'Test Dashboard',
        document: {
          children: [{
            children: [{
              id: 'comp1',
              name: 'Sales Chart',
              type: 'FRAME',
              absoluteBoundingBox: { x: 0, y: 0, width: 400, height: 300 },
              fills: [{
                type: 'SOLID',
                color: { r: 0, g: 0.5, b: 1 },
                opacity: 1
              }]
            }]
          }]
        }
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFileData)
      } as Response);

      const result = await extractor.extract();

      expect(result.metadata.title).toBe('Test Dashboard');
      expect(result.components).toHaveLength(1);
      expect(result.components[0].name).toBe('Sales Chart');
      expect(result.components[0].type).toBe('chart');
    });
  });

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(extractor.extract())
        .rejects
        .toThrow('Network error');
    });

    test('should handle invalid API responses', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      } as Response);

      await expect(extractor.validateSource())
        .rejects
        .toThrow('Figma API validation failed');
    });
  });
});