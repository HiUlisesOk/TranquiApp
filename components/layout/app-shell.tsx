import Link from "next/link";
import { type ReactNode } from "react";
import { NAV_ITEMS } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r bg-background p-4">
          <p className="mb-6 text-lg font-semibold">TranquiApp</p>
          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-md px-3 py-2 text-sm hover:bg-muted">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex flex-col">
          <header className="flex items-center justify-between border-b bg-background px-6 py-3">
            <div>
              <p className="text-sm text-muted-foreground">Bienvenida de vuelta</p>
              <h1 className="text-lg font-semibold">Gestioná tus finanzas sin fricción</h1>
            </div>
            <Badge variant="secondary">Modo demo</Badge>
          </header>
          <section className="flex-1 p-6">{children}</section>
        </main>
      </div>
    </div>
  );
}
