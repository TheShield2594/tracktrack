"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback } from "react";

interface Props {
  categories: string[];
}

export function SubscriptionFilters({ categories }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.replace(`/subscriptions?${next.toString()}`);
    },
    [router, params]
  );

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          className="input-base pl-8"
          placeholder="Search subscriptions..."
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
        />
      </div>

      <select
        className="input-base w-auto"
        defaultValue={params.get("status") ?? ""}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="trial">Trial</option>
        <option value="paused">Paused</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <select
        className="input-base w-auto"
        defaultValue={params.get("category") ?? ""}
        onChange={(e) => update("category", e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select
        className="input-base w-auto"
        defaultValue={params.get("sort") ?? "next_billing_date"}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="next_billing_date">Sort: Renewal Date</option>
        <option value="name">Sort: Name</option>
        <option value="cost">Sort: Cost</option>
        <option value="created_at">Sort: Added</option>
      </select>
    </div>
  );
}
