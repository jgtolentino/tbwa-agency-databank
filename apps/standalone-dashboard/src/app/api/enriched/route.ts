import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('scout_gold_transactions_flat')
    .select('*')
    .limit(10000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: Array.isArray(data) ? data : [] });
}