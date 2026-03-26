import { getSupabaseServerClient } from '../supabase/server';
import { demoProfiles } from './demo';
import { withDemoFallback } from './base';
import type { Profile } from './types';

export async function getProfile(profileId: string): Promise<Profile | null> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, currency, locale, created_at')
        .eq('id', profileId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        fullName: data.full_name,
        email: data.email,
        currency: data.currency,
        locale: data.locale,
        createdAt: data.created_at,
      } satisfies Profile;
    },
    () => demoProfiles.find((p) => p.id === profileId) ?? null,
  );
}
