/**
 * Runtime Production Guards
 *
 * Enforces strict production mode at runtime to prevent any CSV fallbacks
 * or development-only features from running in production.
 */

export interface RuntimeConfig {
  isProduction: boolean
  isStrictMode: boolean
  supabaseConfigured: boolean
  allowCSV: boolean
  allowMocks: boolean
}

/**
 * Get current runtime configuration
 */
export function getRuntimeConfig(): RuntimeConfig {
  const isProduction = import.meta.env.PROD ||
                      import.meta.env.VERCEL_ENV === 'production' ||
                      import.meta.env.NODE_ENV === 'production'

  const isStrictMode = import.meta.env.VITE_STRICT_DATASOURCE === 'true'

  const supabaseConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )

  return {
    isProduction,
    isStrictMode,
    supabaseConfigured,
    allowCSV: !isProduction && !isStrictMode,
    allowMocks: !isProduction && !isStrictMode
  }
}

/**
 * Runtime assertion for production environment
 */
export function assertProductionReady(): void {
  const config = getRuntimeConfig()

  if (config.isProduction) {
    // Production environment checks
    if (!config.supabaseConfigured) {
      throw new Error('🚨 PRODUCTION ERROR: Supabase not configured. Production requires database connection.')
    }

    if (!config.isStrictMode) {
      throw new Error('🚨 PRODUCTION ERROR: VITE_STRICT_DATASOURCE not enabled. Set to "true" for production.')
    }

    // Log successful production validation
    console.log('✅ PRODUCTION READY: Supabase configured, strict mode enabled')
  }
}

/**
 * Guard against CSV usage in production
 */
export function assertNoCSVInProduction(context: string = 'data access'): void {
  const config = getRuntimeConfig()

  if (config.isProduction || config.isStrictMode) {
    throw new Error(`🚨 PRODUCTION ERROR: CSV access attempted in ${context}. Use Supabase only.`)
  }
}

/**
 * Guard against mock usage in production
 */
export function assertNoMocksInProduction(context: string = 'data service'): void {
  const config = getRuntimeConfig()

  if (config.isProduction || config.isStrictMode) {
    throw new Error(`🚨 PRODUCTION ERROR: Mock data attempted in ${context}. Use real database only.`)
  }
}

/**
 * Safe development-only function wrapper
 */
export function devOnly<T>(fn: () => T, fallback?: T): T | undefined {
  const config = getRuntimeConfig()

  if (config.allowMocks) {
    return fn()
  }

  if (fallback !== undefined) {
    return fallback
  }

  throw new Error('🚨 DEVELOPMENT FUNCTION: This function is only available in development mode.')
}

/**
 * Conditional execution based on environment
 */
export function ifProduction<T>(prodFn: () => T, devFn?: () => T): T | undefined {
  const config = getRuntimeConfig()

  if (config.isProduction) {
    return prodFn()
  }

  if (devFn) {
    return devFn()
  }

  return undefined
}

/**
 * Environment-safe data source validation
 */
export function validateDataSource(sourceName: string, isCSV: boolean = false): void {
  const config = getRuntimeConfig()

  if (isCSV && (config.isProduction || config.isStrictMode)) {
    throw new Error(`🚨 DATASOURCE ERROR: CSV source "${sourceName}" not allowed in production. Use Supabase only.`)
  }

  if (config.isProduction && !config.supabaseConfigured) {
    throw new Error(`🚨 DATASOURCE ERROR: Database not configured for production datasource "${sourceName}".`)
  }
}

/**
 * Runtime environment reporter
 */
export function reportEnvironment(): void {
  const config = getRuntimeConfig()

  console.group('🛡️  Runtime Environment Status')
  console.log(`Production: ${config.isProduction ? '✅' : '❌'}`)
  console.log(`Strict Mode: ${config.isStrictMode ? '✅' : '❌'}`)
  console.log(`Supabase: ${config.supabaseConfigured ? '✅' : '❌'}`)
  console.log(`CSV Allowed: ${config.allowCSV ? '⚠️  Dev Only' : '❌ Blocked'}`)
  console.log(`Mocks Allowed: ${config.allowMocks ? '⚠️  Dev Only' : '❌ Blocked'}`)
  console.groupEnd()

  // Auto-run production assertions
  if (config.isProduction) {
    assertProductionReady()
  }
}

/**
 * Initialize runtime guards (call this early in app startup)
 */
export function initializeRuntimeGuards(): void {
  const config = getRuntimeConfig()

  // Development mode warnings
  if (!config.isProduction) {
    console.warn('⚠️  DEVELOPMENT MODE: CSV and mock data allowed')
  }

  // Production mode enforcement
  if (config.isProduction) {
    console.log('🔒 PRODUCTION MODE: Strict datasource enforcement active')
    assertProductionReady()
  }

  // Strict mode (can be enabled in development too)
  if (config.isStrictMode) {
    console.log('🛡️  STRICT MODE: Production-level guards active')
  }

  // Report current environment
  if (import.meta.env.DEV) {
    reportEnvironment()
  }
}

// Auto-initialize on import (for immediate protection)
initializeRuntimeGuards()