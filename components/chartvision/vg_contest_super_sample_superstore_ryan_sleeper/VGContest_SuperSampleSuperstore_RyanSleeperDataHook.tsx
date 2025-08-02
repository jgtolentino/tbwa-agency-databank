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

export const useVGContestSuperSampleSuperstoreRyanSleeperData = () => {
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
        mockData.allusmap_data = generateMockData('All US Map'); mockData.annotationsbutton:active_data = generateMockData('Annotations Button: Active'); mockData.annotationsbutton:inactive_data = generateMockData('Annotations Button: Inactive'); mockData.centralmap_data = generateMockData('Central Map'); mockData.daystoshipbullet_data = generateMockData('Days to Ship Bullet'); mockData.daystoshipdifference_data = generateMockData('Days to Ship Difference'); mockData.daystoshipregioncomp_data = generateMockData('Days to Ship Region Comp'); mockData.daystoshiptrend_data = generateMockData('Days to Ship Trend'); mockData.descriptivebutton:active_data = generateMockData('Descriptive Button: Active'); mockData.descriptivebutton:inactive_data = generateMockData('Descriptive Button: Inactive'); mockData.eastmap_data = generateMockData('East Map'); mockData.insight1_data = generateMockData('Insight 1'); mockData.insight1indicator_data = generateMockData('Insight 1 Indicator'); mockData.insight2_data = generateMockData('Insight 2'); mockData.insight3_data = generateMockData('Insight 3'); mockData.insightindicator2_data = generateMockData('Insight Indicator 2'); mockData.insightindicator3_data = generateMockData('Insight Indicator 3'); mockData.prescriptivebutton:active_data = generateMockData('Prescriptive Button: Active'); mockData.prescriptivebutton:inactive_data = generateMockData('Prescriptive Button: Inactive'); mockData.prescriptivemap_data = generateMockData('Prescriptive Map'); mockData.prescriptivescatterplot_data = generateMockData('Prescriptive Scatter Plot'); mockData.profitratiobullet_data = generateMockData('Profit Ratio Bullet'); mockData.profitratiocallout_data = generateMockData('Profit Ratio Callout'); mockData.profitratioregioncomp_data = generateMockData('Profit Ratio Region Comp'); mockData.profitratiotrend_data = generateMockData('Profit Ratio Trend'); mockData.salesbullet_data = generateMockData('Sales Bullet'); mockData.salescallout_data = generateMockData('Sales Callout'); mockData.salesregioncomp_data = generateMockData('Sales Region Comp'); mockData.salestrend_data = generateMockData('Sales Trend'); mockData.southmap_data = generateMockData('South Map'); mockData.westmap_data = generateMockData('West Map'); mockData.x-axislabel_data = generateMockData('X-Axis Label');
        
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
