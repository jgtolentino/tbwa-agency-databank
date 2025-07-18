#!/usr/bin/env node

/**
 * Live Backend Verification Script
 * Uses Playwright to automatically verify backend integration
 */

import { chromium } from 'playwright';
import fs from 'fs';

async function verifyBackend() {
  console.log('🔍 Live Backend Verification for Lions Palette Forge\n');
  
  const browser = await chromium.launch({ 
    headless: true  // Run in headless mode for CI/automation
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Track API calls
  const apiCalls = [];
  const mockCalls = [];
  
  // Monitor network requests
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/api/') || url.includes('/v1/') || url.includes('/backend/')) {
      apiCalls.push({
        method: request.method(),
        url: url,
        timestamp: new Date().toISOString()
      });
    }
    if (url.includes('mock') || url.includes('fake')) {
      mockCalls.push(url);
    }
  });
  
  // Monitor responses
  page.on('response', response => {
    const url = response.url();
    if (url.includes('/api/') && response.status() !== 200) {
      console.log(`❌ API Error: ${response.status()} - ${url}`);
    }
  });
  
  try {
    // Test 1: Load the application
    console.log('📱 Test 1: Loading application...');
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    console.log('✅ Application loaded\n');
    
    // Test 2: Navigate to Video Analysis
    console.log('📹 Test 2: Testing Video Analysis page...');
    try {
      // Try different selectors for navigation
      const navLink = await page.locator('a[href="/video-analysis"], text=Video Analysis, [data-testid="video-analysis-link"]').first();
      if (await navLink.isVisible()) {
        await navLink.click();
      } else {
        // Fallback: navigate directly
        await page.goto('http://localhost:8080/video-analysis');
      }
      await page.waitForTimeout(2000);
    } catch (navError) {
      console.log('⚠️  Could not navigate to Video Analysis, trying direct URL...');
      await page.goto('http://localhost:8080/video-analysis');
    }
    
    // Test 3: Check for API calls on page load
    console.log('🌐 Test 3: Checking initial API calls...');
    if (apiCalls.length > 0) {
      console.log(`✅ Found ${apiCalls.length} API calls:`);
      apiCalls.slice(-5).forEach(call => {
        console.log(`   ${call.method} ${call.url}`);
      });
    } else {
      console.log('⚠️  No API calls detected on page load');
    }
    console.log('');
    
    // Test 4: Test video URL analysis
    console.log('🎥 Test 4: Testing video URL analysis...');
    let apiCallsBefore = apiCalls.length;
    try {
      // Try to find and fill the form fields
      const urlInput = await page.locator('input[placeholder*="YouTube"], input[placeholder*="URL"], input[type="url"]').first();
      const campaignInput = await page.locator('input[placeholder*="Campaign"], input[name="campaign_name"]').first();
      const brandInput = await page.locator('input[placeholder*="Brand"], input[name="brand"]').first();
      
      if (await urlInput.isVisible()) {
        await urlInput.fill('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      }
      if (await campaignInput.isVisible()) {
        await campaignInput.fill('Test Campaign');
      }
      if (await brandInput.isVisible()) {
        await brandInput.fill('Test Brand');
      }
      
      const analyzeButton = await page.locator('button:has-text("Analyze"), button[type="submit"]').first();
      if (await analyzeButton.isVisible()) {
        await analyzeButton.click();
      }
      await page.waitForTimeout(3000);
    } catch (formError) {
      console.log('⚠️  Could not interact with form elements');
    }
    
    const newApiCalls = apiCalls.length - apiCallsBefore;
    if (newApiCalls > 0) {
      console.log(`✅ Analysis triggered ${newApiCalls} new API calls`);
    } else {
      console.log('⚠️  No new API calls after analysis trigger');
    }
    console.log('');
    
    // Test 5: Check for real-time updates
    console.log('⏱️  Test 5: Checking for real-time updates...');
    const progressUpdates = await page.locator('text=/Processing|Analyzing/i').count();
    if (progressUpdates > 0) {
      console.log('✅ Real-time progress indicators found');
    } else {
      console.log('⚠️  No progress indicators detected');
    }
    console.log('');
    
    // Test 6: Test offline behavior
    console.log('📴 Test 6: Testing offline behavior...');
    await context.setOffline(true);
    await page.reload();
    await page.waitForTimeout(2000);
    
    const errorMessages = await page.locator('text=/error|failed|offline/i').count();
    if (errorMessages > 0) {
      console.log('✅ Application shows error in offline mode');
    } else {
      console.log('⚠️  Application still works offline (likely using mock data)');
    }
    
    await context.setOffline(false);
    console.log('');
    
    // Summary
    console.log('════════════════════════════════════════');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`Total API calls detected: ${apiCalls.length}`);
    console.log(`Mock/fake references: ${mockCalls.length}`);
    
    if (apiCalls.length > 0 && mockCalls.length === 0) {
      console.log('\n✅ VERDICT: Real backend integration confirmed');
    } else if (apiCalls.length > 0 && mockCalls.length > 0) {
      console.log('\n⚠️  VERDICT: Hybrid mode - real backend with mock fallbacks');
    } else {
      console.log('\n❌ VERDICT: No backend integration detected - using mock data');
    }
    
    // Export detailed report
    const report = {
      timestamp: new Date().toISOString(),
      apiCalls: apiCalls,
      mockCalls: mockCalls,
      totalApiCalls: apiCalls.length,
      totalMockCalls: mockCalls.length,
      verdict: apiCalls.length > 0 ? 'Backend Integrated' : 'Mock Only'
    };
    
    fs.writeFileSync(
      'backend-verification-report.json',
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n📄 Detailed report saved to: backend-verification-report.json');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run verification
verifyBackend().catch(console.error);