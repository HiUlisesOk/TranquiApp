import { KPIStatCard } from "@/components/finance/KPIStatCard";

export type KPIItem = { title: string; value: string; hint?: string; tone?: "success" | "warning" | "danger" | "info" };

export function KPIGrid({ items }: { items: KPIItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <KPIStatCard key={item.title} {...item} />
      ))}
    </div>
  );
}
