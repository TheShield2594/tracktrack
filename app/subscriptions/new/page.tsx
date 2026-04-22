import { getAllCategories } from "@/lib/queries";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";

export const dynamic = "force-dynamic";

export default function NewSubscriptionPage() {
  const categories = getAllCategories();

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Add Subscription</h1>
        <p className="text-sm text-text-muted mt-1">Track a new recurring charge</p>
      </div>
      <div className="glass-card p-6">
        <SubscriptionForm categories={categories} />
      </div>
    </div>
  );
}
