import type {
  Account,
  Category,
  CsvImport,
  MonthlyBudget,
  Movement,
  Profile,
  RecurringTransaction,
} from './types';

const now = new Date().toISOString();

export const demoProfiles: Profile[] = [
  {
    id: 'demo-user',
    fullName: 'Demo User',
    email: 'demo@tranqui.app',
    currency: 'USD',
    locale: 'es-US',
    createdAt: now,
  },
];

export const demoAccounts: Account[] = [
  {
    id: 'acc-1',
    profileId: 'demo-user',
    name: 'Cuenta Principal',
    type: 'checking',
    balance: 2450.35,
    color: '#22c55e',
    createdAt: now,
  },
  {
    id: 'acc-2',
    profileId: 'demo-user',
    name: 'Ahorros',
    type: 'savings',
    balance: 8800,
    color: '#3b82f6',
    createdAt: now,
  },
];

export const demoCategories: Category[] = [
  { id: 'cat-1', profileId: 'demo-user', name: 'Salario', kind: 'income', icon: 'wallet', createdAt: now },
  { id: 'cat-2', profileId: 'demo-user', name: 'Supermercado', kind: 'expense', icon: 'shopping-cart', createdAt: now },
  { id: 'cat-3', profileId: 'demo-user', name: 'Transporte', kind: 'expense', icon: 'bus', createdAt: now },
];

export const demoBudgets: MonthlyBudget[] = [
  {
    id: 'budget-2026-03',
    profileId: 'demo-user',
    month: '2026-03',
    currency: 'USD',
    totalPlanned: 1200,
    totalSpent: 640,
    items: [
      { id: 'bi-1', budgetId: 'budget-2026-03', categoryId: 'cat-2', planned: 500, spent: 320 },
      { id: 'bi-2', budgetId: 'budget-2026-03', categoryId: 'cat-3', planned: 200, spent: 110 },
    ],
  },
];

export const demoMovements: Movement[] = [
  {
    id: 'mov-1',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-1',
    type: 'income',
    amount: 3200,
    note: 'Nómina',
    happenedAt: now,
    createdAt: now,
  },
  {
    id: 'mov-2',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-2',
    type: 'expense',
    amount: 86.5,
    note: 'Compra semanal',
    happenedAt: now,
    createdAt: now,
  },
];

export const demoRecurring: RecurringTransaction[] = [
  {
    id: 'rec-1',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-2',
    type: 'expense',
    amount: 45,
    cadence: 'weekly',
    startDate: '2026-01-01',
    endDate: null,
    enabled: true,
  },
];

export const demoCsvImports: CsvImport[] = [
  {
    id: 'csv-1',
    profileId: 'demo-user',
    fileName: 'movimientos-marzo.csv',
    status: 'completed',
    rowsTotal: 120,
    rowsImported: 120,
    errorMessage: null,
    createdAt: now,
  },
];
