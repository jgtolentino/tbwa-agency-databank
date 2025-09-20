#!/usr/bin/env node

/**
 * Build-time guard: Prevent CSV imports in production builds
 *
 * This script scans the codebase for any CSV-related imports or references
 * and fails the build if found when building for production.
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const PROJECT_ROOT = join(__dirname, '..')
const SRC_DIR = join(PROJECT_ROOT, 'src')
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']

// Forbidden patterns for production builds
const FORBIDDEN_PATTERNS = [
  // Direct CSV imports
  /import.*\.csv/gi,
  /require.*\.csv/gi,
  /import.*from.*csv/gi,

  // CSV data references
  /mockData/gi,
  /csvData/gi,
  /\.csv/gi,

  // Mock/fake data patterns
  /fakeData/gi,
  /dummyData/gi,
  /testData(?!Service)/gi, // Allow testDataService but not testData

  // Development mode toggles (should use env vars)
  /DATA_MODE.*=.*['"]mock/gi,
  /DATA_MODE.*=.*['"]csv/gi,
  /useMockData.*=.*true/gi,

  // Hardcoded mock responses
  /return.*\[.*\{.*mock/gi,
  /mockResponse/gi,
]

// Files to ignore (development/testing)
const IGNORE_PATTERNS = [
  /\.test\./,
  /\.spec\./,
  /\.stories\./,
  /\.mock\./,
  /\/tests?\//,
  /\/mocks?\//,
  /\/stories\//,
  /\/cypress\//,
  /\/e2e\//,
  /node_modules/,
  /dist/,
  /build/,
  /\.git/,
  // Allow this guard script itself
  /guard-no-csv/,
]

class CSVGuard {
  constructor() {
    this.violations = []
    this.scannedFiles = 0
    this.isProduction = process.env.NODE_ENV === 'production' ||
                       process.env.VERCEL_ENV === 'production' ||
                       process.env.VITE_STRICT_DATASOURCE === 'true'
  }

  log(message, type = 'info') {
    const prefix = {
      info: 'ℹ️ ',
      warn: '⚠️ ',
      error: '❌',
      success: '✅'
    }[type]

    console.log(`${prefix} ${message}`)
  }

  shouldIgnoreFile(filePath) {
    return IGNORE_PATTERNS.some(pattern => pattern.test(filePath))
  }

  scanFile(filePath) {
    if (this.shouldIgnoreFile(filePath)) {
      return
    }

    try {
      const content = readFileSync(filePath, 'utf-8')
      const relativePath = filePath.replace(PROJECT_ROOT, '')

      FORBIDDEN_PATTERNS.forEach((pattern, index) => {
        const matches = content.match(pattern)
        if (matches) {
          matches.forEach(match => {
            this.violations.push({
              file: relativePath,
              pattern: pattern.toString(),
              match: match.trim(),
              line: this.getLineNumber(content, match)
            })
          })
        }
      })

      this.scannedFiles++
    } catch (error) {
      this.log(`Error reading ${filePath}: ${error.message}`, 'warn')
    }
  }

  getLineNumber(content, match) {
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        return i + 1
      }
    }
    return 'unknown'
  }

  scanDirectory(dirPath) {
    try {
      const entries = readdirSync(dirPath)

      for (const entry of entries) {
        const fullPath = join(dirPath, entry)
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
          this.scanDirectory(fullPath)
        } else if (stat.isFile() && EXTENSIONS.includes(extname(entry))) {
          this.scanFile(fullPath)
        }
      }
    } catch (error) {
      this.log(`Error scanning directory ${dirPath}: ${error.message}`, 'warn')
    }
  }

  run() {
    this.log('🛡️  CSV Guard: Scanning for production violations...')
    this.log(`Mode: ${this.isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`)

    // Scan source directory
    this.scanDirectory(SRC_DIR)

    this.log(`Scanned ${this.scannedFiles} files`)

    if (this.violations.length === 0) {
      this.log('No CSV violations found! ✨', 'success')
      return true
    }

    // Report violations
    this.log(`Found ${this.violations.length} CSV violations:`, 'error')
    console.log('')

    this.violations.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.file}:${violation.line}`)
      console.log(`   Pattern: ${violation.pattern}`)
      console.log(`   Match: "${violation.match}"`)
      console.log('')
    })

    if (this.isProduction) {
      this.log('🚨 PRODUCTION BUILD BLOCKED: CSV references not allowed in production!', 'error')
      this.log('', 'error')
      this.log('To fix:', 'error')
      this.log('1. Remove all CSV imports and mock data references', 'error')
      this.log('2. Use strictDataSource.ts for all data access', 'error')
      this.log('3. Ensure VITE_STRICT_DATASOURCE=true in production', 'error')
      process.exit(1)
    } else {
      this.log('Development mode: Violations detected but build will continue', 'warn')
      return false
    }
  }
}

// Execute guard
if (import.meta.url === `file://${process.argv[1]}`) {
  const guard = new CSVGuard()
  guard.run()
}

export { CSVGuard }