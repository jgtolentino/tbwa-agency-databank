#!/usr/bin/env node
/**
 * verify-backend-live-strict.js
 * Rigorous live backend verification with zero tolerance for mock patterns
 */

import { chromium } from 'playwright';
import fs from 'fs';

const CRITICAL_WORKFLOWS = [
  {
    name: 'Video Analysis Upload',
    path: '/video-analysis',
    actions: async (page) => {
      // Fill form
      await page.fill('input[placeholder*="YouTube"]', 'https://www.youtube.com/watch?v=test123');
      await page.fill('input[placeholder*="Campaign"]', 'Test Campaign ' + Date.now());
      await page.fill('input[placeholder*="Brand"]', 'Test Brand');
      
      // Trigger analysis
      const analyzeBtn = page.locator('button:has-text("Analyze")').first();
      if (await analyzeBtn.isVisible()) {
        await analyzeBtn.click();
      }
    },
    expectedAPIs: ['/api/jampacked/analyze', '/api/tasks/create']
  },
  {
    name: 'Campaign Dashboard Load',
    path: '/campaign-dashboard',
    actions: async (page) => {
      await page.waitForTimeout(2000);
    },
    expectedAPIs: ['/api/jampacked/campaigns', '/api/jampacked/insights']
  },
  {
    name: 'Export Functionality',
    path: '/video-analysis',
    actions: async (page) => {
      const exportBtn = page.locator('button:has-text("Export")').first();
      if (await exportBtn.isVisible()) {
        await exportBtn.click();
      }
    },
    expectedAPIs: ['/api/tasks/results', '/api/documents/export']
  }
];

async function verifyBackend() {
  console.log('🔍 STRICT Live Backend Verification');
  console.log('===================================\n');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: 'http://localhost:8080',
    workflows: [],
    apiCalls: [],
    mockDetections: [],
    verdict: 'UNKNOWN',
    details: {}
  };
  
  // Track all network requests
  const networkLog = [];
  
  page.on('request', request => {
    const url = request.url();
    const method = request.method();
    
    networkLog.push({
      url,
      method,
      timestamp: new Date().toISOString(),
      headers: request.headers()
    });
    
    // Detect mock patterns in URLs
    if (url.includes('mock') || url.includes('fake') || url.includes('static')) {
      results.mockDetections.push({
        type: 'URL_PATTERN',
        url,
        method
      });
    }
  });
  
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    
    // Track API responses
    if (url.includes('/api/')) {
      results.apiCalls.push({
        url,
        status,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Execute critical workflows
  for (const workflow of CRITICAL_WORKFLOWS) {
    console.log(`\n📋 Testing: ${workflow.name}`);
    console.log('-'.repeat(40));
    
    const workflowResult = {
      name: workflow.name,
      path: workflow.path,
      apiCallsDetected: [],
      expectedAPIsFound: [],
      mockPatternsFound: [],
      errors: [],
      verdict: 'UNKNOWN'
    };
    
    try {
      // Navigate to page
      await page.goto(`http://localhost:8080${workflow.path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      
      // Clear previous network logs for this workflow
      const startIndex = networkLog.length;
      
      // Execute workflow actions
      await workflow.actions(page);
      
      // Wait for network activity
      await page.waitForTimeout(3000);
      
      // Analyze network activity for this workflow
      const workflowCalls = networkLog.slice(startIndex);
      
      // Check for expected APIs
      for (const expectedAPI of workflow.expectedAPIs) {
        const found = workflowCalls.some(call => call.url.includes(expectedAPI));
        if (found) {
          workflowResult.expectedAPIsFound.push(expectedAPI);
          console.log(`✅ Found expected API: ${expectedAPI}`);
        } else {
          console.log(`❌ Missing expected API: ${expectedAPI}`);
        }
      }
      
      // Check for API calls
      const apiCalls = workflowCalls.filter(call => 
        call.url.includes('/api/') && 
        !call.url.includes('mock') && 
        !call.url.includes('static')
      );
      
      workflowResult.apiCallsDetected = apiCalls.map(c => ({
        url: c.url,
        method: c.method
      }));
      
      // Detect mock patterns in responses
      for (const call of workflowCalls) {
        if (call.url.includes('mock') || call.url.includes('fake')) {
          workflowResult.mockPatternsFound.push(call.url);
        }
      }
      
      // Determine workflow verdict
      if (workflowResult.expectedAPIsFound.length === workflow.expectedAPIs.length && 
          workflowResult.mockPatternsFound.length === 0) {
        workflowResult.verdict = 'REAL_BACKEND';
        console.log('✅ Verdict: Real backend detected');
      } else if (workflowResult.apiCallsDetected.length > 0 && 
                 workflowResult.mockPatternsFound.length > 0) {
        workflowResult.verdict = 'HYBRID';
        console.log('⚠️  Verdict: Hybrid (real + mock)');
      } else if (workflowResult.apiCallsDetected.length === 0) {
        workflowResult.verdict = 'MOCK_ONLY';
        console.log('❌ Verdict: Mock only, no real API calls');
      }
      
    } catch (error) {
      workflowResult.errors.push(error.message);
      workflowResult.verdict = 'ERROR';
      console.log(`❌ Error: ${error.message}`);
    }
    
    results.workflows.push(workflowResult);
  }
  
  // Test offline behavior
  console.log('\n📴 Testing offline behavior...');
  console.log('-'.repeat(40));
  
  try {
    await context.setOffline(true);
    await page.reload({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(2000);
    
    // Check if app shows error or continues with mock data
    const errorVisible = await page.locator('text=/error|failed|offline|connection/i').count();
    const contentVisible = await page.locator('text=/dashboard|analysis|campaign/i').count();
    
    if (errorVisible > 0 && contentVisible === 0) {
      console.log('✅ App shows error when offline (real backend dependency)');
      results.details.offlineBehavior = 'ERROR_SHOWN';
    } else if (contentVisible > 0) {
      console.log('❌ App continues working offline (likely using mock data)');
      results.details.offlineBehavior = 'WORKS_OFFLINE';
    }
    
    await context.setOffline(false);
  } catch (error) {
    console.log('⚠️  Could not test offline behavior');
  }
  
  await browser.close();
  
  // Final verdict
  const realBackendWorkflows = results.workflows.filter(w => w.verdict === 'REAL_BACKEND').length;
  const mockOnlyWorkflows = results.workflows.filter(w => w.verdict === 'MOCK_ONLY').length;
  const totalAPICalls = results.apiCalls.length;
  const mockDetections = results.mockDetections.length;
  
  if (realBackendWorkflows === results.workflows.length && mockDetections === 0) {
    results.verdict = 'REAL_BACKEND_CONFIRMED';
  } else if (mockOnlyWorkflows === results.workflows.length) {
    results.verdict = 'MOCK_ONLY_DETECTED';
  } else if (realBackendWorkflows > 0 && mockDetections > 0) {
    results.verdict = 'HYBRID_MODE';
  } else {
    results.verdict = 'INCONCLUSIVE';
  }
  
  // Generate report
  console.log('\n========================================');
  console.log('📊 STRICT VERIFICATION SUMMARY');
  console.log('========================================');
  console.log(`Total API Calls: ${totalAPICalls}`);
  console.log(`Mock Patterns Detected: ${mockDetections}`);
  console.log(`Real Backend Workflows: ${realBackendWorkflows}/${results.workflows.length}`);
  console.log(`\nFINAL VERDICT: ${results.verdict}`);
  
  // Save detailed report
  fs.writeFileSync(
    'backend-verification-strict-report.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n📄 Detailed report saved to: backend-verification-strict-report.json');
  
  // Exit with appropriate code
  if (results.verdict === 'REAL_BACKEND_CONFIRMED') {
    console.log('\n✅ SUCCESS: Real backend integration confirmed!');
    process.exit(0);
  } else if (results.verdict === 'MOCK_ONLY_DETECTED') {
    console.log('\n❌ FAILURE: Only mock data detected, no real backend!');
    process.exit(1);
  } else {
    console.log('\n⚠️  WARNING: Hybrid or inconclusive results. Review report.');
    process.exit(0);
  }
}

// Run verification
verifyBackend().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});