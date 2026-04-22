import { getAllSubscriptions } from "@/lib/queries";
import { CalendarView } from "@/components/calendar/CalendarView";

export const dynamic = "force-dynamic";

export default function CalendarPage() {
  const subscriptions = getAllSubscriptions();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Calendar</h1>
        <p className="text-sm text-text-muted mt-1">See when your subscriptions renew</p>
      </div>
      <CalendarView subscriptions={subscriptions} />
    </div>
  );
}
