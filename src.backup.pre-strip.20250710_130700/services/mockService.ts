/**
 * Conditional Mock Service
 * Only loads mock data in development mode
 */

import { isProduction, isDevelopment } from '@/config/production-guard';

export async function getMockData<T>(mockImportFn: () => Promise<T>): Promise<T | null> {
  if (isDevelopment) {
    return mockImportFn();
  }
  return null;
}

export function useMockFallback<T>(realData: T | null, mockData: T): T | null {
  if (realData !== null) {
    return realData;
  }
  
  if (isDevelopment) {
    console.warn('Using mock data fallback in development mode');
    return mockData;
  }
  
  console.error('No data available and mock fallback disabled in production');
  return null;
}
