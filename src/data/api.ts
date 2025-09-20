import type { FlatTxn, Paged } from '@/data/types';

export async function fetchTransactions(
  params?: { page?: number; pageSize?: number }
): Promise<Paged<FlatTxn> | FlatTxn[]> {
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
  const url = `/api/transactions${qs.toString() ? `?${qs.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`transactions ${res.status}`);
  return res.json();
}

export async function fetchKpis(): Promise<any[] | { items: any[] }> {
  const res = await fetch('/api/kpis');
  if (!res.ok) throw new Error(`kpis ${res.status}`);
  return res.json();
}
