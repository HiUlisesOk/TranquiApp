import type { BudgetItem, Category, MonthlyBudget, Movement } from "@/lib/data/types";

export type MovementType = Movement["type"] | "saving_deposit" | "saving_withdrawal";
export type MovementLike = Omit<Movement, "type"> & { type: MovementType };

export interface BudgetItemComputed extends BudgetItem {
  real: number;
  difference: number;
  consumedPct: number;
  hasInsufficientCoverage: boolean;
}

export interface BudgetComputation {
  items: BudgetItemComputed[];
  realTotal: number;
  plannedTotal: number;
  differenceTotal: number;
  consumedPctTotal: number;
  unplannedExpenses: MovementLike[];
  insufficientCoverageItems: BudgetItemComputed[];
}

const toRounded = (value: number) => Math.round(value * 100) / 100;

const isOperationalExpense = (movement: MovementLike) => movement.type === "expense";
const isOperationalIncome = (movement: MovementLike) => movement.type === "income";
const isSavingDeposit = (movement: MovementLike) => movement.type === "saving_deposit";
const isSavingWithdrawal = (movement: MovementLike) => movement.type === "saving_withdrawal";
const isInternalTransfer = (movement: MovementLike) => movement.type === "transfer";

export function sumByType(movements: MovementLike[]) {
  const operationalIncome = movements.filter(isOperationalIncome).reduce((acc, movement) => acc + movement.amount, 0);
  const operationalExpense = movements.filter(isOperationalExpense).reduce((acc, movement) => acc + movement.amount, 0);
  const savingDeposits = movements.filter(isSavingDeposit).reduce((acc, movement) => acc + movement.amount, 0);
  const savingWithdrawals = movements.filter(isSavingWithdrawal).reduce((acc, movement) => acc + movement.amount, 0);

  return {
    operationalIncome: toRounded(operationalIncome),
    operationalExpense: toRounded(operationalExpense),
    savingDeposits: toRounded(savingDeposits),
    savingWithdrawals: toRounded(savingWithdrawals),
  };
}

export function calculateBudgetReal(budget: MonthlyBudget, movements: MovementLike[]): BudgetComputation {
  const movementsByCategory = new Map<string, number>();

  for (const movement of movements) {
    if (isInternalTransfer(movement) || !isOperationalExpense(movement)) {
      continue;
    }

    const previous = movementsByCategory.get(movement.categoryId) ?? 0;
    movementsByCategory.set(movement.categoryId, previous + movement.amount);
  }

  const computedItems = budget.items.map((item) => {
    const real = toRounded(movementsByCategory.get(item.categoryId) ?? 0);
    const difference = toRounded(item.planned - real);
    const consumedPct = item.planned <= 0 ? (real > 0 ? 100 : 0) : toRounded((real / item.planned) * 100);

    return {
      ...item,
      real,
      difference,
      consumedPct,
      hasInsufficientCoverage: difference < 0,
    } satisfies BudgetItemComputed;
  });

  const unplannedExpenses = movements.filter((movement) => {
    if (!isOperationalExpense(movement) || isInternalTransfer(movement)) {
      return false;
    }

    const item = budget.items.find((budgetItem) => budgetItem.categoryId === movement.categoryId);
    return !item || item.planned === 0;
  });

  const plannedTotal = toRounded(computedItems.reduce((acc, item) => acc + item.planned, 0));
  const realTotal = toRounded(computedItems.reduce((acc, item) => acc + item.real, 0));
  const differenceTotal = toRounded(plannedTotal - realTotal);
  const consumedPctTotal = plannedTotal <= 0 ? 0 : toRounded((realTotal / plannedTotal) * 100);
  const insufficientCoverageItems = computedItems.filter((item) => item.hasInsufficientCoverage);

  return {
    items: computedItems,
    plannedTotal,
    realTotal,
    differenceTotal,
    consumedPctTotal,
    unplannedExpenses,
    insufficientCoverageItems,
  };
}

export interface TopCategory {
  categoryId: string;
  categoryName: string;
  amount: number;
}

export function calculateTopExpenseCategories(movements: MovementLike[], categories: Category[], limit = 5): TopCategory[] {
  const spendingByCategory = new Map<string, number>();

  for (const movement of movements) {
    if (!isOperationalExpense(movement) || isInternalTransfer(movement)) {
      continue;
    }

    spendingByCategory.set(movement.categoryId, (spendingByCategory.get(movement.categoryId) ?? 0) + movement.amount);
  }

  return [...spendingByCategory.entries()]
    .map(([categoryId, amount]) => {
      const category = categories.find((item) => item.id === categoryId);
      return {
        categoryId,
        categoryName: category?.name ?? "Sin categoría",
        amount: toRounded(amount),
      } satisfies TopCategory;
    })
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
