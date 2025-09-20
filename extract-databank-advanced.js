import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function advancedDatabankExtraction() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    const page = await context.newPage();

    try {
        console.log('Navigating to databank page...');
        await page.goto('https://scout-analytics-nextjs.vercel.app/databank', { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });

        await page.waitForTimeout(5000);

        // Extract React component structure more accurately
        const componentStructure = await page.evaluate(() => {
            // Find the main React app container
            const appContainer = document.querySelector('body > div');
            
            function analyzeElement(element, depth = 0) {
                if (!element || depth > 10) return null;
                
                const result = {
                    tagName: element.tagName.toLowerCase(),
                    className: element.className || '',
                    id: element.id || '',
                    textContent: element.textContent ? element.textContent.substring(0, 100) : '',
                    attributes: {},
                    children: [],
                    isChart: false,
                    chartType: null,
                    depth
                };

                // Extract all attributes
                Array.from(element.attributes).forEach(attr => {
                    result.attributes[attr.name] = attr.value;
                });

                // Check if this is a chart element
                if (element.tagName === 'SVG') {
                    result.isChart = true;
                    result.chartType = 'svg';
                    
                    // Check for Recharts specific classes
                    if (element.classList.contains('recharts-surface')) {
                        result.chartType = 'recharts';
                        result.chartData = {
                            width: element.getAttribute('width'),
                            height: element.getAttribute('height'),
                            viewBox: element.getAttribute('viewBox')
                        };
                    }
                }

                // Look for React Fiber properties (dev mode)
                const reactKeys = Object.keys(element).filter(key => 
                    key.startsWith('__reactInternalInstance') || 
                    key.startsWith('_reactInternalFiber') ||
                    key.startsWith('__reactFiber')
                );
                if (reactKeys.length > 0) {
                    result.hasReactFiber = true;
                }

                // Recursively analyze children (but limit depth)
                if (depth < 5) {
                    Array.from(element.children).forEach(child => {
                        const childAnalysis = analyzeElement(child, depth + 1);
                        if (childAnalysis) {
                            result.children.push(childAnalysis);
                        }
                    });
                }

                return result;
            }

            return analyzeElement(appContainer);
        });

        // Extract all network requests during page load
        const networkRequests = [];
        const responses = [];

        page.on('request', request => {
            networkRequests.push({
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType(),
                headers: request.headers()
            });
        });

        page.on('response', async response => {
            try {
                if (response.url().includes('api') || response.url().includes('data') || response.url().includes('.json')) {
                    const text = await response.text();
                    responses.push({
                        url: response.url(),
                        status: response.status(),
                        contentType: response.headers()['content-type'],
                        data: text.substring(0, 5000) // Limit size
                    });
                }
            } catch (e) {
                // Ignore errors for binary responses
            }
        });

        // Reload to capture all requests
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        // Extract specific databank components
        const databankComponents = await page.evaluate(() => {
            const components = {};

            // Header component
            const header = document.querySelector('h1');
            if (header) {
                components.header = {
                    text: header.textContent,
                    classes: header.className,
                    parent: header.parentElement.className
                };
            }

            // Filter components
            const filters = document.querySelectorAll('select');
            components.filters = Array.from(filters).map(filter => ({
                name: filter.previousElementSibling?.textContent || 'Unknown',
                options: Array.from(filter.options).map(opt => opt.text),
                classes: filter.className
            }));

            // Chart containers
            const chartContainers = document.querySelectorAll('.recharts-responsive-container');
            components.charts = Array.from(chartContainers).map((container, index) => {
                const parentCard = container.closest('.bg-white.rounded-lg');
                const title = parentCard?.querySelector('h2')?.textContent || 'Unknown Chart';
                
                return {
                    index,
                    title,
                    containerClasses: container.className,
                    cardClasses: parentCard?.className || '',
                    chartType: container.querySelector('.recharts-surface') ? 'recharts' : 'unknown',
                    svgElement: {
                        width: container.querySelector('svg')?.getAttribute('width'),
                        height: container.querySelector('svg')?.getAttribute('height'),
                        viewBox: container.querySelector('svg')?.getAttribute('viewBox')
                    }
                };
            });

            // Button components
            const buttons = document.querySelectorAll('button');
            components.buttons = Array.from(buttons).map(btn => ({
                text: btn.textContent.trim(),
                classes: btn.className,
                type: btn.type || 'button',
                hasIcon: !!btn.querySelector('svg')
            }));

            // Tab components
            const tabs = document.querySelectorAll('button[class*="border-b-2"]');
            components.tabs = Array.from(tabs).map(tab => ({
                text: tab.textContent.trim(),
                classes: tab.className,
                isActive: tab.className.includes('border-blue-600')
            }));

            // Metric cards
            const metricCards = document.querySelectorAll('.bg-gray-50.rounded-lg');
            components.metricCards = Array.from(metricCards).map(card => {
                const label = card.querySelector('.text-sm.text-gray-500')?.textContent;
                const value = card.querySelector('.text-2xl, .text-xl')?.textContent;
                const trend = card.querySelector('svg')?.closest('div')?.textContent;
                
                return {
                    label,
                    value,
                    trend,
                    classes: card.className
                };
            });

            // Insight boxes
            const insights = document.querySelectorAll('.bg-blue-50, .bg-green-50, .bg-purple-50');
            components.insights = Array.from(insights).map(insight => ({
                type: insight.className.includes('blue') ? 'blue' : 
                     insight.className.includes('green') ? 'green' : 'purple',
                title: insight.querySelector('.font-medium')?.textContent,
                content: insight.querySelector('p:not(.font-medium)')?.textContent,
                classes: insight.className
            }));

            return components;
        });

        // Extract JavaScript source files
        const jsUrls = await page.evaluate(() => {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            return scripts
                .map(script => script.src)
                .filter(src => src.includes('/_next/static/chunks/') || src.includes('.js'));
        });

        // Try to get source maps or compiled code
        const sourceFiles = {};
        for (const url of jsUrls.slice(0, 5)) { // Limit to first 5 files
            try {
                const response = await page.goto(url);
                const content = await response.text();
                const filename = url.split('/').pop();
                sourceFiles[filename] = {
                    url,
                    content: content.substring(0, 10000), // Limit size
                    size: content.length
                };
            } catch (e) {
                console.log(`Could not fetch ${url}`);
            }
        }

        // Extract CSS classes used throughout the page
        const allClasses = await page.evaluate(() => {
            const classSet = new Set();
            document.querySelectorAll('*').forEach(el => {
                if (el.className && typeof el.className === 'string') {
                    el.className.split(' ').forEach(cls => {
                        if (cls.trim()) classSet.add(cls.trim());
                    });
                }
            });
            return Array.from(classSet).sort();
        });

        // Save all extracted data
        const extractedData = {
            metadata: {
                title: await page.title(),
                url: page.url(),
                extractedAt: new Date().toISOString(),
                userAgent: await page.evaluate(() => navigator.userAgent)
            },
            componentStructure,
            databankComponents,
            networkRequests: networkRequests.filter(req => 
                req.url.includes('scout-analytics') || 
                req.url.includes('api') || 
                req.url.includes('vercel')
            ),
            apiResponses: responses,
            sourceFiles,
            cssClasses: allClasses,
            performance: await page.evaluate(() => ({
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
            }))
        };

        // Save to file
        fs.writeFileSync('/Users/tbwa/scout-dashboard/databank-advanced-extraction.json', 
                         JSON.stringify(extractedData, null, 2), 'utf8');

        console.log('Advanced extraction completed!');
        console.log(`Analyzed ${extractedData.componentStructure?.children?.length || 0} top-level components`);
        console.log(`Found ${extractedData.databankComponents.charts?.length || 0} chart components`);
        console.log(`Captured ${extractedData.networkRequests.length} network requests`);
        console.log(`Extracted ${extractedData.cssClasses.length} CSS classes`);

    } catch (error) {
        console.error('Error during advanced extraction:', error);
    } finally {
        await browser.close();
    }
}

advancedDatabankExtraction();