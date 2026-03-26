import { StatusBadge } from "@/components/finance/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type TransactionRow = {
  id: string;
  date: string;
  description: string;
  category: string;
  account: string;
  amount: number;
  status?: "success" | "warning" | "danger" | "info";
};

export function TransactionTable({ rows }: { rows: TransactionRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Cuenta</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.date}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.account}</TableCell>
            <TableCell className={row.amount < 0 ? "text-red-600" : "text-green-700"}>{row.amount.toFixed(2)}</TableCell>
            <TableCell>{row.status ? <StatusBadge status={row.status} /> : "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
