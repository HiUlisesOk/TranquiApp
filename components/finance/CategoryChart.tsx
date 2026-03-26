export function CategoryChart({ data }: { data: { category: string; amount: number }[] }) {
  const total = data.reduce((sum, item) => sum + item.amount, 0) || 1;
  return (
    <div className="space-y-2">
      {data.map((item) => {
        const width = Math.round((item.amount / total) * 100);
        return (
          <div key={item.category} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.category}</span>
              <span>{item.amount.toFixed(2)}</span>
            </div>
            <div className="h-2 rounded bg-muted">
              <div className="h-2 rounded bg-blue-500" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
