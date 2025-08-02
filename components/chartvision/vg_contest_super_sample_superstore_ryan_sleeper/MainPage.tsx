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

export const AllUSMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="CLICK TO HIGHLIGHT (copy)" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AnnotationsButton:ActiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Dashboard" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AnnotationsButton:InactiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Dashboard" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const CentralMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1170935953892237312" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DaystoShipBulletComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DaystoShipDifferenceComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DaystoShipRegionCompComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DaystoShipTrendComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DescriptiveButton:ActiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Dashboard" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DescriptiveButton:InactiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Dashboard" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const EastMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1170935953892237312" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Insight1Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1075515935722782720" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Insight1IndicatorComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1075515935729479681" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Insight2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Insight 1 (copy)" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Insight3Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Insight 1 Indicator (copy)" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const InsightIndicator2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Insight 1 Indicator (copy)" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const InsightIndicator3Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Insight 1 Indicator (copy)" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PrescriptiveButton:ActiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Dashboard" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PrescriptiveButton:InactiveComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Dashboard" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PrescriptiveMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753919090690" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PrescriptiveScatterPlotComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="AdhocCluster:1" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitRatioBulletComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitRatioCalloutComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitRatioRegionCompComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ProfitRatioTrendComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesBulletComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesCalloutComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesRegionCompComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SalesTrendComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_200128753908195328" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SouthMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1170935953892237312" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const WestMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1170935953892237312" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const X-AxisLabelComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_633318743183020038" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Page layout component
export const MainPage = () => {
  const { data, loading, error } = useVGContestSuperSampleSuperstoreRyanSleeperData();
  
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
          <h3>All US Map</h3>
          <AllUSMapComponent data={data.allusmap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Annotations Button: Active</h3>
          <AnnotationsButton:ActiveComponent data={data.annotationsbutton:active_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Annotations Button: Inactive</h3>
          <AnnotationsButton:InactiveComponent data={data.annotationsbutton:inactive_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Central Map</h3>
          <CentralMapComponent data={data.centralmap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Days to Ship Bullet</h3>
          <DaystoShipBulletComponent data={data.daystoshipbullet_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Days to Ship Difference</h3>
          <DaystoShipDifferenceComponent data={data.daystoshipdifference_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Days to Ship Region Comp</h3>
          <DaystoShipRegionCompComponent data={data.daystoshipregioncomp_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Days to Ship Trend</h3>
          <DaystoShipTrendComponent data={data.daystoshiptrend_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Descriptive Button: Active</h3>
          <DescriptiveButton:ActiveComponent data={data.descriptivebutton:active_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Descriptive Button: Inactive</h3>
          <DescriptiveButton:InactiveComponent data={data.descriptivebutton:inactive_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>East Map</h3>
          <EastMapComponent data={data.eastmap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Insight 1</h3>
          <Insight1Component data={data.insight1_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Insight 1 Indicator</h3>
          <Insight1IndicatorComponent data={data.insight1indicator_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Insight 2</h3>
          <Insight2Component data={data.insight2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Insight 3</h3>
          <Insight3Component data={data.insight3_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Insight Indicator 2</h3>
          <InsightIndicator2Component data={data.insightindicator2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Insight Indicator 3</h3>
          <InsightIndicator3Component data={data.insightindicator3_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Prescriptive Button: Active</h3>
          <PrescriptiveButton:ActiveComponent data={data.prescriptivebutton:active_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Prescriptive Button: Inactive</h3>
          <PrescriptiveButton:InactiveComponent data={data.prescriptivebutton:inactive_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Prescriptive Map</h3>
          <PrescriptiveMapComponent data={data.prescriptivemap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Prescriptive Scatter Plot</h3>
          <PrescriptiveScatterPlotComponent data={data.prescriptivescatterplot_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit Ratio Bullet</h3>
          <ProfitRatioBulletComponent data={data.profitratiobullet_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit Ratio Callout</h3>
          <ProfitRatioCalloutComponent data={data.profitratiocallout_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit Ratio Region Comp</h3>
          <ProfitRatioRegionCompComponent data={data.profitratioregioncomp_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Profit Ratio Trend</h3>
          <ProfitRatioTrendComponent data={data.profitratiotrend_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales Bullet</h3>
          <SalesBulletComponent data={data.salesbullet_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales Callout</h3>
          <SalesCalloutComponent data={data.salescallout_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales Region Comp</h3>
          <SalesRegionCompComponent data={data.salesregioncomp_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sales Trend</h3>
          <SalesTrendComponent data={data.salestrend_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>South Map</h3>
          <SouthMapComponent data={data.southmap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>West Map</h3>
          <WestMapComponent data={data.westmap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>X-Axis Label</h3>
          <X-AxisLabelComponent data={data.x-axislabel_data || []} />
        </div>
      </div>
    </div>
  );
};
