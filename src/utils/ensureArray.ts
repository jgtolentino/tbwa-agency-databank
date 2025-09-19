export function ensureArray<T>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === 'object' && Array.isArray((v as any).items)) {
    return (v as any).items as T[];
  }
  return [];
}
