export type BillingCycle = "weekly" | "monthly" | "quarterly" | "annually" | "one-time";
export type SubscriptionStatus = "active" | "trial" | "paused" | "cancelled";
export type Currency = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | "CHF" | "INR" | "BRL" | "CNY" | "SEK" | "NOK" | "MXN";

export interface Subscription {
  id: string;
  name: string;
  description: string | null;
  website_url: string | null;
  logo_url: string | null;
  category: string;
  color: string;
  cost: number;
  currency: Currency;
  billing_cycle: BillingCycle;
  start_date: string;
  next_billing_date: string;
  trial_end_date: string | null;
  status: SubscriptionStatus;
  payment_method: string | null;
  notes: string | null;
  reminder_days: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export interface PriceHistory {
  id: string;
  subscription_id: string;
  old_cost: number;
  new_cost: number;
  currency: Currency;
  changed_at: string;
}

export interface SubscriptionFormData {
  name: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  category: string;
  color: string;
  cost: number;
  currency: Currency;
  billing_cycle: BillingCycle;
  start_date: string;
  next_billing_date: string;
  trial_end_date?: string;
  status: SubscriptionStatus;
  payment_method?: string;
  notes?: string;
  reminder_days: number;
}

export const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
];

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
  { value: "one-time", label: "One-time" },
];

export const DEFAULT_CATEGORIES = [
  { name: "Entertainment", color: "#8b5cf6", icon: "🎬" },
  { name: "Productivity", color: "#3b82f6", icon: "⚡" },
  { name: "Music", color: "#ec4899", icon: "🎵" },
  { name: "Gaming", color: "#10b981", icon: "🎮" },
  { name: "News & Media", color: "#f59e0b", icon: "📰" },
  { name: "Cloud & Storage", color: "#06b6d4", icon: "☁️" },
  { name: "Health & Fitness", color: "#ef4444", icon: "💪" },
  { name: "Finance", color: "#14b8a6", icon: "💳" },
  { name: "Education", color: "#f97316", icon: "📚" },
  { name: "Developer Tools", color: "#6366f1", icon: "🛠️" },
  { name: "Communication", color: "#84cc16", icon: "💬" },
  { name: "Security", color: "#64748b", icon: "🔒" },
  { name: "Other", color: "#94a3b8", icon: "📦" },
];
