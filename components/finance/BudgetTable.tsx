import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type BudgetRow = { id: string; category: string; planned: number; spent: number };

export function BudgetTable({ rows }: { rows: BudgetRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Categoría</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Ejecutado</TableHead>
          <TableHead>Saldo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.planned.toFixed(2)}</TableCell>
            <TableCell>{row.spent.toFixed(2)}</TableCell>
            <TableCell className={row.planned - row.spent < 0 ? "text-red-600" : "text-green-700"}>{(row.planned - row.spent).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
