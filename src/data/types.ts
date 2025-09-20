export type Paged<T> = {
  items: T[];
  total: number;
  page?: number;
  pageSize?: number;
};

export type FlatTxn = Record<string, any>; // keep loose; bind later to your 54-column shape
