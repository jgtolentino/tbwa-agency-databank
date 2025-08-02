import { useState, useEffect } from 'react';

// Mock data generator - replace with actual data fetching
const generateMockData = (visual: string) => {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      category: `Item ${i + 1}`,
      value: Math.floor(Math.random() * 100),
      value2: Math.floor(Math.random() * 100),
      date: new Date(2024, 0, i + 1).toISOString(),
    });
  }
  return data;
};

export const useSampleSuperstoreSalesPerformanceVOTDData = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        // In production, replace with actual API calls
        const mockData: any = {};
        
        // Generate mock data for each visual
        mockData.@download_data = generateMockData('@Download'); mockData.header_data = generateMockData('Header'); mockData.header(2)_data = generateMockData('Header (2)'); mockData.header(3)_data = generateMockData('Header (3)'); mockData.header(4)_data = generateMockData('Header (4)'); mockData.header(5)_data = generateMockData('Header (5)'); mockData.header(6)_data = generateMockData('Header (6)'); mockData.header(7)_data = generateMockData('Header (7)'); mockData.i-info_data = generateMockData('I - Info'); mockData.i-linkedin_data = generateMockData('I - LinkedIn'); mockData.i-twitter_data = generateMockData('I - Twitter'); mockData.map-colorlegend_data = generateMockData('Map - Color Legend'); mockData.monthlysalestrend-category_data = generateMockData('Monthly Sales Trend - Category'); mockData.monthlysalestrend-region_data = generateMockData('Monthly Sales Trend - Region'); mockData.orderdetails|show/hide_data = generateMockData('Order Details | Show/Hide'); mockData.salesbycategory_data = generateMockData('Sales by Category'); mockData.salesbycity-tooltip_data = generateMockData('Sales by City - Tooltip'); mockData.salesbyregion_data = generateMockData('Sales by Region'); mockData.salesbysegment_data = generateMockData('Sales by Segment'); mockData.salesbystate-map_data = generateMockData('Sales by State - Map'); mockData.salesbysub-category_data = generateMockData('Sales by Sub-Category'); mockData.salesbysub-category(heatmap)_data = generateMockData('Sales by Sub-Category HeatMap'); mockData.showingresults(indicator)_data = generateMockData('Showing results Indicator'); mockData.topmanufacturersbysales_data = generateMockData('Top Manufacturers by Sales'); mockData.topsalesbystate-kpi_data = generateMockData('Top Sales by State - KPI'); mockData.topsoldproducts-tooltip_data = generateMockData('Top Sold Products - Tooltip'); mockData.weeklysalestrend-header_data = generateMockData('Weekly Sales Trend - Header'); mockData.yoy%-region_data = generateMockData('YOY% -  Region'); mockData.yoy%-category_data = generateMockData('YOY% - Category'); mockData.yoy%-segment_data = generateMockData('YOY% - Segment'); mockData.yoy%-topstates_data = generateMockData('YOY% - Top States'); mockData.yearfilter-buttons_data = generateMockData('Year Filter - Buttons');
        
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { data, loading, error };
};
