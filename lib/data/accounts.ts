import { getSupabaseServerClient } from '../supabase/server';
import { withDemoFallback } from './base';
import { demoAccounts } from './demo';
import type { Account } from './types';

export async function listAccounts(profileId: string): Promise<Account[]> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('accounts')
        .select('id, profile_id, name, type, balance, color, created_at')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map(
        (row) =>
          ({
            id: row.id,
            profileId: row.profile_id,
            name: row.name,
            type: row.type,
            balance: Number(row.balance),
            color: row.color ?? undefined,
            createdAt: row.created_at,
          }) satisfies Account,
      );
    },
    () => demoAccounts.filter((a) => a.profileId === profileId),
  );
}
