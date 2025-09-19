/**
 * Test setup configuration
 */

import { jest } from '@jest/globals';

// Mock external dependencies that require special handling
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      goto: jest.fn(),
      screenshot: jest.fn(),
      close: jest.fn()
    }),
    close: jest.fn()
  })
}));

jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newPage: jest.fn().mockResolvedValue({
        goto: jest.fn(),
        screenshot: jest.fn(),
        close: jest.fn()
      }),
      close: jest.fn()
    })
  }
}));

// Increase timeout for integration tests
jest.setTimeout(30000);