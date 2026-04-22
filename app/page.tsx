import { getAllSubscriptions } from "@/lib/queries";
import { getCategoryBreakdown, getMonthlySpendingHistory } from "@/lib/queries";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const subscriptions = getAllSubscriptions();
  const categoryData = getCategoryBreakdown(subscriptions);
  const spendingHistory = getMonthlySpendingHistory(subscriptions, 12);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Overview of your subscriptions and spending</p>
      </div>

      <StatsCards subscriptions={subscriptions} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SpendingChart data={spendingHistory} />
        </div>
        <div>
          <CategoryChart data={categoryData} />
        </div>
      </div>

      <UpcomingRenewals subscriptions={subscriptions} />
    </div>
  );
}
