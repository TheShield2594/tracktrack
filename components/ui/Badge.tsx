import { cn } from "@/lib/utils";
import type { SubscriptionStatus } from "@/lib/types";
import { statusColor, statusLabel } from "@/lib/utils";

interface StatusBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn("badge", statusColor(status), className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "danger";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-bg-tertiary border-border text-text-secondary",
    outline: "bg-transparent border-border text-text-secondary",
    success: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    warning: "bg-amber-400/10 border-amber-400/20 text-amber-400",
    danger: "bg-red-400/10 border-red-400/20 text-red-400",
  };
  return (
    <span className={cn("badge", variants[variant], className)}>
      {children}
    </span>
  );
}
