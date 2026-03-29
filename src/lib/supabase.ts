import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing environment variables — database fallback disabled.');
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Silently upsert a JSON payload into the api_cache table.
 * Fire-and-forget — errors are swallowed so they never block the UI.
 */
export async function syncToSupabase(endpoint: string, data: unknown): Promise<void> {
  if (!supabase) return;
  try {
    await supabase
      .from('api_cache')
      .upsert(
        { endpoint, data, updated_at: new Date().toISOString() },
        { onConflict: 'endpoint' }
      );
  } catch (err) {
    console.warn('[Supabase] Sync failed (non-blocking):', err);
  }
}

/**
 * Retrieve cached data from the Supabase api_cache table.
 * Returns null if not found or if Supabase is unavailable.
 */
export async function fetchFromSupabase<T>(endpoint: string): Promise<T | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('api_cache')
      .select('data')
      .eq('endpoint', endpoint)
      .single();

    if (error || !data) return null;
    return data.data as T;
  } catch {
    return null;
  }
}
