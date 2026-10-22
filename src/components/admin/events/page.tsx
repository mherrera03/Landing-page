import Link from "next/link";
import { CalendarDays, Pencil, Plus } from "lucide-react";
import { DeleteEventButton } from "@/components/admin/DeleteEventButton";
import { formatEventDate, formatEventPrice, formatEventTime } from "@/lib/format-event";
import { deleteEventAction } from "@/server/actions/events.actions";
import { listEvents } from "@/server/repositories/events.repository";
import { EVENT_STATUS_LABELS } from "@/types/event.types";

export const dynamic = "force-dynamic";

export default function EventosAdminPage() {
  const events = listEvents();

  return (
    <section>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink">Eventos</h1>
          <p className="text-sm text-ink/70">
            {events.length === 0 ? "Aún no hay eventos." : `${events.length} evento(s) registrados.`}
          </p>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-paper transition-opacity duration-200 hover:opacity-90"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nuevo evento
        </Link>
      </header>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
          <CalendarDays className="mx-auto mb-3 size-8 text-ink/40" aria-hidden="true" />
          <p className="font-semibold text-ink">Todavía no has creado ningún evento</p>
          <p className="mt-1 text-sm text-ink/70">Crea el primero y aparecerá en la landing cuando esté visible.</p>
        </div>
      ) : (
        <ul className="grid gap-4">
          {events.map((e) => (
            <li
              key={e.id}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-paper px-3 py-1 text-ink">{e.type}</span>
                  <span className="rounded-full bg-paper px-3 py-1 text-ink">{e.modality}</span>
                  <span className="rounded-full bg-paper px-3 py-1 text-ink">{EVENT_STATUS_LABELS[e.status]}</span>
                  {!e.visible && <span className="rounded-full bg-danger/10 px-3 py-1 text-danger">Oculto</span>}
                  {e.featured && <span className="rounded-full bg-ink px-3 py-1 text-paper">Destacado</span>}
                </div>
                <h2 className="truncate text-lg font-bold text-ink">{e.title}</h2>
                <p className="text-sm capitalize text-ink/70">
                  {formatEventDate(e.date)} · {formatEventTime(e.time)} · {formatEventPrice(e.price)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/admin/eventos/${e.id}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  Editar
                </Link>
                <DeleteEventButton action={deleteEventAction.bind(null, e.id)} title={e.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
