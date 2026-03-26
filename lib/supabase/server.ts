import { cookies } from 'next/headers';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Server-side Supabase client.
 * Returns `null` when env vars are missing so data-layer can fallback to demo mode.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const { url, anonKey } = getEnv();
  if (!url || !anonKey) return null;

  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;

  return createClient(url, anonKey, {
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
