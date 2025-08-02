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

export const useWebTrafficDashboardDigitalMarketingVOTDData = () => {
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
        mockData.analysed&refperiod_header_data = generateMockData('Analysed & Ref Period_Header'); mockData.avgtimeonpagevaluevsref_bar_data = generateMockData('Avg Time on Page Value vs Ref_Bar'); mockData.avgtimeonpagevaluevsref_bar&line_data = generateMockData('Avg Time on Page Value vs Ref_Bar&Line'); mockData.avgtimeonpage_%diff_data = generateMockData('Avg Time on Page_% Diff'); mockData.avgtimeonpage_valuevsref_bar&gantt_data = generateMockData('Avg Time on Page_Value vs Ref_Bar & Gantt'); mockData.avguniquepageviewsvaluevsref_bar_data = generateMockData('Avg Unique Pageviews Value vs Ref_Bar'); mockData.avguniquepageviewsvaluevsref_bar&line_data = generateMockData('Avg Unique Pageviews Value vs Ref_Bar&Line'); mockData.avguniquepageviews_%diff_data = generateMockData('Avg Unique Pageviews_% Diff'); mockData.avguniquepageviews_valuevsref_bar&gantt_data = generateMockData('Avg Unique Pageviews_Value vs Ref_Bar & Gantt'); mockData.colorlegend1_data = generateMockData('Color Legend 1'); mockData.colorlegend2_data = generateMockData('Color Legend 2'); mockData.colorlegend3_data = generateMockData('Color Legend 3'); mockData.headers_top5_avgtimeonpage_data = generateMockData('Headers_Top 5_Avg Time on Page'); mockData.headers_top5_avguniquepageviews_data = generateMockData('Headers_Top 5_Avg Unique Pageviews'); mockData.headers_top5_sessionduration_data = generateMockData('Headers_Top 5_Session Duration'); mockData.headers_top5_totalsessions_data = generateMockData('Headers_Top 5_Total Sessions'); mockData.kpi_avgtimeonpage_ban_data = generateMockData('KPI_Avg Time on Page_BAN'); mockData.kpi_avgtimeonpage_ban_2_data = generateMockData('KPI_Avg Time on Page_BAN_2'); mockData.kpi_avgtimeonpage_chart_data = generateMockData('KPI_Avg Time on Page_Chart'); mockData.kpi_avguniquepageviews_ban_data = generateMockData('KPI_Avg Unique Pageviews_BAN'); mockData.kpi_avguniquepageviews_ban_2_data = generateMockData('KPI_Avg Unique Pageviews_BAN_2'); mockData.kpi_avguniquepageviews_chart_data = generateMockData('KPI_Avg Unique Pageviews_Chart'); mockData.kpi_sessionduration_ban_data = generateMockData('KPI_Session Duration_BAN'); mockData.kpi_sessionduration_ban_2_data = generateMockData('KPI_Session Duration_BAN_2'); mockData.kpi_sessionduration_chart_data = generateMockData('KPI_Session Duration_Chart'); mockData.kpi_totalsessions_ban_data = generateMockData('KPI_Total Sessions_BAN'); mockData.kpi_totalsessions_ban_2_data = generateMockData('KPI_Total Sessions_BAN_2'); mockData.kpi_totalsessions_chart_data = generateMockData('KPI_Total Sessions_Chart'); mockData.linkedin_link_data = generateMockData('LinkedIn_Link'); mockData.minitrends_avgtimeonpage_data = generateMockData('Mini Trends_Avg Time on Page'); mockData.minitrends_avguniquepageviews_data = generateMockData('Mini Trends_Avg Unique Pageviews'); mockData.minitrends_sessionduration_data = generateMockData('Mini Trends_Session Duration'); mockData.minitrends_totalsessions_data = generateMockData('Mini Trends_Total Sessions'); mockData.original_viz_link_data = generateMockData('Original_Viz_Link'); mockData.sessiondurationvaluevsref_bar_data = generateMockData('Session Duration Value vs Ref_Bar'); mockData.sessiondurationvaluevsref_bar&line_data = generateMockData('Session Duration Value vs Ref_Bar&Line'); mockData.sessionduration_%diff_data = generateMockData('Session Duration _% Diff'); mockData.sessionduration_valuevsref_bar&gantt_data = generateMockData('Session Duration_Value vs Ref_Bar & Gantt'); mockData.sessions&avguniquepageviewsbychannelgrouping_barchart_data = generateMockData('Sessions & Avg Unique Pageviews by Channel Grouping_Bar Chart'); mockData.sessions(%)bychannelgrouping_barchart_data = generateMockData('Sessions (%) By Channel Grouping_Bar Chart'); mockData.sessionsbycategory_bounce%text_data = generateMockData('Sessions By Category_Bounce% Text'); mockData.sessionsbychannelgrouping_areachart_data = generateMockData('Sessions By Channel Grouping_Area Chart'); mockData.sessionsbycountry_map_data = generateMockData('Sessions By Country_Map'); mockData.sessionsbydevice_donut_data = generateMockData('Sessions By Device_Donut'); mockData.sessionsbydevice_text_data = generateMockData('Sessions By Device_Text'); mockData.sessionsbysource_progressbar_data = generateMockData('Sessions By Source_Progress Bar'); mockData.sessions,avgtime&bounce%bypagetitle_barchart_data = generateMockData('Sessions, Avg Time & Bounce % by Page Title_Bar Chart'); mockData.sizelegend_formap_data = generateMockData('Size Legend_For Map'); mockData.slowpages_bar_viz-in-tooltip_data = generateMockData('Slow Pages_ Bar_Viz-in-tooltip'); mockData.slowpages_notificationbadge_data = generateMockData('Slow Pages_ Notification Badge'); mockData.totalsessionsvaluevsref_bar_data = generateMockData('Total Sessions Value vs Ref_Bar'); mockData.totalsessionsvaluevsref_bar&line_data = generateMockData('Total Sessions Value vs Ref_Bar&Line'); mockData.totalsessions_%diff_data = generateMockData('Total Sessions_% Diff'); mockData.totalsessions_valuevsref_bar&gantt_data = generateMockData('Total Sessions_Value vs Ref_Bar & Gantt'); mockData.twitter_link_data = generateMockData('Twitter_Link'); mockData.username&image_data = generateMockData('User Name & Image');
        
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
