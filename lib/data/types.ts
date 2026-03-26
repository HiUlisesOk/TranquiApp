export type UUID = string;

export interface Profile {
  id: UUID;
  fullName: string;
  email: string;
  currency: string;
  locale: string;
  createdAt: string;
}

export interface Account {
  id: UUID;
  profileId: UUID;
  name: string;
  type: 'checking' | 'savings' | 'cash' | 'credit';
  balance: number;
  color?: string;
  createdAt: string;
}

export interface Category {
  id: UUID;
  profileId: UUID;
  name: string;
  kind: 'income' | 'expense' | 'transfer';
  icon?: string;
  createdAt: string;
}

export interface BudgetItem {
  id: UUID;
  budgetId: UUID;
  categoryId: UUID;
  planned: number;
  spent: number;
}

export interface MonthlyBudget {
  id: UUID;
  profileId: UUID;
  month: string; // YYYY-MM
  currency: string;
  totalPlanned: number;
  totalSpent: number;
  items: BudgetItem[];
}

export interface Movement {
  id: UUID;
  profileId: UUID;
  accountId: UUID;
  categoryId: UUID;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  note?: string;
  happenedAt: string;
  createdAt: string;
}

export interface RecurringTransaction {
  id: UUID;
  profileId: UUID;
  accountId: UUID;
  categoryId: UUID;
  type: 'income' | 'expense';
  amount: number;
  cadence: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string | null;
  enabled: boolean;
}

export interface CsvImport {
  id: UUID;
  profileId: UUID;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  rowsTotal: number;
  rowsImported: number;
  errorMessage?: string | null;
  createdAt: string;
}
