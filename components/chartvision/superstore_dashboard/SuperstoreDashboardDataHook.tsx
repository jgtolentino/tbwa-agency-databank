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

export const useSuperstoreDashboardData = () => {
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
        mockData.infobutton_data = generateMockData('Info button'); mockData.lastupdated_data = generateMockData('Last Updated'); mockData.metricselect_data = generateMockData('Metric Select'); mockData.minandmaxdate_data = generateMockData('Min and Max Date'); mockData.profitkpi%chg(ban)_data = generateMockData('Profit KPI % Chg (BAN)'); mockData.profitkpi(ban)_data = generateMockData('Profit KPI (BAN)'); mockData.profitkpi(line)_data = generateMockData('Profit KPI (Line)'); mockData.saleskpi(%chg)_data = generateMockData('Sales KPI (%chg)'); mockData.saleskpi(ban)new_data = generateMockData('Sales KPI (BAN) New'); mockData.saleskpi(line)_data = generateMockData('Sales KPI (Line)'); mockData.sales|bycategory_data = generateMockData('Sales | By Category'); mockData.sales|bycustomer_data = generateMockData('Sales | By Customer'); mockData.sales|bymanufacturer_data = generateMockData('Sales | By Manufacturer'); mockData.sales|byproduct_data = generateMockData('Sales | By Product'); mockData.sales|bysegment_data = generateMockData('Sales | By Segment'); mockData.sales|bystate_data = generateMockData('Sales | By State'); mockData.sales|bysub-category_data = generateMockData('Sales | By Sub-Category'); mockData.table_data = generateMockData('Table'); mockData.totalcustomerskpi%chg(ban)_data = generateMockData('Total Customers KPI % Chg (BAN)'); mockData.totalcustomerskpi(area)_data = generateMockData('Total Customers KPI (Area)'); mockData.totalcustomerskpi(ban)_data = generateMockData('Total Customers KPI (BAN)'); mockData.totalorderskpi&chg(ban)_data = generateMockData('Total Orders KPI & Chg (BAN)'); mockData.totalorderskpi(area)_data = generateMockData('Total Orders KPI (Area)'); mockData.totalorderskpi(ban)_data = generateMockData('Total Orders KPI (BAN)'); mockData.yearselect_data = generateMockData('Year Select');
        
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
