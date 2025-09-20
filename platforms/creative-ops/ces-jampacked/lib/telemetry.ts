/**
 * Telemetry system for tracking mock fallbacks and data source usage
 * Logs events to scout_ops.ui_events for monitoring
 */

import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

interface UIEvent {
  type: 'mock_fallback_hit' | 'data_source_error' | 'badge_check';
  tag: string;
  route?: string;
  widget?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

let supabaseClient: any = null;

function getSupabaseClient() {
  if (!supabaseClient && ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY) {
    supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/**
 * Log UI event to telemetry (non-blocking)
 */
export async function logUIEvent(event: UIEvent): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn('Telemetry: Supabase client not available');
      return;
    }

    const payload = {
      event_type: event.type,
      tag: event.tag,
      route: event.route || window.location.pathname,
      widget: event.widget,
      reason: event.reason,
      metadata: event.metadata,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      environment: ENV.PROD ? 'production' : 'development'
    };

    // Insert into scout_ops.ui_events table
    const { error } = await supabase
      .from('scout_ops.ui_events')
      .insert(payload);

    if (error) {
      console.warn('Telemetry error:', error);
    }
  } catch (error) {
    console.warn('Telemetry failed:', error);
    // Never throw - telemetry should be non-blocking
  }
}

/**
 * Log mock fallback usage (critical in production)
 */
export function logMockFallback(tag: string, widget?: string, reason?: string): void {
  logUIEvent({
    type: 'mock_fallback_hit',
    tag,
    widget,
    reason,
    metadata: {
      critical: ENV.PROD, // Mark as critical if in production
      timestamp: Date.now()
    }
  });

  // Also log to console for immediate visibility
  const level = ENV.PROD ? 'error' : 'warn';
  console[level](`Mock fallback hit: ${tag}${widget ? ` (widget: ${widget})` : ''}${reason ? ` - ${reason}` : ''}`);
}

/**
 * Log data source badge check
 */
export function logBadgeCheck(status: string, source: string): void {
  logUIEvent({
    type: 'badge_check',
    tag: 'data_source_badge',
    metadata: {
      status,
      source,
      expected: 'Trusted'
    }
  });
}

/**
 * Log data source errors
 */
export function logDataSourceError(tag: string, error: any, widget?: string): void {
  logUIEvent({
    type: 'data_source_error',
    tag,
    widget,
    reason: error?.message || 'Unknown error',
    metadata: {
      error: error?.toString(),
      stack: error?.stack
    }
  });
}