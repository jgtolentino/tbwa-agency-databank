/**
 * Environment configuration and production guards
 * Prevents mock data usage in production builds
 * Supports both VITE_ and NEXT_PUBLIC_ prefixes to prevent env drift
 */

// Support both VITE_ and NEXT_PUBLIC_ prefixes for maximum compatibility
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === '1' ||
  import.meta.env.VITE_USE_MOCK === 'true' ||
  import.meta.env.NEXT_PUBLIC_USE_MOCK === '1' ||
  import.meta.env.NEXT_PUBLIC_USE_MOCK === 'true';

const ALLOW_FALLBACK_IN_PROD =
  import.meta.env.VITE_ALLOW_FALLBACK_IN_PROD === '1' ||
  import.meta.env.NEXT_PUBLIC_ALLOW_FALLBACK_IN_PROD === '1';

export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  PROD: import.meta.env.PROD,
  USE_MOCK,
  ALLOW_FALLBACK_IN_PROD,
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

/**
 * Runtime check to prevent mocks in production
 * Throws error during app startup if mocks are enabled in prod
 */
export function assertNoMockInProd(): void {
  if (ENV.PROD && ENV.USE_MOCK) {
    // Check which variable is enabling mocks for better error reporting
    const mockSources = [];
    if (import.meta.env.VITE_USE_MOCK === '1' || import.meta.env.VITE_USE_MOCK === 'true') {
      mockSources.push('VITE_USE_MOCK=1');
    }
    if (import.meta.env.NEXT_PUBLIC_USE_MOCK === '1' || import.meta.env.NEXT_PUBLIC_USE_MOCK === 'true') {
      mockSources.push('NEXT_PUBLIC_USE_MOCK=1');
    }

    throw new Error(
      `Mock data forbidden in production: ${mockSources.join(', ')}. ` +
      'Set both VITE_USE_MOCK=0 and NEXT_PUBLIC_USE_MOCK=0 for production builds.'
    );
  }
}

/**
 * Check if we're in a production build
 */
export function isProduction(): boolean {
  return ENV.PROD;
}

/**
 * Check if mocks are enabled (dev/preview only)
 */
export function isMockEnabled(): boolean {
  return ENV.USE_MOCK && !ENV.PROD;
}

/**
 * Check if fallbacks are allowed in current environment
 */
export function isFallbackAllowed(): boolean {
  if (ENV.PROD) {
    return ENV.ALLOW_FALLBACK_IN_PROD;
  }
  return true; // Always allow fallbacks in dev/preview
}