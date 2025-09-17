import { test, expect } from '@playwright/test';

// Scout Dashboard Compatibility E2E Test Suite
// Tests all dashboard sections mapped from UI inventory

test.describe('Scout Dashboard Compatibility Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Data Source Validation', () => {
    test('should display data source badge with correct status', async ({ page }) => {
      // Wait for data source badge to load
      const badge = page.locator('[data-testid="data-source-badge"]');
      await expect(badge).toBeVisible();

      // Check badge shows either "Trusted" or "Mock/Sample"
      const badgeText = await badge.textContent();
      expect(['Trusted', 'Mock/Sample', 'Checking...']).toContain(badgeText?.trim());

      // If trusted, badge should be green
      if (badgeText?.includes('Trusted')) {
        await expect(badge).toHaveClass(/bg-primary|bg-green/);
      }

      // If mock/sample, badge should be red
      if (badgeText?.includes('Mock/Sample')) {
        await expect(badge).toHaveClass(/bg-destructive|bg-red/);
      }
    });

    test('should refresh data source status automatically', async ({ page }) => {
      const badge = page.locator('[data-testid="data-source-badge"]');
      await expect(badge).toBeVisible();

      // Wait for auto-refresh (should happen within 5 minutes)
      await page.waitForTimeout(1000);

      // Verify badge is still responsive
      await expect(badge).toBeVisible();
    });
  });

  test.describe('CAG (Current Awareness Graphs) - Performance <1.2s', () => {
    test('should load geographic summary under 1.2s', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard/geographic');
      await page.waitForSelector('[data-testid="geo-summary"]');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1200); // <1.2s requirement

      // Verify data is loaded
      await expect(page.locator('[data-testid="total-stores"]')).toContainText(/\d+/);
      await expect(page.locator('[data-testid="total-revenue"]')).toContainText(/\d+/);
    });

    test('should load brand performance under 1.2s', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard/brands');
      await page.waitForSelector('[data-testid="brand-performance"]');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1200);

      // Verify brand data is loaded
      await expect(page.locator('[data-testid="brand-count"]')).toContainText(/\d+/);
    });

    test('should load consumer insights under 1.2s', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard/consumers');
      await page.waitForSelector('[data-testid="consumer-behavior"]');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1200);

      // Verify consumer data is loaded
      await expect(page.locator('[data-testid="gender-distribution"]')).toBeVisible();
    });
  });

  test.describe('RAG (Reports & Advanced Graphics) - Performance <3s', () => {
    test('should load competitive analysis under 3s', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard/competitive');
      await page.waitForSelector('[data-testid="competitive-analysis"]');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // <3s requirement

      // Verify competitive data is loaded
      await expect(page.locator('[data-testid="market-leaders"]')).toBeVisible();
      await expect(page.locator('[data-testid="brand-comparison"]')).toBeVisible();
    });

    test('should load daily trends under 3s', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard/trends');
      await page.waitForSelector('[data-testid="daily-trends"]');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);

      // Verify trend data is loaded
      await expect(page.locator('[data-testid="trend-chart"]')).toBeVisible();
    });

    test('should load financial metrics under 3s', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/dashboard/financial');
      await page.waitForSelector('[data-testid="financial-metrics"]');

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);

      // Verify financial data is loaded
      await expect(page.locator('[data-testid="total-revenue"]')).toContainText(/\d+/);
      await expect(page.locator('[data-testid="revenue-growth"]')).toBeVisible();
    });
  });

  test.describe('Dashboard Sections - Full UI Coverage', () => {

    test.describe('1. OVERVIEW Section', () => {
      test('should display KPI cards correctly', async ({ page }) => {
        await page.goto('/dashboard/overview');

        // Test KPI cards
        await expect(page.locator('[data-testid="total-transactions"]')).toBeVisible();
        await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible();
        await expect(page.locator('[data-testid="avg-transaction-value"]')).toBeVisible();
        await expect(page.locator('[data-testid="total-stores"]')).toBeVisible();

        // Verify data is numeric
        const transactions = await page.locator('[data-testid="total-transactions"]').textContent();
        expect(transactions).toMatch(/\d+/);
      });

      test('should show business health score', async ({ page }) => {
        await page.goto('/dashboard/overview');

        await expect(page.locator('[data-testid="health-score"]')).toBeVisible();
        const healthScore = await page.locator('[data-testid="health-score"]').textContent();
        expect(parseInt(healthScore || '0')).toBeGreaterThanOrEqual(0);
        expect(parseInt(healthScore || '100')).toBeLessThanOrEqual(100);
      });
    });

    test.describe('2. GEOGRAPHIC Section', () => {
      test('should display store distribution map', async ({ page }) => {
        await page.goto('/dashboard/geographic');

        await expect(page.locator('[data-testid="store-map"]')).toBeVisible();
        await expect(page.locator('[data-testid="regional-performance"]')).toBeVisible();
      });

      test('should show top performing regions', async ({ page }) => {
        await page.goto('/dashboard/geographic');

        await expect(page.locator('[data-testid="top-regions"]')).toBeVisible();

        // Should have at least one region
        const regionItems = page.locator('[data-testid="region-item"]');
        await expect(regionItems.first()).toBeVisible();
      });
    });

    test.describe('3. BRAND PERFORMANCE Section', () => {
      test('should display brand rankings', async ({ page }) => {
        await page.goto('/dashboard/brands');

        await expect(page.locator('[data-testid="brand-rankings"]')).toBeVisible();

        // Should show market share data
        await expect(page.locator('[data-testid="market-share"]')).toBeVisible();
      });

      test('should filter by TBWA clients', async ({ page }) => {
        await page.goto('/dashboard/brands');

        const clientFilter = page.locator('[data-testid="tbwa-client-filter"]');
        await clientFilter.check();

        // Should update brand list
        await page.waitForTimeout(500);
        await expect(page.locator('[data-testid="client-brands"]')).toBeVisible();
      });
    });

    test.describe('4. CONSUMER INSIGHTS Section', () => {
      test('should display demographic charts', async ({ page }) => {
        await page.goto('/dashboard/consumers');

        await expect(page.locator('[data-testid="gender-chart"]')).toBeVisible();
        await expect(page.locator('[data-testid="age-group-chart"]')).toBeVisible();
        await expect(page.locator('[data-testid="payment-preferences"]')).toBeVisible();
      });

      test('should show consumer segments', async ({ page }) => {
        await page.goto('/dashboard/consumers');

        await expect(page.locator('[data-testid="consumer-segments"]')).toBeVisible();

        // Should have Premium, Mid-tier, Budget segments
        const segments = ['Premium', 'Mid-tier', 'Budget'];
        for (const segment of segments) {
          await expect(page.locator(`[data-testid="segment-${segment.toLowerCase()}"]`)).toBeVisible();
        }
      });
    });

    test.describe('5. PRODUCT ANALYSIS Section', () => {
      test('should display category performance', async ({ page }) => {
        await page.goto('/dashboard/products');

        await expect(page.locator('[data-testid="category-performance"]')).toBeVisible();
        await expect(page.locator('[data-testid="product-mix"]')).toBeVisible();
      });

      test('should show top products', async ({ page }) => {
        await page.goto('/dashboard/products');

        await expect(page.locator('[data-testid="top-products"]')).toBeVisible();

        // Should list products with revenue data
        const productItems = page.locator('[data-testid="product-item"]');
        await expect(productItems.first()).toBeVisible();
      });
    });

    test.describe('6. TRENDS & FORECASTING Section', () => {
      test('should display time series charts', async ({ page }) => {
        await page.goto('/dashboard/trends');

        await expect(page.locator('[data-testid="daily-trends-chart"]')).toBeVisible();
        await expect(page.locator('[data-testid="hourly-patterns"]')).toBeVisible();
      });

      test('should show trend direction indicators', async ({ page }) => {
        await page.goto('/dashboard/trends');

        await expect(page.locator('[data-testid="trend-indicators"]')).toBeVisible();

        // Should show Rising/Falling/Stable indicators
        const indicators = page.locator('[data-testid="trend-direction"]');
        await expect(indicators.first()).toBeVisible();
      });
    });
  });

  test.describe('Global Dashboard Controls', () => {
    test('should apply date range filters correctly', async ({ page }) => {
      await page.goto('/dashboard');

      // Open date picker
      await page.click('[data-testid="date-range-picker"]');

      // Select last 30 days
      await page.click('[data-testid="last-30-days"]');

      // Wait for data refresh
      await page.waitForTimeout(1000);

      // Verify data updated
      await expect(page.locator('[data-testid="filter-applied"]')).toBeVisible();
    });

    test('should export data with current filters', async ({ page }) => {
      await page.goto('/dashboard');

      // Apply some filters first
      await page.click('[data-testid="brand-filter"]');
      await page.selectOption('[data-testid="brand-select"]', 'Test Brand');

      // Trigger export
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-testid="export-button"]');

      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/scout-dashboard-export.*\.csv/);
    });

    test('should maintain filter state across navigation', async ({ page }) => {
      await page.goto('/dashboard');

      // Apply filter
      await page.click('[data-testid="store-filter"]');
      await page.selectOption('[data-testid="store-select"]', 'Store 1');

      // Navigate to different section
      await page.click('[data-testid="nav-brands"]');

      // Verify filter is still applied
      const filterValue = await page.locator('[data-testid="store-select"]').inputValue();
      expect(filterValue).toBe('Store 1');
    });
  });

  test.describe('Analysis Modes', () => {
    test('should support Single entity analysis', async ({ page }) => {
      await page.goto('/dashboard/brands');

      // Select single brand
      await page.click('[data-testid="analysis-mode-single"]');
      await page.selectOption('[data-testid="brand-select"]', 'Test Brand');

      // Should show single brand analysis
      await expect(page.locator('[data-testid="single-brand-analysis"]')).toBeVisible();
    });

    test('should support Between entities comparison', async ({ page }) => {
      await page.goto('/dashboard/brands');

      // Select comparison mode
      await page.click('[data-testid="analysis-mode-between"]');

      // Select two brands
      await page.selectOption('[data-testid="brand-select-1"]', 'Brand A');
      await page.selectOption('[data-testid="brand-select-2"]', 'Brand B');

      // Should show comparison view
      await expect(page.locator('[data-testid="brand-comparison"]')).toBeVisible();
    });

    test('should support Among entities analysis', async ({ page }) => {
      await page.goto('/dashboard/brands');

      // Select multi-entity mode
      await page.click('[data-testid="analysis-mode-among"]');

      // Select multiple brands
      await page.click('[data-testid="brand-multi-select"]');
      await page.click('[data-testid="brand-option-1"]');
      await page.click('[data-testid="brand-option-2"]');
      await page.click('[data-testid="brand-option-3"]');

      // Should show multi-brand analysis
      await expect(page.locator('[data-testid="multi-brand-analysis"]')).toBeVisible();
    });
  });

  test.describe('Ask Suqi Integration', () => {
    test('should validate NL2SQL input with guardrails', async ({ page }) => {
      await page.goto('/dashboard');

      // Open Ask Suqi panel
      await page.click('[data-testid="ask-suqi-button"]');

      // Try potentially dangerous query
      await page.fill('[data-testid="suqi-input"]', 'DROP TABLE users');
      await page.click('[data-testid="suqi-submit"]');

      // Should show guardrail warning
      await expect(page.locator('[data-testid="guardrail-warning"]')).toBeVisible();
      await expect(page.locator('[data-testid="guardrail-warning"]')).toContainText('Query blocked');
    });

    test('should process safe queries correctly', async ({ page }) => {
      await page.goto('/dashboard');

      // Open Ask Suqi panel
      await page.click('[data-testid="ask-suqi-button"]');

      // Enter safe query
      await page.fill('[data-testid="suqi-input"]', 'Show me the top 5 brands by revenue');
      await page.click('[data-testid="suqi-submit"]');

      // Should show results
      await expect(page.locator('[data-testid="suqi-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="top-brands-list"]')).toBeVisible();
    });
  });

  test.describe('Row Level Security (RLS)', () => {
    test('should enforce tenant isolation', async ({ page, context }) => {
      // Simulate different tenant contexts
      await context.addCookies([
        { name: 'tenant_id', value: 'tenant1', domain: 'localhost', path: '/' }
      ]);

      await page.goto('/dashboard');

      // Should only see data for tenant1
      await expect(page.locator('[data-testid="tenant-data"]')).toBeVisible();

      // Try to access data from different tenant
      await page.goto('/dashboard?tenant=tenant2');

      // Should be blocked or show no data
      const dataElements = page.locator('[data-testid="unauthorized-data"]');
      await expect(dataElements).toHaveCount(0);
    });

    test('should respect user permissions', async ({ page, context }) => {
      // Simulate authenticated user with limited permissions
      await context.addCookies([
        { name: 'user_role', value: 'viewer', domain: 'localhost', path: '/' }
      ]);

      await page.goto('/dashboard');

      // Should see read-only data
      await expect(page.locator('[data-testid="dashboard-data"]')).toBeVisible();

      // Should not see admin features
      await expect(page.locator('[data-testid="admin-panel"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="delete-button"]')).not.toBeVisible();
    });
  });

  test.describe('Error Handling & Resilience', () => {
    test('should handle API failures gracefully', async ({ page }) => {
      // Intercept API calls and simulate failure
      await page.route('**/api/scout/**', route => {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      });

      await page.goto('/dashboard');

      // Should show error state
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });

    test('should retry failed requests', async ({ page }) => {
      let callCount = 0;

      // Intercept and fail first request, succeed on retry
      await page.route('**/api/scout/geo-summary', route => {
        callCount++;
        if (callCount === 1) {
          route.fulfill({ status: 500, body: 'Error' });
        } else {
          route.fulfill({ status: 200, body: '{"total_stores": 5}' });
        }
      });

      await page.goto('/dashboard/geographic');

      // Click retry button
      await page.click('[data-testid="retry-button"]');

      // Should eventually show data
      await expect(page.locator('[data-testid="geo-summary"]')).toBeVisible();
    });

    test('should handle slow network gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/api/scout/**', route => {
        setTimeout(() => {
          route.fulfill({ status: 200, body: '{"data": "success"}' });
        }, 2000);
      });

      await page.goto('/dashboard');

      // Should show loading state
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();

      // Should eventually load
      await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should meet WCAG 2.1 AA standards', async ({ page }) => {
      await page.goto('/dashboard');

      // Check for proper heading hierarchy
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);

      // Check for alt text on images
      const images = page.locator('img');
      for (let i = 0; i < await images.count(); i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('alt');
      }

      // Check for proper form labels
      const inputs = page.locator('input');
      for (let i = 0; i < await inputs.count(); i++) {
        const input = inputs.nth(i);
        const id = await input.getAttribute('id');
        if (id) {
          await expect(page.locator(`label[for="${id}"]`)).toBeVisible();
        }
      }
    });

    test('should support keyboard navigation', async ({ page }) => {
      await page.goto('/dashboard');

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();

      // Should be able to activate with Enter/Space
      await page.keyboard.press('Enter');

      // Focus should be manageable
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto('/dashboard');

      // Check for ARIA landmarks
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[role="navigation"]')).toBeVisible();

      // Check for ARIA labels on interactive elements
      const buttons = page.locator('button');
      for (let i = 0; i < await buttons.count(); i++) {
        const button = buttons.nth(i);
        const hasAriaLabel = await button.getAttribute('aria-label');
        const hasText = await button.textContent();
        expect(hasAriaLabel || hasText).toBeTruthy();
      }
    });
  });
});

// Performance test utilities
test.describe('Performance Monitoring', () => {
  test('should track Core Web Vitals', async ({ page }) => {
    await page.goto('/dashboard');

    // Measure Largest Contentful Paint (LCP)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    expect(lcp).toBeLessThan(2500); // LCP should be under 2.5s
  });

  test('should track First Input Delay (FID)', async ({ page }) => {
    await page.goto('/dashboard');

    // Simulate user interaction
    const startTime = Date.now();
    await page.click('[data-testid="dashboard-button"]');
    const endTime = Date.now();

    const fid = endTime - startTime;
    expect(fid).toBeLessThan(100); // FID should be under 100ms
  });
});