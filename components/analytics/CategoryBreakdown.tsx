import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: DataPoint[];
  categories: Category[];
  total: number;
}

export function CategoryBreakdown({ data, categories, total }: Props) {
  const catMap = Object.fromEntries(categories.map((c) => [c.name, c]));

  return (
    <div className="glass-card">
      <div className="px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-text-primary">Spending by Category</h2>
        <p className="text-xs text-text-muted mt-0.5">Monthly equivalent</p>
      </div>
      <div className="p-5 space-y-3">
        {data.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-4">No data</p>
        ) : (
          data.map((d) => {
            const pct = total > 0 ? (d.value / total) * 100 : 0;
            const cat = catMap[d.name];
            return (
              <div key={d.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat?.icon ?? "📦"}</span>
                    <span className="text-sm text-text-primary">{d.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">{pct.toFixed(1)}%</span>
                    <span className="text-sm font-semibold text-text-primary tabular-nums w-20 text-right">
                      {formatCurrency(d.value)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
