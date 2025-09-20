import { getSupabase } from '@/lib/supabaseClient';

export class UnifiedDataService {
  private static instance: UnifiedDataService;
  private constructor() {}

  static getInstance() {
    if (!this.instance) this.instance = new UnifiedDataService();
    return this.instance;
  }

  async getGoldTransactionsFlat(limit = 10000, offset = 0) {
    const db = getSupabase();
    const { data, error } = await db
      .from('scout_gold_transactions_flat') // public shim → gold.v_transactions_flat
      .select('*')
      .order('effective_ts', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  async getDQSummary() {
    const db = getSupabase();
    const { data, error } = await db
      .from('dq_health_summary') // create shim below if needed
      .select('*')
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  }

  async getKPISummary() {
    const db = getSupabase();
    const { data, error } = await db
      .from('scout_stats_summary')
      .select('*')
      .maybeSingle();
    if (error) throw error;
    return data ?? null;
  }

  async getEnrichedData(filters?: Record<string, any>) {
    const db = getSupabase();
    let query = db
      .from('scout_gold_facial_demographics')
      .select('*')
      .order('transaction_ts', { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query.limit(1000);
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }
}