import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, format, parseISO } from "date-fns";
import type { SubscriptionStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseISO(dateStr);
  return differenceInDays(target, today);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d, yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "MMM d");
}

export function statusColor(status: SubscriptionStatus): string {
  switch (status) {
    case "active": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    case "trial": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "paused": return "text-slate-400 bg-slate-400/10 border-slate-400/20";
    case "cancelled": return "text-red-400 bg-red-400/10 border-red-400/20";
  }
}

export function statusLabel(status: SubscriptionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function renewalUrgency(days: number): string {
  if (days < 0) return "text-red-400";
  if (days <= 3) return "text-red-400";
  if (days <= 7) return "text-amber-400";
  if (days <= 14) return "text-yellow-400";
  return "text-text-secondary";
}

export function renewalLabel(days: number): string {
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d`;
}

export function cycleLabel(cycle: string): string {
  const map: Record<string, string> = {
    weekly: "/ wk",
    monthly: "/ mo",
    quarterly: "/ qtr",
    annually: "/ yr",
    "one-time": "once",
  };
  return map[cycle] ?? cycle;
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function toMonthlyCost(cost: number, cycle: string): number {
  switch (cycle) {
    case "weekly": return (cost * 52) / 12;
    case "monthly": return cost;
    case "quarterly": return cost / 3;
    case "annually": return cost / 12;
    case "one-time": return 0;
    default: return cost;
  }
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
