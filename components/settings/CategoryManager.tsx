"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createCategory } from "@/lib/actions";
import type { Category } from "@/lib/types";

const EMOJI_OPTIONS = ["📦", "🎬", "🎵", "⚡", "🎮", "📰", "☁️", "💪", "💳", "📚", "🛠️", "💬", "🔒", "🌐", "🏠", "✈️", "🍔", "🛒"];
const COLOR_OPTIONS = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6", "#64748b", "#84cc16", "#14b8a6"];

interface Props {
  categories: Category[];
}

export function CategoryManager({ categories }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [icon, setIcon] = useState("📦");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    startTransition(async () => {
      await createCategory(name.trim(), color, icon);
      setName("");
      setAdding(false);
    });
  }

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <h2 className="text-sm font-semibold text-text-primary">Categories</h2>
        <button onClick={() => setAdding((v) => !v)} className="btn-secondary py-1.5 px-3 text-xs">
          <Plus size={12} /> Add
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="px-5 py-4 border-b border-border/50 space-y-3 bg-bg-tertiary/50">
          <div className="flex gap-3">
            <select className="input-base w-16 text-lg" value={icon} onChange={(e) => setIcon(e.target.value)}>
              {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            <input
              required
              className="input-base flex-1"
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-all ${color === c ? "ring-2 ring-offset-1 ring-offset-bg-tertiary scale-110" : "opacity-60 hover:opacity-100"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="btn-primary py-1.5 px-3 text-xs">
              {isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
              Add Category
            </button>
            <button type="button" onClick={() => setAdding(false)} className="btn-secondary py-1.5 px-3 text-xs">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="divide-y divide-border/50">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-3">
            <span className="text-lg">{c.icon}</span>
            <span className="text-sm text-text-primary flex-1">{c.name}</span>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}
