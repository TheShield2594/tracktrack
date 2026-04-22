import { notFound } from "next/navigation";
import { getSubscriptionById, getAllCategories } from "@/lib/queries";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditSubscriptionPage({ params }: Props) {
  const { id } = await params;
  const sub = getSubscriptionById(id);
  if (!sub) notFound();
  const categories = getAllCategories();

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Edit Subscription</h1>
        <p className="text-sm text-text-muted mt-1">Update details for {sub.name}</p>
      </div>
      <div className="glass-card p-6">
        <SubscriptionForm subscription={sub} categories={categories} />
      </div>
    </div>
  );
}
