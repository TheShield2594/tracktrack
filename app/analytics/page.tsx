import { getAllSubscriptions, getAllCategories, getCategoryBreakdown, getMonthlySpendingHistory, getMonthlyTotal, getAnnualTotal } from "@/lib/queries";
import { formatCurrency, toMonthlyCost } from "@/lib/utils";
import { SpendingTrendChart } from "@/components/analytics/SpendingTrendChart";
import { CategoryBreakdown } from "@/components/analytics/CategoryBreakdown";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  const subs = getAllSubscriptions();
  const categories = getAllCategories();
  const categoryData = getCategoryBreakdown(subs);
  const trendData = getMonthlySpendingHistory(subs, 12);
  const monthly = getMonthlyTotal(subs);
  const annual = getAnnualTotal(subs);

  const active = subs.filter((s) => s.status === "active" || s.status === "trial");
  const avgPerSub = active.length ? monthly / active.length : 0;
  const mostExpensive = active.sort((a, b) => toMonthlyCost(b.cost, b.billing_cycle) - toMonthlyCost(a.cost, a.billing_cycle))[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-muted mt-1">Deep dive into your subscription spending</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Spend", value: formatCurrency(monthly), sub: "active subscriptions" },
          { label: "Annual Projection", value: formatCurrency(annual), sub: "based on current plans" },
          { label: "Avg per Subscription", value: formatCurrency(avgPerSub), sub: "monthly equivalent" },
          { label: "Most Expensive", value: mostExpensive?.name ?? "—", sub: mostExpensive ? formatCurrency(toMonthlyCost(mostExpensive.cost, mostExpensive.billing_cycle)) + " / mo" : "no active subs" },
        ].map((k) => (
          <div key={k.label} className="stat-card">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">{k.label}</p>
            <p className="text-xl font-bold text-text-primary truncate">{k.value}</p>
            <p className="text-xs text-text-muted mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <SpendingTrendChart data={trendData} />

      {/* Category breakdown */}
      <CategoryBreakdown data={categoryData} categories={categories} total={monthly} />
    </div>
  );
}
