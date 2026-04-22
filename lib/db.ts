import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { DEFAULT_CATEGORIES } from "./types";
import { v4 as uuidv4 } from "uuid";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "tracktrack.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  initSchema(db);
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      color TEXT NOT NULL DEFAULT '#6366f1',
      icon TEXT NOT NULL DEFAULT '📦',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      website_url TEXT,
      logo_url TEXT,
      category TEXT NOT NULL DEFAULT 'Other',
      color TEXT NOT NULL DEFAULT '#6366f1',
      cost REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      billing_cycle TEXT NOT NULL DEFAULT 'monthly',
      start_date TEXT NOT NULL,
      next_billing_date TEXT NOT NULL,
      trial_end_date TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      payment_method TEXT,
      notes TEXT,
      reminder_days INTEGER NOT NULL DEFAULT 3,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id TEXT PRIMARY KEY,
      subscription_id TEXT NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
      old_cost REAL NOT NULL,
      new_cost REAL NOT NULL,
      currency TEXT NOT NULL,
      changed_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_category ON subscriptions(category);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date);
    CREATE INDEX IF NOT EXISTS idx_price_history_sub ON price_history(subscription_id);
  `);

  // Seed default categories if none exist
  const count = (db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number }).c;
  if (count === 0) {
    const insert = db.prepare(
      "INSERT OR IGNORE INTO categories (id, name, color, icon, created_at) VALUES (?, ?, ?, ?, ?)"
    );
    for (const cat of DEFAULT_CATEGORIES) {
      insert.run(uuidv4(), cat.name, cat.color, cat.icon, new Date().toISOString());
    }
  }

  // Seed demo data if no subscriptions exist
  const subCount = (db.prepare("SELECT COUNT(*) as c FROM subscriptions").get() as { c: number }).c;
  if (subCount === 0) {
    seedDemoData(db);
  }
}

function seedDemoData(db: Database.Database) {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const demos = [
    { name: "Netflix", category: "Entertainment", color: "#ef4444", cost: 15.99, cycle: "monthly", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", status: "active", days: 12 },
    { name: "Spotify", category: "Music", color: "#10b981", cost: 9.99, cycle: "monthly", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg", status: "active", days: 5 },
    { name: "GitHub Pro", category: "Developer Tools", color: "#6366f1", cost: 4.00, cycle: "monthly", logo: null, status: "active", days: 20 },
    { name: "Adobe Creative Cloud", category: "Productivity", color: "#ef4444", cost: 54.99, cycle: "monthly", logo: null, status: "active", days: 8 },
    { name: "1Password", category: "Security", color: "#3b82f6", cost: 35.88, cycle: "annually", logo: null, status: "active", days: 180 },
    { name: "Notion", category: "Productivity", color: "#64748b", cost: 16.00, cycle: "monthly", logo: null, status: "active", days: 25 },
    { name: "YouTube Premium", category: "Entertainment", color: "#ef4444", cost: 13.99, cycle: "monthly", logo: null, status: "paused", days: -5 },
    { name: "Linear", category: "Developer Tools", color: "#6366f1", cost: 8.00, cycle: "monthly", logo: null, status: "trial", days: 7 },
  ];

  const insert = db.prepare(`
    INSERT INTO subscriptions
    (id, name, description, website_url, logo_url, category, color, cost, currency, billing_cycle,
     start_date, next_billing_date, trial_end_date, status, payment_method, notes, reminder_days, created_at, updated_at)
    VALUES (?, ?, null, null, ?, ?, ?, ?, 'USD', ?, ?, ?, ?, ?, null, null, 3, ?, ?)
  `);

  for (const d of demos) {
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + d.days);
    const startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);
    const trialEnd = d.status === "trial" ? fmt(nextDate) : null;

    insert.run(
      uuidv4(), d.name, d.logo, d.category, d.color, d.cost, d.cycle,
      fmt(startDate), fmt(nextDate), trialEnd, d.status,
      now.toISOString(), now.toISOString()
    );
  }
}
