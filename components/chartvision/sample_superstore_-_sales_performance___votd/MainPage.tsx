import { useSampleSuperstoreSalesPerformanceVOTDData } from '../SampleSuperstore-SalesPerformance_VOTDDataHook';
import React from 'react';
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  ScatterChart, Scatter,
  PieChart, Pie, Cell,
  CartesianGrid, XAxis, YAxis,
  Tooltip, Legend,
  ResponsiveContainer,
  ComposedChart,
  Treemap
} from 'recharts';
import { Table, Card, Statistic } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// Individual visual components

export const DownloadComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Category" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderTwoComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderThreeComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderFourComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderFiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderSixComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HeaderSevenComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616920924200" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const IInfoComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_774619140494204982" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ILinkedInComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_856809869386514454" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ITwitterComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_856809869386264595" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MapColorLegendComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="City" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MonthlySalesTrendCategoryComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Category" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MonthlySalesTrendRegionComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const OrderDetailsShowHideComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Category" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbyCategoryComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Category" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbyCityTooltipComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="City" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbyRegionComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbySegmentComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbyStateMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="City" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbySubCategoryComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesbySubCategoryHeatMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ShowingresultsIndicatorComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_870883616948187188" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TopManufacturersbySalesComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TopSalesbyStateKPIComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="City" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TopSoldProductsTooltipComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const WeeklySalesTrendHeaderComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const YOYRegionComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const YOYCategoryComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Category" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const YOYSegmentComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Order Date" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const YOYTopStatesComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="City" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const YearFilterButtonsComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_774619140519575609" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Page layout component
export const MainPage = () => {
  const { data, loading, error } = useSampleSuperstoreSalesPerformanceVOTDData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="dashboard-page">
      <h1>Main</h1>
      <div className="dashboard-grid">
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>@Download</h3>
          <DownloadComponent data={data.download_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header</h3>
          <HeaderComponent data={data.header_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header (2)</h3>
          <HeaderTwoComponent data={data.header(2)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header (3)</h3>
          <HeaderThreeComponent data={data.header(3)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header (4)</h3>
          <HeaderFourComponent data={data.header(4)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header (5)</h3>
          <HeaderFiveComponent data={data.header(5)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header (6)</h3>
          <HeaderSixComponent data={data.header(6)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Header (7)</h3>
          <HeaderSevenComponent data={data.header(7)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>I - Info</h3>
          <IInfoComponent data={data.i-info_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>I - LinkedIn</h3>
          <ILinkedInComponent data={data.i-linkedin_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>I - Twitter</h3>
          <ITwitterComponent data={data.i-twitter_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Map - Color Legend</h3>
          <MapColorLegendComponent data={data.map-colorlegend_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Monthly Sales Trend - Category</h3>
          <MonthlySalesTrendCategoryComponent data={data.monthlysalestrend-category_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Monthly Sales Trend - Region</h3>
          <MonthlySalesTrendRegionComponent data={data.monthlysalestrend-region_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Order Details | Show/Hide</h3>
          <OrderDetailsShowHideComponent data={data.orderdetails|show/hide_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by Category</h3>
          <SalesbyCategoryComponent data={data.salesbycategory_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by City - Tooltip</h3>
          <SalesbyCityTooltipComponent data={data.salesbycity-tooltip_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by Region</h3>
          <SalesbyRegionComponent data={data.salesbyregion_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by Segment</h3>
          <SalesbySegmentComponent data={data.salesbysegment_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by State - Map</h3>
          <SalesbyStateMapComponent data={data.salesbystate-map_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by Sub-Category</h3>
          <SalesbySubCategoryComponent data={data.salesbysub-category_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales by Sub-Category HeatMap</h3>
          <SalesbySubCategoryHeatMapComponent data={data.salesbysub-category(heatmap)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Showing results Indicator</h3>
          <ShowingresultsIndicatorComponent data={data.showingresults(indicator)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Top Manufacturers by Sales</h3>
          <TopManufacturersbySalesComponent data={data.topmanufacturersbysales_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Top Sales by State - KPI</h3>
          <TopSalesbyStateKPIComponent data={data.topsalesbystate-kpi_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Top Sold Products - Tooltip</h3>
          <TopSoldProductsTooltipComponent data={data.topsoldproducts-tooltip_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Weekly Sales Trend - Header</h3>
          <WeeklySalesTrendHeaderComponent data={data.weeklysalestrend-header_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>YOY% -  Region</h3>
          <YOYRegionComponent data={data.yoy%-region_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>YOY% - Category</h3>
          <YOYCategoryComponent data={data.yoy%-category_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>YOY% - Segment</h3>
          <YOYSegmentComponent data={data.yoy%-segment_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>YOY% - Top States</h3>
          <YOYTopStatesComponent data={data.yoy%-topstates_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Year Filter - Buttons</h3>
          <YearFilterButtonsComponent data={data.yearfilter-buttons_data || []} />
        </div>
      </div>
    </div>
  );
};
