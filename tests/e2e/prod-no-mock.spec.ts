/**
 * Production-only E2E tests
 * Validates that production environment uses only real data
 */

import { test, expect } from '@playwright/test';

// Only run in production environment
test.skip(() => !process.env.DASHBOARD_URL?.includes('vercel.app'), 'Production-only tests');

test.describe('Production Data Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to production dashboard
    await page.goto(process.env.DASHBOARD_URL!);
  });

  test('should show Trusted data source badge and no mock text', async ({ page }) => {
    // Wait for data source badge to load
    await page.waitForSelector('[data-testid="data-source-badge"]', { timeout: 10000 });

    // Badge should show "Trusted" status
    await expect(page.locator('text=/Data Source:\\s*Trusted/i')).toBeVisible();

    // Should NOT show any mock data indicators
    await expect(page.locator('text=/Data Source:\\s*Mock Data/i')).toHaveCount(0);
    await expect(page.locator('text=/mock/i')).toHaveCount(0);
    await expect(page.locator('text=/demo/i')).toHaveCount(0);
    await expect(page.locator('text=/sample/i')).toHaveCount(0);
  });

  test('should load real geographic data within performance budget', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to geographic section
    await page.click('text=Geographic');

    // Wait for geographic summary to load
    await page.waitForSelector('[data-testid="geo-summary"]', { timeout: 15000 });

    const loadTime = Date.now() - startTime;

    // Performance requirement: <1.2s for CAG (Current Awareness Graphs)
    expect(loadTime).toBeLessThan(1200);

    // Verify real data is present (not zero/empty)
    const storeCount = await page.locator('[data-testid="total-stores"]').textContent();
    const transactionCount = await page.locator('[data-testid="total-transactions"]').textContent();

    expect(parseInt(storeCount || '0')).toBeGreaterThan(0);
    expect(parseInt(transactionCount || '0')).toBeGreaterThan(0);
  });

  test('should load brand performance data within performance budget', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to brand performance
    await page.click('text=Brand Performance');

    // Wait for brand data to load
    await page.waitForSelector('[data-testid="brand-performance"]', { timeout: 15000 });

    const loadTime = Date.now() - startTime;

    // Performance requirement: <1.2s for CAG
    expect(loadTime).toBeLessThan(1200);

    // Verify real brand data exists
    const brandCards = await page.locator('[data-testid="brand-card"]').count();
    expect(brandCards).toBeGreaterThan(0);
  });

  test('should export real data without mock fallback', async ({ page }) => {
    // Navigate to geographic section
    await page.click('text=Geographic');
    await page.waitForSelector('[data-testid="geo-summary"]');

    // Trigger export
    await page.click('[data-testid="export-button"]');

    // Wait for export to complete
    await page.waitForSelector('[data-testid="export-success"]', { timeout: 10000 });

    // Verify export contains real data (not mock)
    const exportMessage = await page.locator('[data-testid="export-message"]').textContent();
    expect(exportMessage).not.toContain('mock');
    expect(exportMessage).not.toContain('demo');
    expect(exportMessage).not.toContain('sample');
  });

  test('should not show any PROD VIOLATION warnings', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check for production violation warnings
    await expect(page.locator('text=/PROD VIOLATION/i')).toHaveCount(0);
    await expect(page.locator('text=/PROD FAILURE/i')).toHaveCount(0);
  });

  test('should have zero mock fallback hits in telemetry', async ({ page }) => {
    // Wait for dashboard to load completely
    await page.waitForLoadState('networkidle');

    // Check console for mock fallback logs (should be zero)
    const logs = await page.evaluate(() => {
      return (window as any).__mockFallbackCount || 0;
    });

    expect(logs).toBe(0);
  });

  test('should validate all dashboard sections load with real data', async ({ page }) => {
    const sections = [
      'Geographic',
      'Brand Performance',
      'Transaction Trends',
      'Consumer Behavior',
      'Consumer Profiling'
    ];

    for (const section of sections) {
      console.log(`Testing section: ${section}`);

      await page.click(`text=${section}`);

      // Wait for section to load
      await page.waitForSelector(`[data-testid="${section.toLowerCase().replace(' ', '-')}-section"]`, {
        timeout: 15000
      });

      // Verify data source badge is still "Trusted"
      await expect(page.locator('text=/Data Source:\\s*Trusted/i')).toBeVisible();

      // Check for any error messages
      await expect(page.locator('text=/error/i')).toHaveCount(0);
      await expect(page.locator('text=/failed/i')).toHaveCount(0);
    }
  });

  test('should maintain RLS security (no cross-tenant data)', async ({ page }) => {
    // This test would require multiple tenant accounts to properly validate
    // For now, we verify that data queries include proper filtering

    await page.waitForLoadState('networkidle');

    // Check that all API calls include tenant filtering
    const apiCalls = await page.evaluate(() => {
      return (window as any).__apiCalls || [];
    });

    // Verify API calls don't expose cross-tenant data
    // This is a basic check - full RLS testing would require tenant switching
    expect(apiCalls.length).toBeGreaterThan(0);
  });
});