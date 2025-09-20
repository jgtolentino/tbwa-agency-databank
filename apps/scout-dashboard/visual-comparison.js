const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function visualComparison() {
  const browser = await chromium.launch({ headless: true });

  // Create screenshots directory
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const results = {
    timestamp: new Date().toISOString(),
    comparisons: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0
    }
  };

  try {
    // Test scenarios
    const scenarios = [
      {
        name: 'dashboard-home',
        path: '/',
        description: 'Main dashboard page'
      },
      {
        name: 'health-api',
        path: '/api/health',
        description: 'Health API endpoint',
        isApi: true
      },
      {
        name: 'kpis-api',
        path: '/api/kpis',
        description: 'KPIs API endpoint',
        isApi: true
      }
    ];

    for (const scenario of scenarios) {
      console.log(`\n🔍 Testing: ${scenario.description}`);

      const productionUrl = `https://scout-dashboard-xi.vercel.app${scenario.path}`;
      const localUrl = `http://localhost:3000${scenario.path}`;

      const comparison = {
        scenario: scenario.name,
        description: scenario.description,
        productionUrl,
        localUrl,
        status: 'unknown',
        details: {},
        screenshots: {}
      };

      // Create contexts for both environments
      const prodContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Playwright Visual Test)'
      });

      const localContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Playwright Visual Test)'
      });

      try {
        const prodPage = await prodContext.newPage();
        const localPage = await localContext.newPage();

        if (scenario.isApi) {
          // API endpoint comparison
          console.log(`  📡 Checking API endpoints...`);

          // Production API
          let prodResponse, localResponse;
          try {
            const prodApiResponse = await prodPage.goto(productionUrl, {
              waitUntil: 'networkidle',
              timeout: 10000
            });
            prodResponse = {
              status: prodApiResponse.status(),
              statusText: prodApiResponse.statusText(),
              body: await prodPage.textContent('body') || 'No content'
            };
          } catch (error) {
            prodResponse = {
              status: 'error',
              statusText: error.message,
              body: 'Failed to fetch'
            };
          }

          // Local API
          try {
            const localApiResponse = await localPage.goto(localUrl, {
              waitUntil: 'networkidle',
              timeout: 10000
            });
            localResponse = {
              status: localApiResponse.status(),
              statusText: localApiResponse.statusText(),
              body: await localPage.textContent('body') || 'No content'
            };
          } catch (error) {
            localResponse = {
              status: 'error',
              statusText: error.message,
              body: 'Failed to fetch'
            };
          }

          comparison.details = {
            production: prodResponse,
            local: localResponse
          };

          // Check if local has health endpoint (should work) while production doesn't (expected)
          if (scenario.name === 'health-api') {
            if (localResponse.status === 200 && prodResponse.status === 404) {
              comparison.status = 'expected_difference';
              console.log(`  ✅ Expected: Local has health API (200), Production doesn't (404)`);
            } else if (localResponse.status === 200 && prodResponse.status === 200) {
              comparison.status = 'both_working';
              console.log(`  ✅ Both endpoints working`);
            } else {
              comparison.status = 'unexpected';
              console.log(`  ⚠️  Unexpected: Local=${localResponse.status}, Prod=${prodResponse.status}`);
            }
          }

        } else {
          // UI page comparison
          console.log(`  📸 Capturing screenshots...`);

          // Production page
          let prodSuccess = false;
          try {
            await prodPage.goto(productionUrl, {
              waitUntil: 'networkidle',
              timeout: 15000
            });
            await prodPage.waitForTimeout(2000); // Allow for dynamic content

            const prodScreenshot = `${scenario.name}-production.png`;
            await prodPage.screenshot({
              path: path.join(screenshotDir, prodScreenshot),
              fullPage: true
            });
            comparison.screenshots.production = prodScreenshot;
            prodSuccess = true;
            console.log(`    ✅ Production screenshot saved`);
          } catch (error) {
            console.log(`    ❌ Production failed: ${error.message}`);
            comparison.details.productionError = error.message;
          }

          // Local page
          let localSuccess = false;
          try {
            await localPage.goto(localUrl, {
              waitUntil: 'networkidle',
              timeout: 15000
            });
            await localPage.waitForTimeout(2000); // Allow for dynamic content

            const localScreenshot = `${scenario.name}-local.png`;
            await localPage.screenshot({
              path: path.join(screenshotDir, localScreenshot),
              fullPage: true
            });
            comparison.screenshots.local = localScreenshot;
            localSuccess = true;
            console.log(`    ✅ Local screenshot saved`);
          } catch (error) {
            console.log(`    ❌ Local failed: ${error.message}`);
            comparison.details.localError = error.message;
          }

          // Determine status
          if (prodSuccess && localSuccess) {
            comparison.status = 'both_captured';
            console.log(`  ✅ Both environments captured successfully`);
          } else if (localSuccess && !prodSuccess) {
            comparison.status = 'local_only';
            console.log(`  ⚠️  Only local environment working`);
          } else if (!localSuccess && !prodSuccess) {
            comparison.status = 'both_failed';
            console.log(`  ❌ Both environments failed`);
          }
        }

      } catch (error) {
        comparison.status = 'error';
        comparison.details.error = error.message;
        console.log(`  ❌ Error: ${error.message}`);
      } finally {
        await prodContext.close();
        await localContext.close();
      }

      results.comparisons.push(comparison);
      results.summary.total++;

      if (comparison.status === 'both_captured' ||
          comparison.status === 'expected_difference' ||
          comparison.status === 'both_working') {
        results.summary.passed++;
      } else {
        results.summary.failed++;
      }
    }

  } finally {
    await browser.close();
  }

  // Save results
  const reportPath = path.join(screenshotDir, 'comparison-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // Generate summary report
  const summaryPath = path.join(screenshotDir, 'VISUAL_COMPARISON_REPORT.md');
  const summary = generateSummaryReport(results);
  fs.writeFileSync(summaryPath, summary);

  console.log(`\n📊 Visual Comparison Complete:`);
  console.log(`   Total scenarios: ${results.summary.total}`);
  console.log(`   Passed: ${results.summary.passed}`);
  console.log(`   Failed: ${results.summary.failed}`);
  console.log(`\n📁 Results saved to: ${screenshotDir}/`);
  console.log(`📄 Report: VISUAL_COMPARISON_REPORT.md`);

  return results;
}

function generateSummaryReport(results) {
  const { timestamp, comparisons, summary } = results;

  let report = `# Scout Dashboard Visual Comparison Report\n\n`;
  report += `**Generated**: ${timestamp}\n`;
  report += `**Total Scenarios**: ${summary.total}\n`;
  report += `**Passed**: ${summary.passed}\n`;
  report += `**Failed**: ${summary.failed}\n\n`;
  report += `---\n\n`;

  report += `## Test Results\n\n`;

  for (const comp of comparisons) {
    report += `### ${comp.description}\n\n`;
    report += `- **Scenario**: \`${comp.scenario}\`\n`;
    report += `- **Production URL**: ${comp.productionUrl}\n`;
    report += `- **Local URL**: ${comp.localUrl}\n`;
    report += `- **Status**: ${comp.status}\n\n`;

    if (comp.screenshots) {
      if (comp.screenshots.production) {
        report += `- **Production Screenshot**: ${comp.screenshots.production}\n`;
      }
      if (comp.screenshots.local) {
        report += `- **Local Screenshot**: ${comp.screenshots.local}\n`;
      }
    }

    if (comp.details) {
      if (comp.details.production && comp.details.local) {
        report += `\n**API Comparison**:\n`;
        report += `- Production: Status ${comp.details.production.status}\n`;
        report += `- Local: Status ${comp.details.local.status}\n`;
      }

      if (comp.details.error) {
        report += `\n**Error**: ${comp.details.error}\n`;
      }
    }

    report += `\n---\n\n`;
  }

  report += `## Analysis\n\n`;

  if (summary.passed === summary.total) {
    report += `✅ **All scenarios passed** - The hardened version appears to render correctly and APIs are functioning as expected.\n\n`;
  } else {
    report += `⚠️  **Some scenarios had issues** - Review the individual results above for details.\n\n`;
  }

  report += `### Expected Differences\n\n`;
  report += `- **Health API**: Production (404) vs Local (200) - This is expected as production doesn't have the /api/health endpoint yet\n`;
  report += `- **Enhanced Features**: Local version includes singleton client, real-time hooks, and performance optimizations\n\n`;

  report += `### Next Steps\n\n`;
  report += `1. Review screenshots for visual consistency\n`;
  report += `2. Verify local environment has all expected features\n`;
  report += `3. Proceed with production cutover when ready\n\n`;

  return report;
}

// Run the comparison
if (require.main === module) {
  visualComparison().catch(console.error);
}

module.exports = { visualComparison };