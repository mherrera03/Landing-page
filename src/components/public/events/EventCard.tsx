import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, MapPin, Megaphone, type LucideIcon } from "lucide-react";
import { formatLongDate } from "@/lib/dates";
import type { EventItem, EventKind } from "@/types/event.types";

const ICONS: Record<EventKind, LucideIcon> = {
  masterclass: Megaphone,
  novedad: CalendarDays,
  empresas: Building2,
};

export function EventCard({ event }: { event: EventItem }) {
  const Icon = ICONS[event.kind];
  // Los enlaces externos abren en otra pestaña; los del propio sitio, no
  const esExterno = event.link.startsWith("http");

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-white/12 bg-white/[0.06] p-6 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1]">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <p className="text-xs font-bold tracking-[0.14em] text-violet uppercase">{event.tag}</p>
      </div>

      {(event.date || event.place) && (
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/60">
          {event.date && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              <time dateTime={event.date}>{formatLongDate(event.date)}</time>
            </span>
          )}
          {event.place && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden="true" />
              {event.place}
            </span>
          )}
        </p>
      )}

      <h3 className="mt-3 text-xl font-bold text-white">{event.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{event.description}</p>

      {event.link && (
        <Link
          href={event.link}
          {...(esExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-bold text-violet transition-colors duration-200 hover:text-white"
        >
          {event.linkText || "Más información"}
          <span className="sr-only">sobre {event.title}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </article>
  );
}
