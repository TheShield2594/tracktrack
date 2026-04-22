import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { daysUntil, formatDate, renewalUrgency, renewalLabel, cycleLabel } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { SubscriptionLogo } from "@/components/ui/SubscriptionLogo";
import type { Subscription } from "@/lib/types";

interface Props {
  subscriptions: Subscription[];
}

export function UpcomingRenewals({ subscriptions }: Props) {
  const upcoming = subscriptions
    .filter((s) => s.status === "active" || s.status === "trial")
    .sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date))
    .slice(0, 8);

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-text-primary">Upcoming Renewals</h2>
        <Link href="/subscriptions" className="text-xs text-accent-primary hover:text-indigo-300 flex items-center gap-1 transition-colors">
          View all <ArrowRight size={12} />
        </Link>
      </div>
      <div className="divide-y divide-border/50">
        {upcoming.length === 0 ? (
          <div className="px-5 py-8 text-center text-text-muted text-sm">No active subscriptions</div>
        ) : (
          upcoming.map((s) => {
            const days = daysUntil(s.next_billing_date);
            return (
              <Link
                key={s.id}
                href={`/subscriptions/${s.id}`}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-bg-hover/50 transition-colors"
              >
                <SubscriptionLogo name={s.name} logoUrl={s.logo_url} color={s.color} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{s.name}</p>
                  <p className="text-xs text-text-muted">{formatDate(s.next_billing_date)}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary tabular-nums">
                      {formatCurrency(s.cost, s.currency)}
                    </p>
                    <p className="text-xs text-text-muted">{cycleLabel(s.billing_cycle)}</p>
                  </div>
                  <div className={`text-xs font-semibold min-w-[3rem] text-right ${renewalUrgency(days)}`}>
                    {renewalLabel(days)}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
