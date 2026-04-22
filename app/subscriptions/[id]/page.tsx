import { notFound } from "next/navigation";
import Link from "next/link";
import { Edit, Globe, CreditCard, Bell, FileText, TrendingDown } from "lucide-react";
import { getSubscriptionById, getPriceHistory } from "@/lib/queries";
import { formatCurrency, toMonthlyCost } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { SubscriptionLogo } from "@/components/ui/SubscriptionLogo";
import { formatDate, cycleLabel, daysUntil, renewalLabel, renewalUrgency } from "@/lib/utils";
import { DeleteButton } from "@/components/subscriptions/DeleteButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SubscriptionDetailPage({ params }: Props) {
  const { id } = await params;
  const sub = getSubscriptionById(id);
  if (!sub) notFound();

  const history = getPriceHistory(id);
  const days = daysUntil(sub.next_billing_date);
  const monthly = toMonthlyCost(sub.cost, sub.billing_cycle);

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <SubscriptionLogo name={sub.name} logoUrl={sub.logo_url} color={sub.color} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-text-primary">{sub.name}</h1>
            <StatusBadge status={sub.status} />
          </div>
          <p className="text-sm text-text-muted mt-1">{sub.category}</p>
          {sub.description && <p className="text-sm text-text-secondary mt-2">{sub.description}</p>}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link href={`/subscriptions/${sub.id}/edit`} className="btn-secondary">
            <Edit size={14} /> Edit
          </Link>
          <DeleteButton id={sub.id} name={sub.name} />
        </div>
      </div>

      {/* Cost summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Per billing", value: formatCurrency(sub.cost, sub.currency), sub: cycleLabel(sub.billing_cycle) },
          { label: "Monthly equiv.", value: formatCurrency(monthly, sub.currency), sub: "/ month" },
          { label: "Annual equiv.", value: formatCurrency(monthly * 12, sub.currency), sub: "/ year" },
        ].map((c) => (
          <div key={c.label} className="stat-card text-center">
            <p className="text-xs text-text-muted mb-1">{c.label}</p>
            <p className="text-lg font-bold text-text-primary tabular-nums">{c.value}</p>
            <p className="text-xs text-text-muted">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="glass-card divide-y divide-border/50">
        <Row icon={<Bell size={14} />} label="Next Renewal">
          <span>{formatDate(sub.next_billing_date)}</span>
          <span className={`text-xs font-medium ml-2 ${renewalUrgency(days)}`}>{renewalLabel(days)}</span>
        </Row>
        <Row icon={<Bell size={14} />} label="Started">{formatDate(sub.start_date)}</Row>
        {sub.trial_end_date && (
          <Row icon={<Bell size={14} />} label="Trial Ends">{formatDate(sub.trial_end_date)}</Row>
        )}
        {sub.payment_method && (
          <Row icon={<CreditCard size={14} />} label="Payment">{sub.payment_method}</Row>
        )}
        {sub.website_url && (
          <Row icon={<Globe size={14} />} label="Website">
            <a href={sub.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              {sub.website_url}
            </a>
          </Row>
        )}
        <Row icon={<Bell size={14} />} label="Reminder">{sub.reminder_days} days before renewal</Row>
        {sub.notes && (
          <Row icon={<FileText size={14} />} label="Notes">
            <span className="whitespace-pre-wrap">{sub.notes}</span>
          </Row>
        )}
      </div>

      {/* Price history */}
      {history.length > 0 && (
        <div className="glass-card">
          <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
            <TrendingDown size={14} className="text-text-muted" />
            <h2 className="text-sm font-semibold text-text-primary">Price History</h2>
          </div>
          <div className="divide-y divide-border/50">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between px-5 py-3">
                <p className="text-xs text-text-muted">{formatDate(h.changed_at)}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">{formatCurrency(h.old_cost, h.currency as "USD")}</span>
                  <span className="text-xs text-text-muted">→</span>
                  <span className={`text-xs font-medium ${h.new_cost > h.old_cost ? "text-red-400" : "text-emerald-400"}`}>
                    {formatCurrency(h.new_cost, h.currency as "USD")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <div className="w-4 h-4 mt-0.5 text-text-muted flex-shrink-0">{icon}</div>
      <p className="text-xs text-text-muted w-28 flex-shrink-0 mt-0.5">{label}</p>
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}
