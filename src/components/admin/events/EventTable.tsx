import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Eye, EyeOff, MapPin, Pencil, Star } from "lucide-react";

import { toggleEventVisibilityAction } from "@/server/actions/events.actions";
import type { UgbEvent } from "@/types/event.types";
import { cn } from "@/lib/utils";

export function EventTable({ events }: { events: UgbEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-surface px-6 py-14 text-center">
        <p className="font-semibold text-ink">
          Todavía no hay eventos
        </p>

        <p className="mt-1 text-sm text-muted">
          Crea el primero y aparecerá en la landing.
        </p>

        <Link
          href="/admin/eventos/nuevo"
          className="mt-4 inline-flex min-h-11 items-center px-3 font-bold text-violet-deep"
        >
          Crear evento
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {events.map((evento) => (
        <li
          key={evento.id}
          className={cn(
            "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center",
            !evento.visible && "opacity-70",
          )}
        >
          <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-paper sm:h-16 sm:w-24">
            {evento.image && (
              <Image
                src={evento.image}
                alt={evento.imageAlt || ""}
                fill
                sizes="96px"
                className="object-cover"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-ink">
                {evento.title}
              </h2>

              {evento.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-soft px-2 py-0.5 text-xs font-semibold text-violet-deep">
                  <Star className="size-3" aria-hidden="true" />
                  Destacado
                </span>
              )}

              {!evento.visible && (
                <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">
                  Oculto
                </span>
              )}
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
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <form action={toggleEventVisibilityAction}>
              <input
                type="hidden"
                name="id"
                value={evento.id}
              />

              <button
                type="submit"
                title={
                  evento.visible
                    ? "Ocultar de la landing"
                    : "Mostrar en la landing"
                }
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
              >
                {evento.visible ? (
                  <Eye className="size-4" aria-hidden="true" />
                ) : (
                  <EyeOff className="size-4" aria-hidden="true" />
                )}

                <span className="sr-only sm:not-sr-only">
                  {evento.visible ? "Visible" : "Oculto"}
                </span>
              </button>
            </form>

            <Link
              href={`/admin/eventos/${evento.id}/editar`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar
              <span className="sr-only">{evento.title}</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}