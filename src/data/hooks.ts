import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ensureArray } from '@/utils/ensureArray';
import type { FlatTxn, Paged } from '@/data/types';
import { fetchTransactions, fetchKpis } from '@/data/api';

export function useTransactions(params?: { page?: number; pageSize?: number }) {
  const q = useQuery({
    queryKey: ['txns', params],
    queryFn: () => fetchTransactions(params),
    staleTime: 60_000,
  });

  const items = useMemo<FlatTxn[]>(
    () => ensureArray<FlatTxn>(q.data),
    [q.data]
  );

  const total =
    (q.data as Paged<FlatTxn> | undefined)?.total ??
    (Array.isArray(q.data) ? (q.data as FlatTxn[]).length : items.length);

  return { ...q, items, total };
}

export function useKpis() {
  const q = useQuery({
    queryKey: ['kpis'],
    queryFn: () => fetchKpis(),
    staleTime: 60_000,
  });
  const items = ensureArray<any>(q.data);
  return { ...q, items };
}
