import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function extractDatabankComponents() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to databank page...');
        await page.goto('https://scout-analytics-nextjs.vercel.app/databank', { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });

        // Wait for the page to fully load
        await page.waitForTimeout(5000);

        // Extract the page title and URL
        const title = await page.title();
        const url = page.url();
        console.log(`Page loaded: ${title} at ${url}`);

        // Take a screenshot for reference
        await page.screenshot({ 
            path: '/Users/tbwa/scout-dashboard/databank-screenshot.png',
            fullPage: true 
        });

        // Extract the HTML structure
        const htmlContent = await page.content();
        fs.writeFileSync('/Users/tbwa/scout-dashboard/databank-page.html', htmlContent, 'utf8');

        // Extract React component information from the DOM
        const componentData = await page.evaluate(() => {
            const components = [];
            
            // Find all elements with React-related attributes or classes
            const reactElements = document.querySelectorAll('[data-reactroot], [class*="react"], [class*="component"], [data-testid]');
            
            reactElements.forEach((element, index) => {
                components.push({
                    index,
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    dataTestId: element.getAttribute('data-testid'),
                    innerHTML: element.innerHTML.substring(0, 500) // Truncate for brevity
                });
            });

            // Look for chart elements (Recharts, Chart.js, etc.)
            const chartElements = document.querySelectorAll('svg, canvas, [class*="chart"], [class*="graph"], [class*="viz"]');
            const charts = [];
            
            chartElements.forEach((element, index) => {
                charts.push({
                    index,
                    tagName: element.tagName,
                    className: element.className,
                    id: element.id,
                    width: element.getAttribute('width'),
                    height: element.getAttribute('height')
                });
            });

            // Extract data attributes and potential state information
            const dataAttributes = {};
            document.querySelectorAll('*').forEach(element => {
                Array.from(element.attributes).forEach(attr => {
                    if (attr.name.startsWith('data-')) {
                        dataAttributes[attr.name] = attr.value;
                    }
                });
            });

            return {
                components,
                charts,
                dataAttributes,
                pageTitle: document.title,
                bodyClasses: document.body.className,
                headContent: document.head.innerHTML
            };
        });

        // Extract network requests and API calls
        const networkRequests = [];
        page.on('request', request => {
            networkRequests.push({
                url: request.url(),
                method: request.method(),
                headers: request.headers(),
                postData: request.postData()
            });
        });

        // Reload to capture network requests
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Extract JavaScript bundles and source maps
        const scriptUrls = await page.evaluate(() => {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            return scripts.map(script => script.src);
        });

        // Extract CSS files
        const cssUrls = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            return links.map(link => link.href);
        });

        // Save extracted data
        const extractedData = {
            metadata: {
                title,
                url,
                extractedAt: new Date().toISOString()
            },
            componentData,
            networkRequests: networkRequests.slice(0, 50), // Limit to first 50 requests
            scriptUrls,
            cssUrls
        };

        fs.writeFileSync('/Users/tbwa/scout-dashboard/databank-extraction.json', 
                         JSON.stringify(extractedData, null, 2), 'utf8');

        console.log('Extraction completed successfully!');
        console.log(`Found ${componentData.components.length} React components`);
        console.log(`Found ${componentData.charts.length} chart elements`);
        console.log(`Captured ${networkRequests.length} network requests`);
        
    } catch (error) {
        console.error('Error during extraction:', error);
    } finally {
        await browser.close();
    }
}

extractDatabankComponents();