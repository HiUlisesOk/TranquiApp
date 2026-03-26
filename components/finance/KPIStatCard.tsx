import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/finance/StatusBadge";

export function KPIStatCard({
  title,
  value,
  hint,
  tone = "info"
}: {
  title: string;
  value: string;
  hint?: string;
  tone?: "success" | "warning" | "danger" | "info";
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-semibold">{value}</p>
        {hint ? (
          <div className="flex items-center gap-2">
            <StatusBadge status={tone} label={tone.toUpperCase()} />
            <p className="text-xs text-muted-foreground">{hint}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
