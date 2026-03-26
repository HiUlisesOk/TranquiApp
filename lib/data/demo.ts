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
  { id: 'cat-4', profileId: 'demo-user', name: 'Servicios', kind: 'expense', icon: 'receipt', createdAt: now },
  { id: 'cat-5', profileId: 'demo-user', name: 'Ahorro', kind: 'transfer', icon: 'piggy-bank', createdAt: now },
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
      { id: 'bi-1', budgetId: 'budget-2026-03', categoryId: 'cat-2', planned: 500, spent: 0 },
      { id: 'bi-2', budgetId: 'budget-2026-03', categoryId: 'cat-3', planned: 200, spent: 0 },
      { id: 'bi-3', budgetId: 'budget-2026-03', categoryId: 'cat-4', planned: 0, spent: 0 },
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
    amount: 286.5,
    note: 'Compra semanal',
    happenedAt: now,
    createdAt: now,
  },
  {
    id: 'mov-3',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-3',
    type: 'expense',
    amount: 150,
    note: 'SUBE',
    happenedAt: now,
    createdAt: now,
  },
  {
    id: 'mov-4',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-4',
    type: 'expense',
    amount: 95,
    note: 'Internet',
    happenedAt: now,
    createdAt: now,
  },
  {
    id: 'mov-5',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-5',
    type: 'saving_deposit',
    amount: 600,
    note: 'Fondo de emergencia',
    happenedAt: now,
    createdAt: now,
  },
  {
    id: 'mov-6',
    profileId: 'demo-user',
    accountId: 'acc-2',
    categoryId: 'cat-5',
    type: 'saving_withdrawal',
    amount: 100,
    note: 'Retiro puntual',
    happenedAt: now,
    createdAt: now,
  },
  {
    id: 'mov-7',
    profileId: 'demo-user',
    accountId: 'acc-1',
    categoryId: 'cat-5',
    type: 'transfer',
    amount: 250,
    note: 'Transferencia interna',
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
