import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm"; // ⚠️ ajusta la ruta si hace falta
import { updateEventAction } from "@/server/actions/events.actions";
import { getEventById } from "@/server/repositories/events.repository";

export const dynamic = "force-dynamic";

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eventId = Number(id);
  if (!Number.isInteger(eventId)) notFound();

  const event = getEventById(eventId);
  if (!event) notFound();

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-ink">Editar evento</h1>
      <EventForm action={updateEventAction.bind(null, event.id)} event={event} />
    </section>
  );
}
