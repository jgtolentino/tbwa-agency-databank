import { fetchFlat, fetchDemographics, fetchStatsSummary } from './datasource';

const safeDate = (v: any) => (v ? new Date(v).toLocaleString() : '—');

export async function getKpis() {
  const [rows, stats] = await Promise.all([fetchFlat(200000, 0), fetchStatsSummary()]);
  // always guard map
  const list = Array.isArray(rows) ? rows : [];
  return {
    count: list.length,
    sampleDate: list.length > 0 && list[0] && (list[0] as any).ts_ph ? safeDate((list[0] as any).ts_ph) : '—',
    stats: Array.isArray(stats) ? stats : [],
  };
}

export async function getDemographicSlice() {
  const rows = await fetchDemographics(100000, 0);
  return Array.isArray(rows) ? rows : [];
}