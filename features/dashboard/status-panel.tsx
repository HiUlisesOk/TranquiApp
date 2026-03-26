import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Inbox, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ViewState } from "@/types";

const microcopyByState: Record<ViewState, { title: string; body: string; icon: ReactNode }> = {
  empty: {
    title: "Todavía no hay datos",
    body: "Empezá cargando tu primer movimiento para ver tendencias y recomendaciones.",
    icon: <Inbox className="h-5 w-5" />
  },
  loading: {
    title: "Sincronizando movimientos",
    body: "Estamos preparando tu tablero. Esto puede tomar unos segundos.",
    icon: <LoaderCircle className="h-5 w-5 animate-spin" />
  },
  error: {
    title: "No se pudo cargar el resumen",
    body: "Reintentá en unos segundos o revisá la conexión con Supabase.",
    icon: <AlertCircle className="h-5 w-5" />
  },
  success: {
    title: "Todo al día",
    body: "Tus cuentas están conciliadas y no detectamos anomalías en tus gastos.",
    icon: <CheckCircle2 className="h-5 w-5" />
  }
};

export function StatusPanel({ state }: { state: ViewState }) {
  const item = microcopyByState[state];

  return (
    <Card>
      <CardHeader>
        <CardDescription>Estado del módulo</CardDescription>
        <CardTitle className="flex items-center gap-2 text-xl">
          {item.icon}
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{item.body}</p>
        <Badge variant={state === "error" ? "destructive" : "secondary"}>{state.toUpperCase()}</Badge>
      </CardContent>
    </Card>
  );
}
