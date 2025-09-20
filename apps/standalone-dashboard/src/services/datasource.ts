import { getSupabase } from '@/lib/supabaseClient';

const STRICT = process.env.NEXT_PUBLIC_STRICT_DATASOURCE === 'true';

// ---------- SUPABASE QUERIES ----------
export async function fetchFlat(limit = 10000, offset = 0) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scout_gold_transactions_flat')
    .select('*')
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function fetchDemographics(limit = 10000, offset = 0) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scout_gold_facial_demographics')
    .select('*')
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

export async function fetchStatsSummary() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scout_stats_summary')
    .select('*');
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}