"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createSubscription, updateSubscription } from "@/lib/actions";
import { CURRENCIES, BILLING_CYCLES } from "@/lib/types";
import type { Subscription, Category, SubscriptionFormData, Currency, BillingCycle, SubscriptionStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const STATUS_OPTIONS: { value: SubscriptionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#64748b",
];

interface Props {
  subscription?: Subscription;
  categories: Category[];
  onSuccess?: () => void;
}

export function SubscriptionForm({ subscription, categories, onSuccess }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!subscription;

  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const [form, setForm] = useState<SubscriptionFormData>({
    name: subscription?.name ?? "",
    description: subscription?.description ?? "",
    website_url: subscription?.website_url ?? "",
    logo_url: subscription?.logo_url ?? "",
    category: subscription?.category ?? (categories[0]?.name ?? "Other"),
    color: subscription?.color ?? "#6366f1",
    cost: subscription?.cost ?? 0,
    currency: (subscription?.currency ?? "USD") as Currency,
    billing_cycle: (subscription?.billing_cycle ?? "monthly") as BillingCycle,
    start_date: subscription?.start_date ?? today,
    next_billing_date: subscription?.next_billing_date ?? nextMonth.toISOString().split("T")[0],
    trial_end_date: subscription?.trial_end_date ?? "",
    status: (subscription?.status ?? "active") as SubscriptionStatus,
    payment_method: subscription?.payment_method ?? "",
    notes: subscription?.notes ?? "",
    reminder_days: subscription?.reminder_days ?? 3,
  });

  function set<K extends keyof SubscriptionFormData>(key: K, value: SubscriptionFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      if (isEdit && subscription) {
        await updateSubscription(subscription.id, form);
      } else {
        await createSubscription(form);
      }
      onSuccess?.();
      router.push("/subscriptions");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Color */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Name *</label>
          <input
            required
            className="input-base"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Netflix, Spotify..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Color</label>
          <div className="flex gap-1.5 pt-0.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("color", c)}
                className={cn(
                  "w-6 h-6 rounded-full transition-all",
                  form.color === c ? "ring-2 ring-offset-1 ring-offset-bg-tertiary scale-110" : "opacity-60 hover:opacity-100"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cost + Currency + Cycle */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Cost *</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            className="input-base"
            value={form.cost}
            onChange={(e) => set("cost", parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Currency</label>
          <select className="input-base" value={form.currency} onChange={(e) => set("currency", e.target.value as Currency)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.code} – {c.symbol}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Billing</label>
          <select className="input-base" value={form.billing_cycle} onChange={(e) => set("billing_cycle", e.target.value as BillingCycle)}>
            {BILLING_CYCLES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Category</label>
          <select className="input-base" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Status</label>
          <select className="input-base" value={form.status} onChange={(e) => set("status", e.target.value as SubscriptionStatus)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Start Date *</label>
          <input
            required
            type="date"
            className="input-base"
            value={form.start_date}
            onChange={(e) => set("start_date", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Next Billing *</label>
          <input
            required
            type="date"
            className="input-base"
            value={form.next_billing_date}
            onChange={(e) => set("next_billing_date", e.target.value)}
          />
        </div>
      </div>

      {/* Trial end + Reminder */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Trial End Date</label>
          <input
            type="date"
            className="input-base"
            value={form.trial_end_date ?? ""}
            onChange={(e) => set("trial_end_date", e.target.value || undefined)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Remind (days before)</label>
          <input
            type="number"
            min="0"
            max="30"
            className="input-base"
            value={form.reminder_days}
            onChange={(e) => set("reminder_days", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Optional fields */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Website URL</label>
        <input
          type="url"
          className="input-base"
          value={form.website_url ?? ""}
          onChange={(e) => set("website_url", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Logo URL</label>
        <input
          type="url"
          className="input-base"
          value={form.logo_url ?? ""}
          onChange={(e) => set("logo_url", e.target.value)}
          placeholder="https://... (SVG or PNG)"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Payment Method</label>
        <input
          className="input-base"
          value={form.payment_method ?? ""}
          onChange={(e) => set("payment_method", e.target.value)}
          placeholder="Visa •••• 4242"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">Notes</label>
        <textarea
          rows={2}
          className="input-base resize-none"
          value={form.notes ?? ""}
          onChange={(e) => set("notes", e.target.value)}
          placeholder="Any notes..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button type="button" className="btn-secondary" onClick={() => router.back()}>
          Cancel
        </button>
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isEdit ? "Save Changes" : "Add Subscription"}
        </button>
      </div>
    </form>
  );
}
