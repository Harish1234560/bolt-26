import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url?.trim() && key?.trim());

let client: SupabaseClient | null = null;

/** Shared client; null when env is not set (local-only mode). */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured || !url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}
