export function SpendingTrendChart({ points }: { points: { label: string; value: number }[] }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <div className="flex h-40 items-end gap-2">
      {points.map((point) => {
        const height = Math.max(8, Math.round((point.value / max) * 140));
        return (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-1">
            <div className="w-full rounded-t bg-emerald-500" style={{ height }} />
            <span className="text-[10px] text-muted-foreground">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}
