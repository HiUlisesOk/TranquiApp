import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthSelector } from "@/components/finance/MonthSelector";
import { BudgetTable, type BudgetRow } from "@/components/finance/BudgetTable";

export function BudgetSection({ month, onMonthChange, rows }: { month: string; onMonthChange: (value: string) => void; rows: BudgetRow[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Presupuesto mensual</CardTitle>
        <MonthSelector value={month} onChange={onMonthChange} />
      </CardHeader>
      <CardContent>
        <BudgetTable rows={rows} />
      </CardContent>
    </Card>
  );
}
