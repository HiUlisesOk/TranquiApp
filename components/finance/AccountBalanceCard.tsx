import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountBalanceCard({ name, balance, currency = "USD" }: { name: string; balance: number; currency?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(balance)}
        </p>
      </CardContent>
    </Card>
  );
}
