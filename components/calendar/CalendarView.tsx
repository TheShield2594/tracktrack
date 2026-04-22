"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parseISO } from "date-fns";
import type { Subscription } from "@/lib/types";
import { SubscriptionLogo } from "@/components/ui/SubscriptionLogo";
import { formatCurrency } from "@/lib/utils";

interface Props {
  subscriptions: Subscription[];
}

export function CalendarView({ subscriptions }: Props) {
  const [current, setCurrent] = useState(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const active = subscriptions.filter((s) => s.status === "active" || s.status === "trial");

  function subsOnDay(day: Date): Subscription[] {
    return active.filter((s) => {
      const bd = parseISO(s.next_billing_date);
      return isSameDay(bd, day);
    });
  }

  const prev = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const next = () => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const today = new Date();

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <button onClick={prev} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all">
          <ChevronLeft size={16} />
        </button>
        <h2 className="text-sm font-semibold text-text-primary">
          {format(current, "MMMM yyyy")}
        </h2>
        <button onClick={next} className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2.5 text-center text-xs font-medium text-text-muted">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {/* Padding cells */}
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="min-h-[80px] border-b border-r border-border/30 bg-bg-primary/30" />
        ))}

        {days.map((day) => {
          const subs = subsOnDay(day);
          const isToday = isSameDay(day, today);
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          const col = (getDay(day) + 1) % 7;
          const isLastCol = col === 0;

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[80px] p-2 border-b border-border/30 transition-colors
                ${isLastCol ? "" : "border-r"}
                ${isWeekend ? "bg-bg-primary/20" : ""}
                ${subs.length > 0 ? "bg-indigo-500/3" : ""}`}
            >
              <div className={`text-xs font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full
                ${isToday ? "bg-accent-primary text-white" : "text-text-muted"}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {subs.slice(0, 2).map((s) => (
                  <Link
                    key={s.id}
                    href={`/subscriptions/${s.id}`}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs hover:bg-bg-hover transition-colors group"
                    title={`${s.name} – ${formatCurrency(s.cost, s.currency)}`}
                  >
                    <SubscriptionLogo name={s.name} logoUrl={s.logo_url} color={s.color} size="sm"
                      className="!w-4 !h-4 !rounded-[3px] flex-shrink-0" />
                    <span className="text-text-secondary truncate group-hover:text-text-primary transition-colors">{s.name}</span>
                  </Link>
                ))}
                {subs.length > 2 && (
                  <p className="text-xs text-text-muted px-1.5">+{subs.length - 2} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
