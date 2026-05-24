import EventForm from "@/components/admin/EventForm";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <div className="fade-in">
      <div className="mb-10">
        <h1 className="admin-title">
          Create <span className="text-gold">New Event</span>
        </h1>
        <p className="admin-subtitle">Add a new event with timeline updates and guest registrations.</p>
      </div>

      <div className="admin-table-container" style={{ padding: "2rem", marginTop: "1rem" }}>
        <EventForm mode="create" />
      </div>
    </div>
  );
}
