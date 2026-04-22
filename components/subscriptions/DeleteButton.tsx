"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSubscription } from "@/lib/actions";

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    startTransition(async () => {
      await deleteSubscription(id);
      router.push("/subscriptions");
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending} className="btn-danger">
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      Delete
    </button>
  );
}
