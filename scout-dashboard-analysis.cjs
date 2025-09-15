const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeScoutDashboard() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // Create screenshots directory
  const screenshotsDir = './dashboard-analysis';
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  console.log('🚀 Starting Scout Analytics Dashboard Analysis...\n');
  
  try {
    // Navigate to the dashboard
    console.log('📍 Navigating to Scout Analytics Dashboard...');
    await page.goto('https://scout-analytics-nextjs.vercel.app/databank', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    // Wait for content to load
    await page.waitForTimeout(5000);
    
    // Take full page screenshot
    console.log('📸 Capturing full page screenshot...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-full-dashboard.png'), 
      fullPage: true 
    });
    
    // Analyze page structure
    console.log('🔍 Analyzing page structure...');
    
    // Get page title and URL
    const title = await page.title();
    const url = page.url();
    console.log(`Title: ${title}`);
    console.log(`URL: ${url}\n`);
    
    // Analyze navigation structure
    console.log('🧭 Analyzing Navigation Structure...');
    const navigationElements = await page.$$eval('[role="navigation"], nav, .nav, .navbar, .navigation', elements => 
      elements.map(el => ({
        tagName: el.tagName,
        className: el.className,
        text: el.textContent?.trim().substring(0, 200),
        role: el.role || el.getAttribute('role')
      }))
    );
    
    // Get all headings to understand content structure
    console.log('📋 Analyzing Content Structure...');
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
      elements.map(el => ({
        level: el.tagName,
        text: el.textContent?.trim(),
        className: el.className
      }))
    );
    
    // Analyze charts and visualizations
    console.log('📊 Analyzing Charts and Visualizations...');
    
    // Look for common chart libraries and SVG elements
    const chartElements = await page.evaluate(() => {
      const charts = [];
      
      // Check for various chart selectors
      const chartSelectors = [
        'canvas', 
        'svg', 
        '[class*="chart"]', 
        '[class*="Chart"]',
        '[class*="graph"]',
        '[class*="Graph"]',
        '[class*="visualization"]',
        '[data-testid*="chart"]',
        '.recharts-wrapper',
        '.d3-chart',
        '.plotly-graph-div'
      ];
      
      chartSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 50 && rect.height > 50) { // Filter out small elements
            charts.push({
              selector,
              index,
              tagName: el.tagName,
              className: el.className,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              id: el.id,
              parentText: el.parentElement?.textContent?.substring(0, 100)
            });
          }
        });
      });
      
      return charts;
    });
    
    // Analyze interactive elements
    console.log('🎛️ Analyzing Interactive Elements...');
    const interactiveElements = await page.$$eval('button, input, select, [role="button"], .btn, [class*="button"]', elements =>
      elements.map(el => ({
        tagName: el.tagName,
        type: el.type,
        text: el.textContent?.trim().substring(0, 50),
        className: el.className,
        role: el.role || el.getAttribute('role'),
        disabled: el.disabled
      }))
    );
    
    // Analyze form elements and filters
    console.log('🔍 Analyzing Filters and Controls...');
    const formElements = await page.$$eval('form, input, select, textarea, [role="combobox"], [role="listbox"]', elements =>
      elements.map(el => ({
        tagName: el.tagName,
        type: el.type,
        name: el.name,
        placeholder: el.placeholder,
        className: el.className,
        role: el.role || el.getAttribute('role')
      }))
    );
    
    // Analyze data tables
    console.log('📋 Analyzing Data Tables...');
    const tables = await page.$$eval('table, [role="table"], [class*="table"], [class*="grid"]', elements =>
      elements.map((el, index) => {
        const rows = el.querySelectorAll('tr, [role="row"]');
        const headers = el.querySelectorAll('th, [role="columnheader"]');
        return {
          index,
          tagName: el.tagName,
          className: el.className,
          rowCount: rows.length,
          headerCount: headers.length,
          headers: Array.from(headers).map(h => h.textContent?.trim()).slice(0, 10)
        };
      })
    );
    
    // Get color scheme and styling information
    console.log('🎨 Analyzing Design System...');
    const designSystem = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body);
      const colors = [];
      
      // Get primary colors from CSS variables if they exist
      const rootStyle = window.getComputedStyle(document.documentElement);
      const cssVariables = [];
      
      for (let i = 0; i < rootStyle.length; i++) {
        const prop = rootStyle[i];
        if (prop.startsWith('--')) {
          cssVariables.push({
            property: prop,
            value: rootStyle.getPropertyValue(prop).trim()
          });
        }
      }
      
      return {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontFamily: computedStyle.fontFamily,
        fontSize: computedStyle.fontSize,
        cssVariables: cssVariables.slice(0, 20) // Limit to first 20 variables
      };
    });
    
    // Take screenshots of individual chart sections
    console.log('📸 Capturing individual component screenshots...');
    
    // Screenshot each chart
    for (let i = 0; i < Math.min(chartElements.length, 10); i++) {
      const chart = chartElements[i];
      try {
        const element = await page.locator(`${chart.selector}:nth-of-type(${chart.index + 1})`).first();
        if (await element.isVisible()) {
          await element.screenshot({ 
            path: path.join(screenshotsDir, `chart-${i + 1}-${chart.tagName.toLowerCase()}.png`) 
          });
        }
      } catch (e) {
        console.log(`Could not screenshot chart ${i + 1}: ${e.message}`);
      }
    }
    
    // Look for specific metrics and KPIs
    console.log('📊 Analyzing Metrics and KPIs...');
    const metrics = await page.evaluate(() => {
      // Look for number patterns that might be metrics
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        // Look for numbers with common metric patterns
        if (text.match(/[\d,]+\.?\d*[%$]?|[\d,]+\.?\d*[KMB]?|\$[\d,]+\.?\d*/)) {
          textNodes.push({
            text: text,
            parentClass: node.parentElement?.className,
            parentTag: node.parentElement?.tagName
          });
        }
      }
      
      return textNodes.slice(0, 50); // Limit results
    });
    
    // Try to identify different dashboard sections
    console.log('🗂️ Identifying Dashboard Sections...');
    const sections = await page.$$eval('[class*="section"], [class*="container"], [class*="panel"], [class*="card"], .row, .col', elements =>
      elements.map((el, index) => {
        const rect = el.getBoundingClientRect();
        return {
          index,
          className: el.className,
          tagName: el.tagName,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          childrenCount: el.children.length,
          textPreview: el.textContent?.trim().substring(0, 100)
        };
      }).filter(section => section.width > 200 && section.height > 100) // Filter meaningful sections
    );
    
    // Compile comprehensive analysis report
    const analysisReport = {
      timestamp: new Date().toISOString(),
      url,
      title,
      navigation: navigationElements,
      contentStructure: headings,
      charts: chartElements,
      interactiveElements,
      formElements,
      tables,
      designSystem,
      metrics,
      sections: sections.slice(0, 20), // Limit sections
      summary: {
        totalCharts: chartElements.length,
        totalInteractiveElements: interactiveElements.length,
        totalTables: tables.length,
        totalSections: sections.length
      }
    };
    
    // Save analysis report
    fs.writeFileSync(
      path.join(screenshotsDir, 'dashboard-analysis-report.json'), 
      JSON.stringify(analysisReport, null, 2)
    );
    
    console.log('\n✅ Analysis Complete!');
    console.log(`📊 Found ${chartElements.length} charts/visualizations`);
    console.log(`🎛️ Found ${interactiveElements.length} interactive elements`);
    console.log(`📋 Found ${tables.length} data tables`);
    console.log(`🗂️ Found ${sections.length} dashboard sections`);
    console.log(`📸 Screenshots saved to: ${screenshotsDir}`);
    
    return analysisReport;
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    
    // Try to take a screenshot of error state
    try {
      await page.screenshot({ 
        path: path.join(screenshotsDir, 'error-state.png'), 
        fullPage: true 
      });
    } catch (e) {
      console.log('Could not capture error screenshot');
    }
    
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeScoutDashboard()
  .then(report => {
    console.log('\n📋 Analysis Summary:');
    console.log('===================');
    console.log(`URL: ${report.url}`);
    console.log(`Title: ${report.title}`);
    console.log(`Charts Found: ${report.summary.totalCharts}`);
    console.log(`Interactive Elements: ${report.summary.totalInteractiveElements}`);
    console.log(`Data Tables: ${report.summary.totalTables}`);
    console.log(`Dashboard Sections: ${report.summary.totalSections}`);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });