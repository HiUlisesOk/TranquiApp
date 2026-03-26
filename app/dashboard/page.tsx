import { ModulePage } from "@/components/layout/module-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildDashboardMetrics, toneClassName } from "@/features/dashboard/domain";
import { demoBudgets, demoCategories, demoMovements } from "@/lib/data/demo";

const budget = demoBudgets[0];
const metrics = buildDashboardMetrics({
  budget,
  movements: demoMovements,
  categories: demoCategories,
  previousMonthExpense: 470,
});

const metricCards = [
  metrics.availableToSpend,
  metrics.netSavings,
  metrics.savingsRate,
  metrics.consumedPercent,
  metrics.monthlyComparison,
];

export default function DashboardPage() {
  return (
    <ModulePage
      title="Dashboard"
      description="Indicadores financieros calculados automáticamente desde tus movimientos y presupuesto."
      state="success"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle>{metric.formatted}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge className={toneClassName[metric.tone]}>{metric.tone.toUpperCase()}</Badge>
              <p className="text-xs text-muted-foreground">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas de presupuesto</CardTitle>
          <CardDescription>
            Gastos no planificados: {metrics.budget.unplannedExpenses.length} · Cobertura insuficiente:{" "}
            {metrics.budget.insufficientCoverageItems.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge className={metrics.budget.unplannedExpenses.length > 0 ? toneClassName.warning : toneClassName.success}>
            No planificados: {metrics.budget.unplannedExpenses.length}
          </Badge>
          <Badge className={metrics.budget.insufficientCoverageItems.length > 0 ? toneClassName.danger : toneClassName.success}>
            Pendientes por cobertura: {metrics.budget.insufficientCoverageItems.length}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top categorías de gasto</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Gasto real</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.topCategories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>${category.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ModulePage>
  );
}
