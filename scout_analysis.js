import { chromium } from 'playwright';
import fs from 'fs';

async function analyzeScoutDashboard() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Scout dashboard...');
    await page.goto('https://scout-analytics-nextjs.vercel.app/databank', {
      waitUntil: 'networkidle',
      timeout: 60000
    });
    
    // Wait for the page to fully load
    await page.waitForTimeout(5000);
    
    console.log('Taking full page screenshot...');
    await page.screenshot({ 
      path: '/Users/tbwa/scout-dashboard/scout_dashboard_full.png',
      fullPage: true 
    });
    
    console.log('Extracting page source...');
    const pageSource = await page.content();
    fs.writeFileSync('/Users/tbwa/scout-dashboard/scout_page_source.html', pageSource);
    
    console.log('Analyzing React components and structure...');
    
    // Extract React component tree and props
    const componentAnalysis = await page.evaluate(() => {
      const analysis = {
        components: [],
        charts: [],
        kpis: [],
        tabs: [],
        filters: [],
        buttons: [],
        dataStructures: []
      };
      
      // Find all components with React fiber keys
      const reactElements = document.querySelectorAll('[data-testid], [class*="component"], [class*="chart"], [class*="kpi"], [class*="tab"], [class*="filter"]');
      
      reactElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) { // Only visible elements
          analysis.components.push({
            tagName: el.tagName,
            className: el.className,
            textContent: el.textContent ? el.textContent.substring(0, 200) : '',
            attributes: Array.from(el.attributes).map(attr => ({
              name: attr.name,
              value: attr.value
            })),
            bounds: {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            }
          });
        }
      });
      
      // Analyze charts specifically
      const chartElements = document.querySelectorAll('.recharts-wrapper, [class*="chart"], svg[class*="recharts"]');
      chartElements.forEach(chart => {
        const rect = chart.getBoundingClientRect();
        analysis.charts.push({
          type: chart.className,
          bounds: rect,
          innerHTML: chart.innerHTML.substring(0, 500)
        });
      });
      
      // Find KPI cards
      const kpiElements = document.querySelectorAll('[class*="kpi"], [class*="metric"], [class*="card"][class*="stat"]');
      kpiElements.forEach(kpi => {
        analysis.kpis.push({
          className: kpi.className,
          textContent: kpi.textContent,
          innerHTML: kpi.innerHTML.substring(0, 300)
        });
      });
      
      // Find tab elements
      const tabElements = document.querySelectorAll('[role="tab"], [class*="tab"], [class*="Tab"]');
      tabElements.forEach(tab => {
        analysis.tabs.push({
          className: tab.className,
          textContent: tab.textContent,
          role: tab.getAttribute('role'),
          ariaSelected: tab.getAttribute('aria-selected')
        });
      });
      
      // Find filter elements
      const filterElements = document.querySelectorAll('select, input[type="search"], [class*="filter"], [class*="Filter"]');
      filterElements.forEach(filter => {
        analysis.filters.push({
          tagName: filter.tagName,
          type: filter.type,
          className: filter.className,
          placeholder: filter.placeholder,
          value: filter.value
        });
      });
      
      // Find buttons and interactive elements
      const buttonElements = document.querySelectorAll('button, [role="button"], [class*="button"], [class*="btn"]');
      buttonElements.forEach(btn => {
        analysis.buttons.push({
          className: btn.className,
          textContent: btn.textContent,
          type: btn.type,
          role: btn.getAttribute('role')
        });
      });
      
      return analysis;
    });
    
    console.log('Extracting JavaScript and CSS resources...');
    
    // Get all script and style resources
    const resources = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(s => s.href);
      return { scripts, styles };
    });
    
    // Try to extract React props and state if possible
    console.log('Attempting to extract React component props...');
    const reactData = await page.evaluate(() => {
      // Look for React DevTools or component data
      const reactRoot = document.querySelector('#__next, [data-reactroot]');
      if (reactRoot && reactRoot._reactInternalFiber) {
        return 'React Fiber detected';
      }
      return 'React data not directly accessible';
    });
    
    // Look for specific chart libraries
    const chartLibraries = await page.evaluate(() => {
      return {
        recharts: !!window.Recharts || document.querySelector('.recharts-wrapper') !== null,
        d3: !!window.d3,
        chartjs: !!window.Chart,
        amcharts: !!window.am4core || !!window.am5,
        highcharts: !!window.Highcharts
      };
    });
    
    // Extract network requests to understand data flow
    console.log('Monitoring network requests...');
    const networkRequests = [];
    page.on('response', response => {
      if (response.url().includes('api') || response.url().includes('.json')) {
        networkRequests.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers()
        });
      }
    });
    
    // Refresh page to capture API calls
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const analysisResults = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      title: await page.title(),
      componentAnalysis,
      resources,
      reactData,
      chartLibraries,
      networkRequests: networkRequests.slice(-10) // Last 10 requests
    };
    
    fs.writeFileSync('/Users/tbwa/scout-dashboard/scout_analysis.json', JSON.stringify(analysisResults, null, 2));
    
    console.log('Analysis complete!');
    console.log(`Found ${componentAnalysis.components.length} components`);
    console.log(`Found ${componentAnalysis.charts.length} charts`);
    console.log(`Found ${componentAnalysis.kpis.length} KPI elements`);
    console.log(`Found ${componentAnalysis.tabs.length} tabs`);
    console.log(`Found ${componentAnalysis.filters.length} filters`);
    console.log(`Found ${componentAnalysis.buttons.length} buttons`);
    
    return analysisResults;
    
  } catch (error) {
    console.error('Error analyzing dashboard:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeScoutDashboard().catch(console.error);