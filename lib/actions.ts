"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "./db";
import { getSubscriptionById, toMonthlyCost } from "./queries";
import type { SubscriptionFormData } from "./types";
import { v4 as uuidv4 } from "uuid";

export async function createSubscription(data: SubscriptionFormData) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO subscriptions
    (id, name, description, website_url, logo_url, category, color, cost, currency,
     billing_cycle, start_date, next_billing_date, trial_end_date, status,
     payment_method, notes, reminder_days, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, data.name, data.description ?? null, data.website_url ?? null,
    data.logo_url ?? null, data.category, data.color, data.cost, data.currency,
    data.billing_cycle, data.start_date, data.next_billing_date,
    data.trial_end_date ?? null, data.status, data.payment_method ?? null,
    data.notes ?? null, data.reminder_days, now, now
  );

  revalidatePath("/");
  revalidatePath("/subscriptions");
  return { id };
}

export async function updateSubscription(id: string, data: SubscriptionFormData) {
  const db = getDb();
  const now = new Date().toISOString();
  const existing = getSubscriptionById(id);

  if (!existing) throw new Error("Subscription not found");

  // Track price change
  if (existing.cost !== data.cost) {
    db.prepare(`
      INSERT INTO price_history (id, subscription_id, old_cost, new_cost, currency, changed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), id, existing.cost, data.cost, data.currency, now);
  }

  db.prepare(`
    UPDATE subscriptions SET
      name = ?, description = ?, website_url = ?, logo_url = ?, category = ?,
      color = ?, cost = ?, currency = ?, billing_cycle = ?, start_date = ?,
      next_billing_date = ?, trial_end_date = ?, status = ?, payment_method = ?,
      notes = ?, reminder_days = ?, updated_at = ?
    WHERE id = ?
  `).run(
    data.name, data.description ?? null, data.website_url ?? null,
    data.logo_url ?? null, data.category, data.color, data.cost, data.currency,
    data.billing_cycle, data.start_date, data.next_billing_date,
    data.trial_end_date ?? null, data.status, data.payment_method ?? null,
    data.notes ?? null, data.reminder_days, now, id
  );

  revalidatePath("/");
  revalidatePath("/subscriptions");
  revalidatePath(`/subscriptions/${id}`);
}

export async function deleteSubscription(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM subscriptions WHERE id = ?").run(id);
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

export async function updateSubscriptionStatus(id: string, status: string) {
  const db = getDb();
  const now = new Date().toISOString();
  db.prepare("UPDATE subscriptions SET status = ?, updated_at = ? WHERE id = ?").run(status, now, id);
  revalidatePath("/");
  revalidatePath("/subscriptions");
}

export async function createCategory(name: string, color: string, icon: string) {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO categories (id, name, color, icon, created_at) VALUES (?, ?, ?, ?, ?)").run(
    id, name, color, icon, now
  );
  revalidatePath("/subscriptions");
}
