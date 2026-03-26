import { getSupabaseServerClient } from '../supabase/server';

export type DataMode = 'remote' | 'demo';

export function getDataMode(): DataMode {
  return getSupabaseServerClient() ? 'remote' : 'demo';
}

export async function withDemoFallback<T>(
  remote: () => Promise<T>,
  demo: () => Promise<T> | T,
): Promise<T> {
  const mode = getDataMode();
  if (mode === 'demo') return await demo();

  try {
    return await remote();
  } catch {
    return await demo();
  }
}
