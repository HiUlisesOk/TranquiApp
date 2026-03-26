import { type ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StatusPanel } from "@/features/dashboard/status-panel";
import { type ViewState } from "@/types";

export function ModulePage({
  title,
  description,
  state,
  children
}: {
  title: string;
  description: string;
  state: ViewState;
  children?: ReactNode;
}) {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <StatusPanel state={state} />
        {children}
      </div>
    </AppShell>
  );
}
