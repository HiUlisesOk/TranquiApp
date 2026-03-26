import type { Category, MonthlyBudget } from "@/lib/data/types";
import {
  calculateBudgetReal,
  calculateTopExpenseCategories,
  sumByType,
  type MovementLike,
  type TopCategory,
} from "@/features/budget/domain";

export type SemanticTone = "success" | "danger" | "warning" | "info";

export interface MetricIndicator {
  label: string;
  value: number;
  formatted: string;
  tone: SemanticTone;
  detail: string;
}

export interface DashboardMetrics {
  budget: ReturnType<typeof calculateBudgetReal>;
  availableToSpend: MetricIndicator;
  netSavings: MetricIndicator;
  savingsRate: MetricIndicator;
  consumedPercent: MetricIndicator;
  monthlyComparison: MetricIndicator;
  topCategories: TopCategory[];
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function compareTone(value: number): SemanticTone {
  if (value > 0) return "success";
  if (value < 0) return "danger";
  return "info";
}

export function buildDashboardMetrics({
  budget,
  movements,
  categories,
  previousMonthExpense = 0,
}: {
  budget: MonthlyBudget;
  movements: MovementLike[];
  categories: Category[];
  previousMonthExpense?: number;
}): DashboardMetrics {
  const budgetResult = calculateBudgetReal(budget, movements);
  const amounts = sumByType(movements);

  const availableToSpendValue = amounts.operationalIncome - amounts.operationalExpense - amounts.savingDeposits + amounts.savingWithdrawals;
  const netSavingsValue = amounts.savingDeposits - amounts.savingWithdrawals;
  const savingsRateValue = amounts.operationalIncome > 0 ? (netSavingsValue / amounts.operationalIncome) * 100 : 0;
  const monthlyComparisonValue = previousMonthExpense > 0
    ? ((budgetResult.realTotal - previousMonthExpense) / previousMonthExpense) * 100
    : 0;

  const availableToSpend: MetricIndicator = {
    label: "Disponible para gastar",
    value: availableToSpendValue,
    formatted: formatCurrency(availableToSpendValue, budget.currency),
    tone: compareTone(availableToSpendValue),
    detail: "ingresos operativos - gastos operativos - aportes a ahorro + retiros",
  };

  const netSavings: MetricIndicator = {
    label: "Ahorro neto",
    value: netSavingsValue,
    formatted: formatCurrency(netSavingsValue, budget.currency),
    tone: compareTone(netSavingsValue),
    detail: "aportes a ahorro - retiros de ahorro",
  };

  const savingsRate: MetricIndicator = {
    label: "Tasa de ahorro",
    value: savingsRateValue,
    formatted: formatPercent(savingsRateValue),
    tone: savingsRateValue >= 20 ? "success" : savingsRateValue >= 10 ? "warning" : "danger",
    detail: "ahorro neto / ingresos operativos",
  };

  const consumedPercent: MetricIndicator = {
    label: "Porcentaje consumido",
    value: budgetResult.consumedPctTotal,
    formatted: formatPercent(budgetResult.consumedPctTotal),
    tone: budgetResult.consumedPctTotal <= 70 ? "success" : budgetResult.consumedPctTotal <= 100 ? "warning" : "danger",
    detail: "gasto real / presupuesto planificado",
  };

  const monthlyComparison: MetricIndicator = {
    label: "Comparativa mensual",
    value: monthlyComparisonValue,
    formatted: formatPercent(monthlyComparisonValue),
    tone: monthlyComparisonValue <= 0 ? "success" : monthlyComparisonValue <= 5 ? "warning" : "danger",
    detail: "variación de gasto real vs mes anterior",
  };

  const topCategories = calculateTopExpenseCategories(movements, categories, 5);

  return {
    budget: budgetResult,
    availableToSpend,
    netSavings,
    savingsRate,
    consumedPercent,
    monthlyComparison,
    topCategories,
  };
}

export const toneClassName: Record<SemanticTone, string> = {
  success: "bg-green-100 text-green-800 border-green-200",
  danger: "bg-red-100 text-red-800 border-red-200",
  warning: "bg-amber-100 text-amber-800 border-amber-200",
  info: "bg-violet-100 text-violet-800 border-violet-200",
};
