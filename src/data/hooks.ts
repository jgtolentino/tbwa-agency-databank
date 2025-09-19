import { useMemo } from 'react';
import { ensureArray } from '../utils/ensureArray';
import type { FlatTxn, Paged, KpiSummary } from '../services/dataService';
import { getTransactions, getKpis } from '../services/dataService';
import { useQuery } from '@tanstack/react-query';

export function useTransactions(params?: { page?: number; pageSize?: number }) {
  const q = useQuery({
    queryKey: ['txns', params],
    queryFn: () => getTransactions(params?.page, params?.pageSize),
    staleTime: 60_000,
  });

  const items = useMemo<FlatTxn[]>(
    () => {
      if (!q.data) return [];
      // Handle paged response object
      if ('rows' in q.data) {
        return ensureArray<FlatTxn>(q.data.rows);
      }
      // Handle direct array response
      return ensureArray<FlatTxn>(q.data);
    },
    [q.data]
  );

  // expose count safely
  const total =
    (q.data as Paged<FlatTxn> | undefined)?.total ??
    (Array.isArray(q.data) ? (q.data as FlatTxn[]).length : items.length);

  return { ...q, items, total };
}

export function useKpis() {
  const q = useQuery({
    queryKey: ['kpis'],
    queryFn: () => getKpis(),
    staleTime: 60_000,
  });

  // KPIs return a single object, not an array
  const data = q.data as KpiSummary | undefined;
  return { ...q, data };
}