import { getSupabaseServerClient } from '../supabase/server';
import { withDemoFallback } from './base';
import { demoMovements } from './demo';
import type { Movement } from './types';

export async function listMovements(profileId: string, limit = 100): Promise<Movement[]> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('movements')
        .select('id, profile_id, account_id, category_id, type, amount, note, happened_at, created_at')
        .eq('profile_id', profileId)
        .order('happened_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data ?? []).map(
        (row) =>
          ({
            id: row.id,
            profileId: row.profile_id,
            accountId: row.account_id,
            categoryId: row.category_id,
            type: row.type,
            amount: Number(row.amount),
            note: row.note ?? undefined,
            happenedAt: row.happened_at,
            createdAt: row.created_at,
          }) satisfies Movement,
      );
    },
    () => demoMovements.filter((m) => m.profileId === profileId).slice(0, limit),
  );
}
