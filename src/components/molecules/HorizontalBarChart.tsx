interface BarItem {
  label: string;
  value: number;
}

interface HorizontalBarChartProps {
  items: BarItem[];
  valueSuffix?: string;
}

export function HorizontalBarChart({ items, valueSuffix = "" }: HorizontalBarChartProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No data</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-slate-600">
            <span className="truncate pr-2">{item.label}</span>
            <span className="shrink-0 font-medium text-slate-800">
              {item.value}
              {valueSuffix}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${Math.round((item.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
