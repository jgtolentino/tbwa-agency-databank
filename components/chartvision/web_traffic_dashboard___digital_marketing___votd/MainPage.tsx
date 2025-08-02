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

export const Analysed&RefPeriod_HeaderComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_152583318756887076" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgTimeonPageValuevsRef_BarComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgTimeonPageValuevsRef_Bar&LineComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgTimeonPage_%DiffComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgTimeonPage_ValuevsRef_Bar&GanttComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgUniquePageviewsValuevsRef_BarComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgUniquePageviewsValuevsRef_Bar&LineComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgUniquePageviews_%DiffComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AvgUniquePageviews_ValuevsRef_Bar&GanttComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ColorLegend1Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1071856711511261194" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ColorLegend2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1071856711511261194" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ColorLegend3Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1071856711512395791" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Headers_Top5_AvgTimeonPageComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Headers_Top5_AvgUniquePageviewsComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Headers_Top5_SessionDurationComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Headers_Top5_TotalSessionsComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_AvgTimeonPage_BANComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_AvgTimeonPage_BAN_2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_152583318756887076" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_AvgTimeonPage_ChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_AvgUniquePageviews_BANComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_AvgUniquePageviews_BAN_2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_152583318756887076" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_AvgUniquePageviews_ChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_SessionDuration_BANComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_SessionDuration_BAN_2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_152583318756887076" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_SessionDuration_ChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_TotalSessions_BANComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_TotalSessions_BAN_2Component = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_152583318756887076" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const KPI_TotalSessions_ChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const LinkedIn_LinkComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MiniTrends_AvgTimeonPageComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MiniTrends_AvgUniquePageviewsComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MiniTrends_SessionDurationComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MiniTrends_TotalSessionsComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Original_Viz_LinkComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionDurationValuevsRef_BarComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionDurationValuevsRef_Bar&LineComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionDuration_%DiffComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionDuration_ValuevsRef_Bar&GanttComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sessions&AvgUniquePageviewsbyChannelGrouping_BarChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sessions(%)ByChannelGrouping_BarChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionsByCategory_Bounce%TextComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionsByChannelGrouping_AreaChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_315702327942595648" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionsByCountry_MapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionsByDevice_DonutComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionsByDevice_TextComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SessionsBySource_ProgressBarComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Sessions,AvgTime&Bounce%byPageTitle_BarChartComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SizeLegend_ForMapComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SlowPages_Bar_Viz-in-tooltipComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const SlowPages_NotificationBadgeComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalSessionsValuevsRef_BarComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalSessionsValuevsRef_Bar&LineComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalSessions_%DiffComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="LinPack_058384165662193449" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TotalSessions_ValuevsRef_Bar&GanttComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_1178535795512639490" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const Twitter_LinkComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="@Color (copy)_195625177193099269" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const UserName&ImageComponent = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Calculation_195625177174040576" />
        <YAxis />
        <Tooltip />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Page layout component
export const MainPage = () => {
  const { data, loading, error } = useWebTrafficDashboardDigitalMarketingVOTDData();
  
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
          <h3>Analysed & Ref Period_Header</h3>
          <Analysed&RefPeriod_HeaderComponent data={data.analysed&refperiod_header_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Time on Page Value vs Ref_Bar</h3>
          <AvgTimeonPageValuevsRef_BarComponent data={data.avgtimeonpagevaluevsref_bar_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Time on Page Value vs Ref_Bar&Line</h3>
          <AvgTimeonPageValuevsRef_Bar&LineComponent data={data.avgtimeonpagevaluevsref_bar&line_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Time on Page_% Diff</h3>
          <AvgTimeonPage_%DiffComponent data={data.avgtimeonpage_%diff_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Time on Page_Value vs Ref_Bar & Gantt</h3>
          <AvgTimeonPage_ValuevsRef_Bar&GanttComponent data={data.avgtimeonpage_valuevsref_bar&gantt_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Unique Pageviews Value vs Ref_Bar</h3>
          <AvgUniquePageviewsValuevsRef_BarComponent data={data.avguniquepageviewsvaluevsref_bar_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Unique Pageviews Value vs Ref_Bar&Line</h3>
          <AvgUniquePageviewsValuevsRef_Bar&LineComponent data={data.avguniquepageviewsvaluevsref_bar&line_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Unique Pageviews_% Diff</h3>
          <AvgUniquePageviews_%DiffComponent data={data.avguniquepageviews_%diff_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Avg Unique Pageviews_Value vs Ref_Bar & Gantt</h3>
          <AvgUniquePageviews_ValuevsRef_Bar&GanttComponent data={data.avguniquepageviews_valuevsref_bar&gantt_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Color Legend 1</h3>
          <ColorLegend1Component data={data.colorlegend1_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Color Legend 2</h3>
          <ColorLegend2Component data={data.colorlegend2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Color Legend 3</h3>
          <ColorLegend3Component data={data.colorlegend3_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Headers_Top 5_Avg Time on Page</h3>
          <Headers_Top5_AvgTimeonPageComponent data={data.headers_top5_avgtimeonpage_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Headers_Top 5_Avg Unique Pageviews</h3>
          <Headers_Top5_AvgUniquePageviewsComponent data={data.headers_top5_avguniquepageviews_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Headers_Top 5_Session Duration</h3>
          <Headers_Top5_SessionDurationComponent data={data.headers_top5_sessionduration_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Headers_Top 5_Total Sessions</h3>
          <Headers_Top5_TotalSessionsComponent data={data.headers_top5_totalsessions_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Avg Time on Page_BAN</h3>
          <KPI_AvgTimeonPage_BANComponent data={data.kpi_avgtimeonpage_ban_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Avg Time on Page_BAN_2</h3>
          <KPI_AvgTimeonPage_BAN_2Component data={data.kpi_avgtimeonpage_ban_2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Avg Time on Page_Chart</h3>
          <KPI_AvgTimeonPage_ChartComponent data={data.kpi_avgtimeonpage_chart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Avg Unique Pageviews_BAN</h3>
          <KPI_AvgUniquePageviews_BANComponent data={data.kpi_avguniquepageviews_ban_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Avg Unique Pageviews_BAN_2</h3>
          <KPI_AvgUniquePageviews_BAN_2Component data={data.kpi_avguniquepageviews_ban_2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Avg Unique Pageviews_Chart</h3>
          <KPI_AvgUniquePageviews_ChartComponent data={data.kpi_avguniquepageviews_chart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Session Duration_BAN</h3>
          <KPI_SessionDuration_BANComponent data={data.kpi_sessionduration_ban_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Session Duration_BAN_2</h3>
          <KPI_SessionDuration_BAN_2Component data={data.kpi_sessionduration_ban_2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Session Duration_Chart</h3>
          <KPI_SessionDuration_ChartComponent data={data.kpi_sessionduration_chart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Total Sessions_BAN</h3>
          <KPI_TotalSessions_BANComponent data={data.kpi_totalsessions_ban_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Total Sessions_BAN_2</h3>
          <KPI_TotalSessions_BAN_2Component data={data.kpi_totalsessions_ban_2_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>KPI_Total Sessions_Chart</h3>
          <KPI_TotalSessions_ChartComponent data={data.kpi_totalsessions_chart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>LinkedIn_Link</h3>
          <LinkedIn_LinkComponent data={data.linkedin_link_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Mini Trends_Avg Time on Page</h3>
          <MiniTrends_AvgTimeonPageComponent data={data.minitrends_avgtimeonpage_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Mini Trends_Avg Unique Pageviews</h3>
          <MiniTrends_AvgUniquePageviewsComponent data={data.minitrends_avguniquepageviews_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Mini Trends_Session Duration</h3>
          <MiniTrends_SessionDurationComponent data={data.minitrends_sessionduration_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Mini Trends_Total Sessions</h3>
          <MiniTrends_TotalSessionsComponent data={data.minitrends_totalsessions_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Original_Viz_Link</h3>
          <Original_Viz_LinkComponent data={data.original_viz_link_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Session Duration Value vs Ref_Bar</h3>
          <SessionDurationValuevsRef_BarComponent data={data.sessiondurationvaluevsref_bar_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Session Duration Value vs Ref_Bar&Line</h3>
          <SessionDurationValuevsRef_Bar&LineComponent data={data.sessiondurationvaluevsref_bar&line_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Session Duration _% Diff</h3>
          <SessionDuration_%DiffComponent data={data.sessionduration_%diff_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Session Duration_Value vs Ref_Bar & Gantt</h3>
          <SessionDuration_ValuevsRef_Bar&GanttComponent data={data.sessionduration_valuevsref_bar&gantt_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions & Avg Unique Pageviews by Channel Grouping_Bar Chart</h3>
          <Sessions&AvgUniquePageviewsbyChannelGrouping_BarChartComponent data={data.sessions&avguniquepageviewsbychannelgrouping_barchart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions (%) By Channel Grouping_Bar Chart</h3>
          <Sessions(%)ByChannelGrouping_BarChartComponent data={data.sessions(%)bychannelgrouping_barchart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions By Category_Bounce% Text</h3>
          <SessionsByCategory_Bounce%TextComponent data={data.sessionsbycategory_bounce%text_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions By Channel Grouping_Area Chart</h3>
          <SessionsByChannelGrouping_AreaChartComponent data={data.sessionsbychannelgrouping_areachart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions By Country_Map</h3>
          <SessionsByCountry_MapComponent data={data.sessionsbycountry_map_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions By Device_Donut</h3>
          <SessionsByDevice_DonutComponent data={data.sessionsbydevice_donut_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions By Device_Text</h3>
          <SessionsByDevice_TextComponent data={data.sessionsbydevice_text_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions By Source_Progress Bar</h3>
          <SessionsBySource_ProgressBarComponent data={data.sessionsbysource_progressbar_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Sessions, Avg Time & Bounce % by Page Title_Bar Chart</h3>
          <Sessions,AvgTime&Bounce%byPageTitle_BarChartComponent data={data.sessions,avgtime&bounce%bypagetitle_barchart_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Size Legend_For Map</h3>
          <SizeLegend_ForMapComponent data={data.sizelegend_formap_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Slow Pages_ Bar_Viz-in-tooltip</h3>
          <SlowPages_Bar_Viz-in-tooltipComponent data={data.slowpages_bar_viz-in-tooltip_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Slow Pages_ Notification Badge</h3>
          <SlowPages_NotificationBadgeComponent data={data.slowpages_notificationbadge_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Sessions Value vs Ref_Bar</h3>
          <TotalSessionsValuevsRef_BarComponent data={data.totalsessionsvaluevsref_bar_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Sessions Value vs Ref_Bar&Line</h3>
          <TotalSessionsValuevsRef_Bar&LineComponent data={data.totalsessionsvaluevsref_bar&line_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Sessions_% Diff</h3>
          <TotalSessions_%DiffComponent data={data.totalsessions_%diff_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Total Sessions_Value vs Ref_Bar & Gantt</h3>
          <TotalSessions_ValuevsRef_Bar&GanttComponent data={data.totalsessions_valuevsref_bar&gantt_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>Twitter_Link</h3>
          <Twitter_LinkComponent data={data.twitter_link_data || []} />
        </div>
        <div 
          className="dashboard-item"
          style={{
            gridColumn: 'span 2',
            gridRow: 'span 2'
          }}
        >
          <h3>User Name & Image</h3>
          <UserName&ImageComponent data={data.username&image_data || []} />
        </div>
      </div>
    </div>
  );
};
