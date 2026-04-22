import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllSubscriptions, getAllCategories, getMonthlyTotal } from "@/lib/queries";
import { formatCurrency } from "@/lib/utils";
import { SubscriptionRow } from "@/components/subscriptions/SubscriptionRow";
import { SubscriptionFilters } from "@/components/subscriptions/SubscriptionFilters";
import type { Subscription } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; status?: string; category?: string; sort?: string }>;
}

export default async function SubscriptionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const all = getAllSubscriptions();
  const categories = getAllCategories();

  let filtered: Subscription[] = all;

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }
  if (params.status) filtered = filtered.filter((s) => s.status === params.status);
  if (params.category) filtered = filtered.filter((s) => s.category === params.category);

  const sort = params.sort ?? "next_billing_date";
  filtered.sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "cost") return b.cost - a.cost;
    if (sort === "created_at") return b.created_at.localeCompare(a.created_at);
    return a.next_billing_date.localeCompare(b.next_billing_date);
  });

  const monthly = getMonthlyTotal(filtered);
  const categoryNames = [...new Set(all.map((s) => s.category))].sort();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Subscriptions</h1>
          <p className="text-sm text-text-muted mt-1">
            {filtered.length} subscription{filtered.length !== 1 ? "s" : ""} · {formatCurrency(monthly)} / mo
          </p>
        </div>
        <Link href="/subscriptions/new" className="btn-primary">
          <Plus size={15} /> Add Subscription
        </Link>
      </div>

      <SubscriptionFilters categories={categoryNames} />

      <div className="glass-card overflow-hidden">
        {/* Table header */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border/50 text-xs font-medium text-text-muted uppercase tracking-wider">
          <div className="w-8 flex-shrink-0" />
          <div className="flex-1">Name</div>
          <div className="hidden sm:block w-28">Status</div>
          <div className="hidden md:block w-36">Next Billing</div>
          <div className="w-28 text-right">Cost</div>
          <div className="w-7" />
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">No subscriptions found</p>
            <Link href="/subscriptions/new" className="btn-primary mt-4 inline-flex">
              <Plus size={14} /> Add your first subscription
            </Link>
          </div>
        ) : (
          filtered.map((s) => <SubscriptionRow key={s.id} subscription={s} />)
        )}
      </div>
    </div>
  );
}
