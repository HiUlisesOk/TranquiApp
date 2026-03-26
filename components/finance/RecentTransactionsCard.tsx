import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionTable, type TransactionRow } from "@/components/finance/TransactionTable";

export function RecentTransactionsCard({ rows }: { rows: TransactionRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionTable rows={rows} />
      </CardContent>
    </Card>
  );
}
