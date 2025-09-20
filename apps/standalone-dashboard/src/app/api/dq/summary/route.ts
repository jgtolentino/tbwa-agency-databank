import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  throw new Error('Supabase configuration is missing. Check environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // Fetch data health summary
    const { data: summary, error: summaryError } = await supabase
      .from('v_data_health_summary')
      .select('*')
      .single();

    if (summaryError) {
      console.error('Summary error:', summaryError);
      return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
    }

    // Fetch data health issues
    const { data: issues, error: issuesError } = await supabase
      .from('v_data_health_issues')
      .select('*')
      .order('detected_at', { ascending: false });

    if (issuesError) {
      console.error('Issues error:', issuesError);
      return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }

    // Fetch ETL activity stream
    const { data: activity, error: activityError } = await supabase
      .from('v_etl_activity_stream')
      .select('*')
      .order('last_activity', { ascending: false })
      .limit(10);

    if (activityError) {
      console.error('Activity error:', activityError);
      return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
    }

    return NextResponse.json({
      summary,
      issues: issues || [],
      activity: activity || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}