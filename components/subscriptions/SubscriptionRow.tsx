"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { MoreHorizontal, Edit, Trash2, PauseCircle, PlayCircle } from "lucide-react";
import { deleteSubscription, updateSubscriptionStatus } from "@/lib/actions";
import { StatusBadge } from "@/components/ui/Badge";
import { SubscriptionLogo } from "@/components/ui/SubscriptionLogo";
import { formatCurrency } from "@/lib/utils";
import { daysUntil, renewalLabel, renewalUrgency, cycleLabel, formatDate } from "@/lib/utils";
import type { Subscription } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  subscription: Subscription;
}

export function SubscriptionRow({ subscription: s }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const days = daysUntil(s.next_billing_date);

  function handleDelete() {
    if (!confirm(`Delete "${s.name}"?`)) return;
    startTransition(() => deleteSubscription(s.id));
    setMenuOpen(false);
  }

  function handleTogglePause() {
    const newStatus = s.status === "paused" ? "active" : "paused";
    startTransition(() => updateSubscriptionStatus(s.id, newStatus));
    setMenuOpen(false);
  }

  return (
    <div className={cn("table-row flex items-center gap-4 px-4 py-3.5", isPending && "opacity-50")}>
      <SubscriptionLogo name={s.name} logoUrl={s.logo_url} color={s.color} size="sm" />

      <div className="flex-1 min-w-0">
        <Link href={`/subscriptions/${s.id}`} className="text-sm font-medium text-text-primary hover:text-indigo-300 transition-colors">
          {s.name}
        </Link>
        <p className="text-xs text-text-muted">{s.category}</p>
      </div>

      <div className="hidden sm:block w-28">
        <StatusBadge status={s.status} />
      </div>

      <div className="hidden md:block w-36 text-xs text-text-secondary">
        <p>{formatDate(s.next_billing_date)}</p>
        <p className={cn("font-medium", renewalUrgency(days))}>{renewalLabel(days)}</p>
      </div>

      <div className="w-28 text-right">
        <p className="text-sm font-semibold text-text-primary tabular-nums">
          {formatCurrency(s.cost, s.currency)}
        </p>
        <p className="text-xs text-text-muted">{cycleLabel(s.billing_cycle)}</p>
      </div>

      {/* Action menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all"
        >
          <MoreHorizontal size={15} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-20 w-44 glass-card shadow-2xl py-1">
              <Link
                href={`/subscriptions/${s.id}/edit`}
                className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Edit size={13} /> Edit
              </Link>
              <button
                onClick={handleTogglePause}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                {s.status === "paused" ? <PlayCircle size={13} /> : <PauseCircle size={13} />}
                {s.status === "paused" ? "Resume" : "Pause"}
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
