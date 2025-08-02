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

export const InfobuttonComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1433552097020686337" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const LastUpdatedComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1433552097048879106" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MetricSelectComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1053842352070758417" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MinandMaxDateComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809274097668" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitKPI%Chg(BAN)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitKPI(BAN)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitKPI(Line)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809274097668" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesKPI(%chg)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesKPI(BAN)NewComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesKPI(Line)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809274097668" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sales|ByCategoryComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sales|ByCustomerComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sales|ByManufacturerComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sales|ByProductComponent = ({ data }: { data: any[] }) => {
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

export const Sales|BySegmentComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sales|ByStateComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sales|BySub-CategoryComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TableComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809308368917" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalCustomersKPI%Chg(BAN)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalCustomersKPI(Area)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809274097668" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalCustomersKPI(BAN)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalOrdersKPI&Chg(BAN)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalOrdersKPI(Area)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809274097668" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalOrdersKPI(BAN)Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809294934036" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const YearSelectComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1864208809274097668" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Page layout component
export const MainPage = () => {
  const { data, loading, error } = useSuperstoreDashboardData();
  
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
          <h3>Info button</h3>
          <InfobuttonComponent data={data.infobutton_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Last Updated</h3>
          <LastUpdatedComponent data={data.lastupdated_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Metric Select</h3>
          <MetricSelectComponent data={data.metricselect_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Min and Max Date</h3>
          <MinandMaxDateComponent data={data.minandmaxdate_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit KPI % Chg (BAN)</h3>
          <ProfitKPI%Chg(BAN)Component data={data.profitkpi%chg(ban)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit KPI (BAN)</h3>
          <ProfitKPI(BAN)Component data={data.profitkpi(ban)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit KPI (Line)</h3>
          <ProfitKPI(Line)Component data={data.profitkpi(line)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales KPI (%chg)</h3>
          <SalesKPI(%chg)Component data={data.saleskpi(%chg)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales KPI (BAN) New</h3>
          <SalesKPI(BAN)NewComponent data={data.saleskpi(ban)new_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales KPI (Line)</h3>
          <SalesKPI(Line)Component data={data.saleskpi(line)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By Category</h3>
          <Sales|ByCategoryComponent data={data.sales|bycategory_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By Customer</h3>
          <Sales|ByCustomerComponent data={data.sales|bycustomer_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By Manufacturer</h3>
          <Sales|ByManufacturerComponent data={data.sales|bymanufacturer_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By Product</h3>
          <Sales|ByProductComponent data={data.sales|byproduct_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By Segment</h3>
          <Sales|BySegmentComponent data={data.sales|bysegment_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By State</h3>
          <Sales|ByStateComponent data={data.sales|bystate_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales | By Sub-Category</h3>
          <Sales|BySub-CategoryComponent data={data.sales|bysub-category_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Table</h3>
          <TableComponent data={data.table_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Customers KPI % Chg (BAN)</h3>
          <TotalCustomersKPI%Chg(BAN)Component data={data.totalcustomerskpi%chg(ban)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Customers KPI (Area)</h3>
          <TotalCustomersKPI(Area)Component data={data.totalcustomerskpi(area)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Customers KPI (BAN)</h3>
          <TotalCustomersKPI(BAN)Component data={data.totalcustomerskpi(ban)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Orders KPI & Chg (BAN)</h3>
          <TotalOrdersKPI&Chg(BAN)Component data={data.totalorderskpi&chg(ban)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Orders KPI (Area)</h3>
          <TotalOrdersKPI(Area)Component data={data.totalorderskpi(area)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Orders KPI (BAN)</h3>
          <TotalOrdersKPI(BAN)Component data={data.totalorderskpi(ban)_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Year Select</h3>
          <YearSelectComponent data={data.yearselect_data || []} />
        </div>
      </div>
    </div>
  );
};
