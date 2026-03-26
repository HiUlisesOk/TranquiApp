import { ModulePage } from "@/components/layout/module-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { demoBudgets, demoCategories, demoMovements } from "@/lib/data/demo";
import { calculateBudgetReal } from "@/features/budget/domain";
import { toneClassName } from "@/features/dashboard/domain";

const budget = demoBudgets[0];
const computed = calculateBudgetReal(budget, demoMovements);

const categoryNameById = new Map(demoCategories.map((category) => [category.id, category.name]));

export default function PresupuestoPage() {
  return (
    <ModulePage
      title="Presupuesto"
      description="Plan vs real por categoría. El real se calcula automáticamente desde movimientos asociados."
      state="success"
    >
      <Card>
        <CardHeader>
          <CardTitle>Resumen presupuestario</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <Badge className={toneClassName.info}>Planificado: ${computed.plannedTotal}</Badge>
          <Badge className={toneClassName.warning}>Real: ${computed.realTotal}</Badge>
          <Badge className={computed.differenceTotal >= 0 ? toneClassName.success : toneClassName.danger}>
            Diferencia: ${computed.differenceTotal}
          </Badge>
          <Badge className={computed.unplannedExpenses.length > 0 ? toneClassName.warning : toneClassName.success}>
            No planificados: {computed.unplannedExpenses.length}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalle por categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Real</TableHead>
                <TableHead>Diferencia</TableHead>
                <TableHead>% consumido</TableHead>
                <TableHead>Pendiente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {computed.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{categoryNameById.get(item.categoryId) ?? "Sin categoría"}</TableCell>
                  <TableCell>${item.planned}</TableCell>
                  <TableCell>${item.real}</TableCell>
                  <TableCell>${item.difference}</TableCell>
                  <TableCell>{item.consumedPct}%</TableCell>
                  <TableCell>
                    <Badge className={item.hasInsufficientCoverage ? toneClassName.danger : toneClassName.success}>
                      {item.hasInsufficientCoverage ? "Cobertura insuficiente" : "Cubierto"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ModulePage>
  );
}
