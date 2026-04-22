"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { month: string; total: number }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="glass-card px-3 py-2 shadow-xl">
        <p className="text-xs text-text-muted mb-1">{label}</p>
        <p className="text-sm font-semibold text-text-primary">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
}

export function SpendingTrendChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.total));

  return (
    <div className="glass-card">
      <div className="px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-text-primary">Monthly Spending Trend</h2>
        <p className="text-xs text-text-muted mt-0.5">12-month history (estimated)</p>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} domain={[0, max * 1.2]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
            <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
