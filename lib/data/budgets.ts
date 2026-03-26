import { getSupabaseServerClient } from '../supabase/server';
import { withDemoFallback } from './base';
import { demoBudgets } from './demo';
import type { BudgetItem, MonthlyBudget } from './types';

export async function getMonthlyBudget(profileId: string, month: string): Promise<MonthlyBudget | null> {
  return withDemoFallback(
    async () => {
      const supabase = getSupabaseServerClient();
      if (!supabase) return null;

      const { data: budget, error: budgetError } = await supabase
        .from('monthly_budgets')
        .select('id, profile_id, month, currency, total_planned, total_spent')
        .eq('profile_id', profileId)
        .eq('month', month)
        .maybeSingle();

      if (budgetError) throw budgetError;
      if (!budget) return null;

      const { data: items, error: itemsError } = await supabase
        .from('budget_items')
        .select('id, budget_id, category_id, planned, spent')
        .eq('budget_id', budget.id);

      if (itemsError) throw itemsError;

      const mappedItems: BudgetItem[] = (items ?? []).map((item) => ({
        id: item.id,
        budgetId: item.budget_id,
        categoryId: item.category_id,
        planned: Number(item.planned),
        spent: Number(item.spent),
      }));

      return {
        id: budget.id,
        profileId: budget.profile_id,
        month: budget.month,
        currency: budget.currency,
        totalPlanned: Number(budget.total_planned),
        totalSpent: Number(budget.total_spent),
        items: mappedItems,
      } satisfies MonthlyBudget;
    },
    () => demoBudgets.find((b) => b.profileId === profileId && b.month === month) ?? null,
  );
}
