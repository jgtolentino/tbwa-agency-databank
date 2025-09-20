import { ensureArray } from '@/utils/ensureArray';

export default function KpiRow({ data }: { data: any[] | { items: any[] } | undefined }) {
  const kpis = ensureArray<any>(data);
  return (
    <div className="grid grid-cols-4 gap-4">
      {kpis.map((k, i) => (
        <div key={k.key ?? i} className="kpi">
          <div className="text-sm opacity-70">{k.label ?? k.name ?? 'Metric'}</div>
          <div className="text-2xl font-semibold">{k.value ?? '-'}</div>
        </div>
      ))}
    </div>
  );
}
