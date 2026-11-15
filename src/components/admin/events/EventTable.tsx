import { CalendarDays, MapPin, Star } from "lucide-react";
import { formatEventPrice } from "@/lib/events";
import { toggleEventVisibilityAction } from "@/server/actions/events.actions";
import type { UgbEvent } from "@/types/event.types";
import { EditLink, EmptyState, ListRow, Pill, RowThumbnail, VisibilityToggle } from "../ui/ListItems";

export function EventTable({ events }: { events: UgbEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState title="Todavía no hay eventos" action={{ href: "/admin/eventos/nuevo", label: "Crear evento" }}>
        Crea el primero y aparecerá en la landing.
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-3">
      {events.map((evento) => (
        <ListRow key={evento.id} dimmed={!evento.visible}>
          <RowThumbnail src={evento.image} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-ink">{evento.title}</h2>
              {evento.featured && (
                <Pill icon={Star} accent>
                  Destacado
                </Pill>
              )}
              {!evento.visible && <Pill>Oculto</Pill>}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-4" aria-hidden="true" />
                {evento.date} · {evento.time}
              </span>
              {evento.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-4" aria-hidden="true" />
                  {evento.location}
                </span>
              )}
              <span>{evento.modality}</span>
            </div>

            <p className="mt-1 text-sm text-muted">
              {evento.type}
              {evento.price !== undefined && ` · ${formatEventPrice(evento.price)}`}
              {evento.capacity !== undefined && ` · ${evento.capacity} cupos`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <VisibilityToggle action={toggleEventVisibilityAction} id={evento.id} visible={evento.visible} title={evento.title} />
            <EditLink href={`/admin/eventos/${evento.id}/editar`} title={evento.title} />
          </div>
        </ListRow>
      ))}
    </ul>
  );
}
