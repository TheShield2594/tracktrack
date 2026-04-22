"use client";

import { Download } from "lucide-react";
import type { Subscription } from "@/lib/types";
import { toMonthlyCost } from "@/lib/utils";

interface Props {
  subscriptions: Subscription[];
}

export function ExportButtons({ subscriptions }: Props) {
  function exportCSV() {
    const headers = ["Name", "Category", "Cost", "Currency", "Billing Cycle", "Monthly Equiv", "Status", "Next Billing", "Start Date", "Payment Method"];
    const rows = subscriptions.map((s) => [
      s.name, s.category, s.cost, s.currency, s.billing_cycle,
      toMonthlyCost(s.cost, s.billing_cycle).toFixed(2),
      s.status, s.next_billing_date, s.start_date, s.payment_method ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    download("tracktrack-subscriptions.csv", "text/csv", csv);
  }

  function exportJSON() {
    const data = JSON.stringify(subscriptions, null, 2);
    download("tracktrack-subscriptions.json", "application/json", data);
  }

  function download(filename: string, type: string, content: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass-card p-5">
      <h2 className="text-sm font-semibold text-text-primary mb-1">Export Data</h2>
      <p className="text-xs text-text-muted mb-4">Download your subscription data for backups or analysis</p>
      <div className="flex gap-3">
        <button onClick={exportCSV} className="btn-secondary">
          <Download size={14} /> Export CSV
        </button>
        <button onClick={exportJSON} className="btn-secondary">
          <Download size={14} /> Export JSON
        </button>
      </div>
    </div>
  );
}
