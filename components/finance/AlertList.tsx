import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/finance/StatusBadge";

export function AlertList({ alerts }: { alerts: { id: string; message: string; status: "success" | "warning" | "danger" | "info" }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
            <p className="text-sm">{alert.message}</p>
            <StatusBadge status={alert.status} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
