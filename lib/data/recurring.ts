import { getSupabaseServerClient } from '../supabase/server';
import { withDemoFallback } from './base';
import { demoRecurring } from './demo';
import type { RecurringTransaction } from './types';

export async function listRecurringTransactions(profileId: string): Promise<RecurringTransaction[]> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return [];

      const { data, error } = await supabase
        .from('recurring_transactions')
        .select('id, profile_id, account_id, category_id, type, amount, cadence, start_date, end_date, enabled')
        .eq('profile_id', profileId)
        .order('start_date', { ascending: false });

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
            cadence: row.cadence,
            startDate: row.start_date,
            endDate: row.end_date,
            enabled: Boolean(row.enabled),
          }) satisfies RecurringTransaction,
      );
    },
    () => demoRecurring.filter((r) => r.profileId === profileId),
  );
}
