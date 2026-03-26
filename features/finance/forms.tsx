"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { demoAccounts, demoBudgets, demoCategories, demoMovements, demoRecurring } from "@/lib/data/demo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSelector } from "@/components/finance/AccountSelector";
import { CategorySelector } from "@/components/finance/CategorySelector";
import { MoneyInput } from "@/components/finance/MoneyInput";
import { TransactionTable } from "@/components/finance/TransactionTable";
import { BudgetSection } from "@/components/finance/BudgetSection";
import { KPIGrid } from "@/components/finance/KPIGrid";
import { CategoryChart } from "@/components/finance/CategoryChart";
import { SpendingTrendChart } from "@/components/finance/SpendingTrendChart";
import { AccountBalanceCard } from "@/components/finance/AccountBalanceCard";
import { AlertList } from "@/components/finance/AlertList";
import { RecentTransactionsCard } from "@/components/finance/RecentTransactionsCard";
import { EmptyState } from "@/components/finance/EmptyState";
import { CsvImportDialog } from "@/components/finance/CsvImportDialog";
import { autoCategorize, defaultColumnMapping, detectDuplicates, parseCsv, validateRow, type CsvRow } from "@/features/finance/csv";
import type { Movement } from "@/lib/data/types";

const accountSchema = z.object({ name: z.string().min(2), type: z.enum(["checking", "savings", "cash", "credit"]), balance: z.coerce.number() });
const categorySchema = z.object({ name: z.string().min(2), kind: z.enum(["income", "expense", "transfer"]) });
const budgetItemSchema = z.object({ categoryId: z.string().min(1), planned: z.coerce.number().positive() });
const movementSchema = z.object({ accountId: z.string().min(1), categoryId: z.string().min(1), amount: z.coerce.number(), note: z.string().min(1) });
const recurringSchema = z.object({ accountId: z.string().min(1), categoryId: z.string().min(1), amount: z.coerce.number().positive(), cadence: z.enum(["daily", "weekly", "monthly", "yearly"]) });
const settingsSchema = z.object({ currency: z.string().min(3), locale: z.string().min(2), duplicateToleranceDays: z.coerce.number().int().min(0).max(30) });

export function FinanceWorkspace() {
  const [accounts, setAccounts] = useState(demoAccounts);
  const [categories, setCategories] = useState(demoCategories);
  const [budgetItems, setBudgetItems] = useState(demoBudgets[0]?.items ?? []);
  const [movements, setMovements] = useState(demoMovements);
  const [recurring, setRecurring] = useState(demoRecurring);
  const [month, setMonth] = useState(demoBudgets[0]?.month ?? "2026-03");
  const [csvOpen, setCsvOpen] = useState(false);

  const accountForm = useForm<z.infer<typeof accountSchema>>({ resolver: zodResolver(accountSchema), defaultValues: { name: "", type: "checking", balance: 0 } });
  const categoryForm = useForm<z.infer<typeof categorySchema>>({ resolver: zodResolver(categorySchema), defaultValues: { name: "", kind: "expense" } });
  const budgetItemForm = useForm<z.infer<typeof budgetItemSchema>>({ resolver: zodResolver(budgetItemSchema), defaultValues: { categoryId: "", planned: 0 } });
  const movementForm = useForm<z.infer<typeof movementSchema>>({ resolver: zodResolver(movementSchema), defaultValues: { accountId: "", categoryId: "", amount: 0, note: "" } });
  const recurringForm = useForm<z.infer<typeof recurringSchema>>({ resolver: zodResolver(recurringSchema), defaultValues: { accountId: "", categoryId: "", amount: 0, cadence: "monthly" } });
  const settingsForm = useForm<z.infer<typeof settingsSchema>>({ resolver: zodResolver(settingsSchema), defaultValues: { currency: "USD", locale: "es-AR", duplicateToleranceDays: 0 } });

  const accountOptions = accounts.map((account) => ({ value: account.id, label: account.name }));
  const categoryOptions = categories.map((category) => ({ value: category.id, label: category.name }));

  const categoryNameById = useMemo(() => new Map(categories.map((category) => [category.id, category.name])), [categories]);

  return (
    <div className="space-y-6">
      <KPIGrid
        items={[
          { title: "Ingresos", value: "USD 3,200", hint: "Demo mensual", tone: "success" },
          { title: "Gastos", value: "USD 1,131", hint: "Incluye importaciones", tone: "warning" },
          { title: "Ahorro neto", value: "USD 2,069", hint: "65% del ingreso", tone: "success" },
          { title: "Riesgo de presupuesto", value: "Bajo", hint: "Sin sobre-ejecución", tone: "info" }
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {accounts.map((account) => (
          <AccountBalanceCard key={account.id} name={account.name} balance={account.balance} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Distribución por categoría</CardTitle></CardHeader>
          <CardContent>
            <CategoryChart data={categories.slice(0, 4).map((c, i) => ({ category: c.name, amount: (i + 1) * 120 }))} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tendencia de gasto</CardTitle></CardHeader>
          <CardContent>
            <SpendingTrendChart points={[{ label: "Sem 1", value: 120 }, { label: "Sem 2", value: 230 }, { label: "Sem 3", value: 190 }, { label: "Sem 4", value: 260 }]} />
          </CardContent>
        </Card>
      </div>

      <BudgetSection
        month={month}
        onMonthChange={setMonth}
        rows={budgetItems.map((item) => ({ id: item.id, category: categoryNameById.get(item.categoryId) ?? "Sin categoría", planned: item.planned, spent: item.spent }))}
      />

      <AlertList
        alerts={[
          { id: "1", message: "2 movimientos duplicados detectados para revisión", status: "warning" },
          { id: "2", message: "Regla de autocategorización aplicada a 3 filas", status: "info" }
        ]}
      />

      <RecentTransactionsCard rows={movements.slice(0, 8).map((m) => ({ id: m.id, date: m.happenedAt.slice(0, 10), description: m.note ?? "-", category: categoryNameById.get(m.categoryId) ?? "-", account: accountOptions.find((a) => a.value === m.accountId)?.label ?? "-", amount: m.type === "income" ? m.amount : -m.amount }))} />

      <Tabs defaultValue="cuentas" className="w-full">
        <TabsList className="w-full justify-start overflow-auto">
          <TabsTrigger value="cuentas">Cuentas</TabsTrigger><TabsTrigger value="categorias">Categorías</TabsTrigger><TabsTrigger value="presupuesto">Ítems presupuestarios</TabsTrigger><TabsTrigger value="movimientos">Movimientos</TabsTrigger><TabsTrigger value="recurrentes">Recurrentes</TabsTrigger><TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="cuentas">
          <Card><CardHeader><CardTitle>CRUD cuentas</CardTitle></CardHeader><CardContent className="space-y-4">
            <Form {...accountForm}><form onSubmit={accountForm.handleSubmit((values) => { setAccounts((prev) => [{ ...values, id: crypto.randomUUID(), profileId: "demo-user", createdAt: new Date().toISOString() }, ...prev]); accountForm.reset(); })} className="grid gap-4 md:grid-cols-4">
              <FormField control={accountForm.control} name="name" render={({ field }) => <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={accountForm.control} name="type" render={({ field }) => <FormItem><FormLabel>Tipo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={accountForm.control} name="balance" render={({ field }) => <FormItem><FormLabel>Saldo</FormLabel><FormControl><MoneyInput value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="self-end">Crear</Button>
            </form></Form>
            <div className="space-y-2">{accounts.map((a) => <div key={a.id} className="flex items-center justify-between rounded border p-2 text-sm"><span>{a.name} · {a.type}</span><Button variant="destructive" size="sm" onClick={() => setAccounts((prev) => prev.filter((item) => item.id !== a.id))}>Eliminar</Button></div>)}</div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="categorias">
          <Card><CardHeader><CardTitle>CRUD categorías</CardTitle></CardHeader><CardContent className="space-y-4">
            <Form {...categoryForm}><form onSubmit={categoryForm.handleSubmit((values) => { setCategories((prev) => [{ ...values, id: crypto.randomUUID(), profileId: "demo-user", createdAt: new Date().toISOString() }, ...prev]); categoryForm.reset(); })} className="grid gap-4 md:grid-cols-3">
              <FormField control={categoryForm.control} name="name" render={({ field }) => <FormItem><FormLabel>Nombre</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={categoryForm.control} name="kind" render={({ field }) => <FormItem><FormLabel>Tipo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="self-end">Crear</Button>
            </form></Form>
            <div className="space-y-2">{categories.map((c) => <div key={c.id} className="flex items-center justify-between rounded border p-2 text-sm"><span>{c.name}</span><Button variant="destructive" size="sm" onClick={() => setCategories((prev) => prev.filter((item) => item.id !== c.id))}>Eliminar</Button></div>)}</div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="presupuesto">
          <Card><CardHeader><CardTitle>CRUD ítems presupuestarios</CardTitle></CardHeader><CardContent className="space-y-4">
            <Form {...budgetItemForm}><form onSubmit={budgetItemForm.handleSubmit((values) => { setBudgetItems((prev) => [{ ...values, id: crypto.randomUUID(), budgetId: demoBudgets[0].id, spent: 0 }, ...prev]); budgetItemForm.reset(); })} className="grid gap-4 md:grid-cols-3">
              <FormField control={budgetItemForm.control} name="categoryId" render={({ field }) => <FormItem><FormLabel>Categoría</FormLabel><FormControl><CategorySelector value={field.value} onValueChange={field.onChange} options={categoryOptions} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={budgetItemForm.control} name="planned" render={({ field }) => <FormItem><FormLabel>Planificado</FormLabel><FormControl><MoneyInput value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="self-end">Crear</Button>
            </form></Form>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="movimientos">
          <Card><CardHeader><CardTitle>CRUD movimientos + CSV</CardTitle></CardHeader><CardContent className="space-y-4">
            <Form {...movementForm}><form onSubmit={movementForm.handleSubmit((values) => { setMovements((prev) => [{ ...values, id: crypto.randomUUID(), profileId: "demo-user", type: values.amount > 0 ? "income" : "expense", happenedAt: new Date().toISOString(), createdAt: new Date().toISOString() }, ...prev]); movementForm.reset(); })} className="grid gap-4 md:grid-cols-5">
              <FormField control={movementForm.control} name="accountId" render={({ field }) => <FormItem><FormLabel>Cuenta</FormLabel><FormControl><AccountSelector value={field.value} onValueChange={field.onChange} options={accountOptions} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={movementForm.control} name="categoryId" render={({ field }) => <FormItem><FormLabel>Categoría</FormLabel><FormControl><CategorySelector value={field.value} onValueChange={field.onChange} options={categoryOptions} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={movementForm.control} name="amount" render={({ field }) => <FormItem><FormLabel>Monto</FormLabel><FormControl><MoneyInput value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={movementForm.control} name="note" render={({ field }) => <FormItem><FormLabel>Descripción</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="self-end">Crear</Button>
            </form></Form>
            <Button variant="outline" onClick={() => setCsvOpen(true)}>Importar CSV</Button>
            <CsvFlow open={csvOpen} onOpenChange={setCsvOpen} accounts={accountOptions} onImported={(rows) => {
              const mapped: Movement[] = rows.map((row, idx) => ({
                id: `csv-${idx}-${crypto.randomUUID()}`,
                profileId: "demo-user",
                accountId: accounts[0]?.id ?? "acc-1",
                categoryId: categories[0]?.id ?? "cat-2",
                type: Number(row.monto) >= 0 ? "income" : "expense",
                amount: Math.abs(Number(row.monto) || 0),
                note: row.descripcion,
                happenedAt: row.fecha,
                createdAt: new Date().toISOString()
              }));
              setMovements((prev) => [...mapped, ...prev]);
            }} />
            <TransactionTable rows={movements.slice(0, 6).map((m) => ({ id: m.id, date: m.happenedAt.slice(0, 10), description: m.note ?? "-", category: categoryNameById.get(m.categoryId) ?? "-", account: accountOptions.find((a) => a.value === m.accountId)?.label ?? "-", amount: m.type === "income" ? m.amount : -m.amount }))} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="recurrentes">
          <Card><CardHeader><CardTitle>CRUD recurrentes</CardTitle></CardHeader><CardContent className="space-y-4">
            <Form {...recurringForm}><form onSubmit={recurringForm.handleSubmit((values) => { setRecurring((prev) => [{ ...values, id: crypto.randomUUID(), profileId: "demo-user", startDate: new Date().toISOString().slice(0, 10), endDate: null, enabled: true, type: "expense" }, ...prev]); recurringForm.reset(); })} className="grid gap-4 md:grid-cols-5">
              <FormField control={recurringForm.control} name="accountId" render={({ field }) => <FormItem><FormLabel>Cuenta</FormLabel><FormControl><AccountSelector value={field.value} onValueChange={field.onChange} options={accountOptions} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={recurringForm.control} name="categoryId" render={({ field }) => <FormItem><FormLabel>Categoría</FormLabel><FormControl><CategorySelector value={field.value} onValueChange={field.onChange} options={categoryOptions} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={recurringForm.control} name="amount" render={({ field }) => <FormItem><FormLabel>Monto</FormLabel><FormControl><MoneyInput value={field.value} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={recurringForm.control} name="cadence" render={({ field }) => <FormItem><FormLabel>Frecuencia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="self-end">Crear</Button>
            </form></Form>
            <div className="space-y-2">{recurring.map((r) => <div key={r.id} className="rounded border p-2 text-sm">{r.cadence} · {r.amount}</div>)}</div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="configuracion">
          <Card><CardHeader><CardTitle>CRUD configuración</CardTitle></CardHeader><CardContent className="space-y-4">
            <Form {...settingsForm}><form onSubmit={settingsForm.handleSubmit(() => {})} className="grid gap-4 md:grid-cols-4">
              <FormField control={settingsForm.control} name="currency" render={({ field }) => <FormItem><FormLabel>Moneda</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={settingsForm.control} name="locale" render={({ field }) => <FormItem><FormLabel>Locale</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
              <FormField control={settingsForm.control} name="duplicateToleranceDays" render={({ field }) => <FormItem><FormLabel>Tolerancia duplicados (días)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
              <Button type="submit" className="self-end">Guardar</Button>
            </form></Form>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {movements.length === 0 ? <EmptyState title="Sin movimientos" description="Creá tu primer movimiento o importá un CSV." /> : null}
    </div>
  );
}

function CsvFlow({ open, onOpenChange, accounts, onImported }: { open: boolean; onOpenChange: (open: boolean) => void; accounts: { value: string; label: string }[]; onImported: (rows: CsvRow[]) => void }) {
  const [step, setStep] = useState(1);
  const [rawContent, setRawContent] = useState("fecha,monto,descripcion,cuenta\n2026-03-01,-12.4,UBER TRIP,Cuenta Principal\n2026-03-01,-12.4,UBER TRIP,Cuenta Principal\n2026-03-02,-9.9,GOOGLE CHAT GPT,Cuenta Principal\n2026-03-04,-80.0,SUPERMERCADO CENTRAL,Cuenta Principal");
  const [mapping, setMapping] = useState<Record<string, string>>(defaultColumnMapping);
  const rows = useMemo(() => parseCsv(rawContent), [rawContent]);
  const withDup = useMemo(() => detectDuplicates(rows, mapping), [rows, mapping]);
  const validRows = withDup.filter((item) => validateRow(item.row, mapping).length === 0 && !item.duplicated);

  const summary = {
    total: withDup.length,
    duplicates: withDup.filter((item) => item.duplicated).length,
    invalid: withDup.filter((item) => validateRow(item.row, mapping).length > 0).length,
    imported: validRows.length
  };

  return (
    <CsvImportDialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {["1.Archivo", "2.Mapeo", "3.Preview", "4.Validaciones", "5.Duplicados", "6.Importación", "7.Resumen"].map((label, index) => (
            <span key={label} className={`rounded px-2 py-1 ${step === index + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{label}</span>
          ))}
        </div>

        {step === 1 ? <textarea className="min-h-40 w-full rounded border p-2 text-xs" value={rawContent} onChange={(e) => setRawContent(e.target.value)} /> : null}
        {step === 2 ? <div className="grid gap-2 md:grid-cols-2">{Object.keys(mapping).map((key) => <label key={key} className="text-sm">{key}<Input value={mapping[key]} onChange={(e) => setMapping((prev) => ({ ...prev, [key]: e.target.value }))} /></label>)}</div> : null}
        {step === 3 ? <TransactionTable rows={withDup.slice(0, 5).map((item, idx) => ({ id: String(idx), date: item.row[mapping.date], description: item.row[mapping.description], category: autoCategorize(item.row[mapping.description] ?? ""), account: item.row[mapping.account] || accounts[0]?.label || "", amount: Number(item.row[mapping.amount] || 0) }))} /> : null}
        {step === 4 ? <div className="space-y-1 text-sm">{withDup.map((item, idx) => { const errs = validateRow(item.row, mapping); return <p key={idx}>Fila {idx + 1}: {errs.length ? errs.join(", ") : "OK"}</p>; })}</div> : null}
        {step === 5 ? <div className="space-y-1 text-sm">{withDup.map((item, idx) => <p key={idx}>Fila {idx + 1}: {item.duplicated ? "Duplicado" : "Único"}</p>)}</div> : null}
        {step === 6 ? <div className="rounded border p-3 text-sm">Listo para importar {validRows.length} filas válidas.</div> : null}
        {step === 7 ? <div className="rounded border p-3 text-sm">Resumen final: total {summary.total}, válidas {summary.imported}, duplicadas {summary.duplicates}, inválidas {summary.invalid}.</div> : null}

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))}>Anterior</Button>
          <div className="flex gap-2">
            {step < 7 ? <Button onClick={() => setStep((s) => Math.min(7, s + 1))}>Siguiente</Button> : null}
            {step === 7 ? <Button onClick={() => { onImported(validRows.map((item) => item.row)); onOpenChange(false); setStep(1); }}>Importar</Button> : null}
          </div>
        </div>
      </div>
    </CsvImportDialog>
  );
}
