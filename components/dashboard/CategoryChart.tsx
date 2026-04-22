"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: DataPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 shadow-xl">
        <p className="text-xs text-text-muted">{payload[0].name}</p>
        <p className="text-sm font-semibold text-text-primary">
          {formatCurrency(payload[0].value)} / mo
        </p>
      </div>
    );
  }
  return null;
}

export function CategoryChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card">
      <div className="px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-text-primary">By Category</h2>
        <p className="text-xs text-text-muted mt-0.5">Monthly breakdown</p>
      </div>
      <div className="p-5">
        {data.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-text-muted text-sm">No data</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {data.slice(0, 5).map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-text-secondary flex-1 truncate">{d.name}</span>
                  <span className="text-xs font-medium text-text-primary tabular-nums">
                    {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
