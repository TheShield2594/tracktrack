import { TrendingUp, DollarSign, CalendarClock, PauseCircle } from "lucide-react";
import { formatCurrency, toMonthlyCost } from "@/lib/utils";
import type { Subscription } from "@/lib/types";

interface Props {
  subscriptions: Subscription[];
}

export function StatsCards({ subscriptions }: Props) {
  const active = subscriptions.filter((s) => s.status === "active" || s.status === "trial");
  const paused = subscriptions.filter((s) => s.status === "paused");
  const monthly = subscriptions
    .filter((s) => s.status === "active" || s.status === "trial")
    .reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billing_cycle), 0);
  const annual = monthly * 12;

  const today = new Date().toISOString().split("T")[0];
  const in7days = new Date();
  in7days.setDate(in7days.getDate() + 7);
  const renewingSoon = active.filter(
    (s) => s.next_billing_date >= today && s.next_billing_date <= in7days.toISOString().split("T")[0]
  ).length;

  const cards = [
    {
      label: "Monthly Spend",
      value: formatCurrency(monthly),
      sub: `${formatCurrency(annual)} / year`,
      icon: DollarSign,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      label: "Active Subscriptions",
      value: active.length.toString(),
      sub: `${subscriptions.length} total tracked`,
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      label: "Renewing Soon",
      value: renewingSoon.toString(),
      sub: "in the next 7 days",
      icon: CalendarClock,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
    {
      label: "Paused",
      value: paused.length.toString(),
      sub: `${formatCurrency(paused.reduce((s, x) => s + toMonthlyCost(x.cost, x.billing_cycle), 0))} saved / mo`,
      icon: PauseCircle,
      iconBg: "bg-slate-500/10",
      iconColor: "text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="stat-card">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{c.label}</p>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconBg}`}>
              <c.icon size={15} className={c.iconColor} />
            </div>
          </div>
          <p className="text-2xl font-bold text-text-primary tabular-nums">{c.value}</p>
          <p className="text-xs text-text-muted mt-1">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}
