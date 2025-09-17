import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Global setup for Scout Dashboard E2E tests
  console.log('🚀 Starting Scout Dashboard E2E Test Suite Setup');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Verify test environment is accessible
    console.log('📡 Verifying test environment...');
    await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000');

    // Wait for basic page load
    await page.waitForLoadState('networkidle');

    // Verify database connectivity
    console.log('🗄️ Verifying database connectivity...');
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/health-check');
        return res.ok;
      } catch {
        return false;
      }
    });

    if (!response) {
      console.warn('⚠️ Database health check failed - tests may use mock data');
    }

    // Set up test data if needed
    console.log('📊 Setting up test data...');
    await page.evaluate(() => {
      // Store test configuration in localStorage
      localStorage.setItem('scout-test-mode', 'true');
      localStorage.setItem('scout-test-timestamp', Date.now().toString());
    });

    console.log('✅ Scout Dashboard E2E Test Suite Setup Complete');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;