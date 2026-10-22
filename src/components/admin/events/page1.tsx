import { EventForm } from "@/components/admin/EventForm"; // ⚠️ ajusta la ruta si tu CourseForm vive en otra carpeta
import { createEventAction } from "@/server/actions/events.actions";

export default function NuevoEventoPage() {
  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-ink">Nuevo evento</h1>
      <EventForm action={createEventAction} />
    </section>
  );
}
