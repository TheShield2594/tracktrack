import { getDb } from "./db";
import { toMonthlyCost, formatCurrency } from "./utils";
import type { Subscription, Category, PriceHistory } from "./types";

export { toMonthlyCost, formatCurrency };

// ── Subscriptions ─────────────────────────────────────────────────────────────

export function getAllSubscriptions(): Subscription[] {
  const db = getDb();
  return db.prepare("SELECT * FROM subscriptions ORDER BY next_billing_date ASC").all() as Subscription[];
}

export function getSubscriptionById(id: string): Subscription | null {
  const db = getDb();
  return (db.prepare("SELECT * FROM subscriptions WHERE id = ?").get(id) as Subscription) ?? null;
}

export function getActiveSubscriptions(): Subscription[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM subscriptions WHERE status IN ('active','trial') ORDER BY next_billing_date ASC")
    .all() as Subscription[];
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getAllCategories(): Category[] {
  const db = getDb();
  return db.prepare("SELECT * FROM categories ORDER BY name ASC").all() as Category[];
}

// ── Price History ─────────────────────────────────────────────────────────────

export function getPriceHistory(subscriptionId: string): PriceHistory[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM price_history WHERE subscription_id = ? ORDER BY changed_at DESC")
    .all(subscriptionId) as PriceHistory[];
}

// ── Analytics helpers ─────────────────────────────────────────────────────────

export function getMonthlyTotal(subs: Subscription[]): number {
  return subs
    .filter((s) => s.status === "active" || s.status === "trial")
    .reduce((sum, s) => sum + toMonthlyCost(s.cost, s.billing_cycle), 0);
}

export function getAnnualTotal(subs: Subscription[]): number {
  return getMonthlyTotal(subs) * 12;
}

export function getCategoryBreakdown(subs: Subscription[]): { name: string; value: number; color: string }[] {
  const active = subs.filter((s) => s.status === "active" || s.status === "trial");
  const map = new Map<string, { value: number; color: string }>();

  for (const s of active) {
    const monthly = toMonthlyCost(s.cost, s.billing_cycle);
    const existing = map.get(s.category);
    if (existing) {
      existing.value += monthly;
    } else {
      map.set(s.category, { value: monthly, color: s.color });
    }
  }

  return Array.from(map.entries())
    .map(([name, { value, color }]) => ({ name, value: Math.round(value * 100) / 100, color }))
    .sort((a, b) => b.value - a.value);
}

export function getMonthlySpendingHistory(subs: Subscription[], months = 12): { month: string; total: number }[] {
  const result: { month: string; total: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });

    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);

    let total = 0;
    for (const s of subs) {
      const started = new Date(s.start_date) <= monthEnd;
      const notCancelledYet = s.status !== "cancelled" || new Date(s.updated_at) >= monthStart;
      if (started && notCancelledYet) {
        total += toMonthlyCost(s.cost, s.billing_cycle);
      }
    }

    result.push({ month: label, total: Math.round(total * 100) / 100 });
  }

  return result;
}
