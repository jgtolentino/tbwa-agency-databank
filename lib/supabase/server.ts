import { createBrowserClient } from '@supabase/ssr'

// For Vite client-side only - no server-side rendering needed for this dashboard
export function createServerSupabaseClient() {
  return createBrowserClient(
    import.meta.env.VITE_SUPABASE_URL!,
    import.meta.env.VITE_SUPABASE_ANON_KEY!
  )
}