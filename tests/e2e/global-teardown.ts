import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Global teardown for Scout Dashboard E2E tests
  console.log('🧹 Starting Scout Dashboard E2E Test Suite Teardown');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to application
    await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000');

    // Clean up test data from localStorage
    console.log('🗑️ Cleaning up test data...');
    await page.evaluate(() => {
      localStorage.removeItem('scout-test-mode');
      localStorage.removeItem('scout-test-timestamp');
    });

    // Generate test summary
    console.log('📋 Generating test summary...');

    // Check if test results exist
    try {
      const fs = require('fs');
      const path = require('path');

      const resultsPath = path.join(process.cwd(), 'test-results', 'test-results.json');

      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

        console.log('\n📊 Test Summary:');
        console.log(`Total Tests: ${results.stats?.total || 'N/A'}`);
        console.log(`Passed: ${results.stats?.passed || 'N/A'}`);
        console.log(`Failed: ${results.stats?.failed || 'N/A'}`);
        console.log(`Skipped: ${results.stats?.skipped || 'N/A'}`);

        if (results.stats?.failed > 0) {
          console.log('\n❌ Failed Tests:');
          results.suites?.forEach((suite: any) => {
            suite.tests?.forEach((test: any) => {
              if (test.outcome === 'failed') {
                console.log(`  - ${test.title}`);
              }
            });
          });
        }
      }
    } catch (error) {
      console.log('ℹ️ Could not generate test summary:', error.message);
    }

    console.log('✅ Scout Dashboard E2E Test Suite Teardown Complete');

  } catch (error) {
    console.error('❌ Teardown failed:', error);
  } finally {
    await browser.close();
  }
}

export default globalTeardown;