import { ModulePage } from "@/components/layout/module-page";
import { FinanceWorkspace } from "@/features/finance/forms";

export default function Page() {
  return (
    <ModulePage
      title="Gestión financiera"
      description="CRUD completo con React Hook Form + Zod para cuentas, categorías, presupuesto, movimientos, recurrentes y configuración."
      state="success"
    >
      <FinanceWorkspace />
    </ModulePage>
  );
}
