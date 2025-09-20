import { createClient } from '@supabase/supabase-js';

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Fallback for development
const defaultUrl = 'https://cxzllzyxwpyptfretryc.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4emxsenl4d3B5cHRmcmV0cnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyMDYzMzQsImV4cCI6MjA3MDc4MjMzNH0.TKvgUGWOUPPYgqGmSLlYCy1LfkqpLhTg8jQ38h_TjeE';

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey
);

// Export configuration status for debugging
export const supabaseConfig = {
  url: supabaseUrl || defaultUrl,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  isConfigured: !!(supabaseUrl && supabaseAnonKey)
};