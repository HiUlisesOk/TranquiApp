import { ModulePage } from "@/components/layout/module-page";
import { FinanceWorkspace } from "@/features/finance/forms";

export default function MovimientosPage() {
  return (
    <ModulePage
      title="Movimientos"
      description="Registrá movimientos, importá CSV con validaciones y aplicá autocategorización por texto."
      state="success"
    >
      <FinanceWorkspace />
    </ModulePage>
  );
}
