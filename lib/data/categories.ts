import { getSupabaseServerClient } from '../supabase/server';
import { withDemoFallback } from './base';
import { demoCategories } from './demo';
import type { Category } from './types';

export async function listCategories(profileId: string): Promise<Category[]> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('categories')
        .select('id, profile_id, name, kind, icon, created_at')
        .eq('profile_id', profileId)
        .order('name', { ascending: true });

      if (error) throw error;

      return (data ?? []).map(
        (row) =>
          ({
            id: row.id,
            profileId: row.profile_id,
            name: row.name,
            kind: row.kind,
            icon: row.icon ?? undefined,
            createdAt: row.created_at,
          }) satisfies Category,
      );
    },
    () => demoCategories.filter((c) => c.profileId === profileId),
  );
}
