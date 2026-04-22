import { getAllCategories, getAllSubscriptions } from "@/lib/queries";
import { ExportButtons } from "@/components/settings/ExportButtons";
import { CategoryManager } from "@/components/settings/CategoryManager";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const categories = getAllCategories();
  const subscriptions = getAllSubscriptions();

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage categories, export data, and preferences</p>
      </div>

      <ExportButtons subscriptions={subscriptions} />
      <CategoryManager categories={categories} />
    </div>
  );
}
