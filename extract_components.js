import { chromium } from 'playwright';
import fs from 'fs';

async function extractDetailedComponents() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('Navigating to Scout dashboard...');
    await page.goto('https://scout-analytics-nextjs.vercel.app/databank', {
      waitUntil: 'networkidle'
    });
    
    await page.waitForTimeout(5000);
    
    console.log('Extracting detailed component information...');
    
    const detailedAnalysis = await page.evaluate(() => {
      const analysis = {
        rechartsComponents: [],
        kpiCards: [],
        tabSystem: {},
        filterComponents: [],
        dataProcessing: [],
        utilityFunctions: [],
        cssClasses: new Set(),
        componentHierarchy: {}
      };
      
      // Extract all Recharts components with detailed configs
      const rechartsElements = document.querySelectorAll(
        '.recharts-wrapper, .recharts-responsive-container, ' +
        '.recharts-pie, .recharts-area, .recharts-bar, .recharts-funnel, ' +
        '.recharts-line-chart, .recharts-area-chart, .recharts-bar-chart, ' +
        '.recharts-pie-chart, .recharts-funnel-chart'
      );
      
      rechartsElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        // Find parent chart container
        let chartContainer = element.closest('[class*="chart"]') || element.closest('.recharts-wrapper');
        
        analysis.rechartsComponents.push({
          index,
          element: element.tagName,
          className: element.className,
          bounds: {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y
          },
          styles: {
            position: computedStyle.position,
            display: computedStyle.display,
            backgroundColor: computedStyle.backgroundColor,
            color: computedStyle.color
          },
          innerHTML: element.innerHTML.substring(0, 1000),
          parentContainer: chartContainer ? {
            className: chartContainer.className,
            tagName: chartContainer.tagName
          } : null,
          // Try to extract any data attributes
          dataAttributes: Array.from(element.attributes)
            .filter(attr => attr.name.startsWith('data-'))
            .map(attr => ({ name: attr.name, value: attr.value }))
        });
      });
      
      // Look for KPI/metric cards with more specific patterns
      const potentialKPIs = document.querySelectorAll(
        '[class*="metric"], [class*="stat"], [class*="kpi"], ' +
        '[class*="card"]:has(span[class*="text-"]), ' +
        'div:has(> span + span), div:has(> h3 + p)'
      );
      
      potentialKPIs.forEach((kpi, index) => {
        const numbers = kpi.textContent.match(/[\d,]+\.?\d*/g) || [];
        const hasLargeText = window.getComputedStyle(kpi).fontSize;
        
        if (numbers.length > 0 || hasLargeText > '18px') {
          analysis.kpiCards.push({
            index,
            className: kpi.className,
            textContent: kpi.textContent.trim(),
            numbers: numbers,
            innerHTML: kpi.innerHTML.substring(0, 500),
            bounds: kpi.getBoundingClientRect()
          });
        }
      });
      
      // Extract tab system
      const tabElements = document.querySelectorAll(
        '[role="tab"], [aria-selected], [class*="tab"]:not([class*="table"])'
      );
      
      if (tabElements.length > 0) {
        analysis.tabSystem = {
          tabElements: Array.from(tabElements).map(tab => ({
            textContent: tab.textContent.trim(),
            className: tab.className,
            ariaSelected: tab.getAttribute('aria-selected'),
            role: tab.getAttribute('role'),
            tabIndex: tab.getAttribute('tabindex')
          })),
          tabContainer: tabElements[0].closest('[role="tablist"], div:has([role="tab"])')?.className || null
        };
      }
      
      // Extract filter/control components
      const filterElements = document.querySelectorAll(
        'select, input[type="search"], input[type="text"], ' +
        'input[type="date"], input[type="range"], ' +
        '[class*="filter"], [class*="search"], [class*="select"]'
      );
      
      filterElements.forEach((filter, index) => {
        analysis.filterComponents.push({
          index,
          type: filter.tagName,
          inputType: filter.type,
          className: filter.className,
          placeholder: filter.placeholder,
          value: filter.value,
          options: filter.tagName === 'SELECT' ? 
            Array.from(filter.options).map(opt => ({
              value: opt.value,
              text: opt.textContent
            })) : null
        });
      });
      
      // Collect all unique CSS classes for pattern analysis
      document.querySelectorAll('*').forEach(el => {
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls.trim()) analysis.cssClasses.add(cls.trim());
          });
        }
      });
      
      // Convert Set to Array for JSON serialization
      analysis.cssClasses = Array.from(analysis.cssClasses);
      
      return analysis;
    });
    
    // Also try to extract any inline scripts or configuration
    const inlineScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script:not([src])'));
      return scripts.map(script => ({
        content: script.innerHTML.substring(0, 2000),
        type: script.type
      })).filter(script => script.content.trim());
    });
    
    // Look for specific data patterns in the HTML
    const pageContent = await page.content();
    const dataPatterns = {
      apiEndpoints: [...new Set((pageContent.match(/\/api\/[^"'\s]+/g) || []))],
      dataKeys: [...new Set((pageContent.match(/data-[\w-]+/g) || []))],
      rechartProps: [...new Set((pageContent.match(/data[A-Z]\w*/g) || []))],
      colorPalettes: [...new Set((pageContent.match(/#[0-9a-fA-F]{6}/g) || []))]
    };
    
    const completeAnalysis = {
      ...detailedAnalysis,
      inlineScripts,
      dataPatterns,
      extractedAt: new Date().toISOString()
    };
    
    fs.writeFileSync('/Users/tbwa/scout-dashboard/detailed_analysis.json', 
      JSON.stringify(completeAnalysis, null, 2));
    
    console.log('Detailed analysis complete!');
    console.log(`Recharts components: ${detailedAnalysis.rechartsComponents.length}`);
    console.log(`KPI cards: ${detailedAnalysis.kpiCards.length}`);
    console.log(`Tab elements: ${detailedAnalysis.tabSystem.tabElements?.length || 0}`);
    console.log(`Filter components: ${detailedAnalysis.filterComponents.length}`);
    console.log(`CSS classes: ${detailedAnalysis.cssClasses.length}`);
    
    return completeAnalysis;
    
  } catch (error) {
    console.error('Error in detailed extraction:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

extractDetailedComponents().catch(console.error);