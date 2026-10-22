
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  MapPin,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

import { formatLongDate } from "@/lib/dates";
import type { UgbEvent, EventType } from "@/types/event.types";

const ICONS: Record<EventType, LucideIcon> = {
  Masterclass: Megaphone,
  Taller: CalendarDays,
  Webinar: Building2,
  Conferencia: Megaphone,
};

export function EventCard({ event }: { event: UgbEvent }) {
  const Icon = ICONS[event.type] ?? CalendarDays;
  const url = event.registrationUrl;
  const esExterno = url?.startsWith("http") ?? false;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-white/[0.06] transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1]">

      {/* Imagen del evento */}
      {event.image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-white/5">
          <Image
            src={event.image}
            alt={event.imageAlt || event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
            <Icon className="size-5" aria-hidden="true" />
          </span>

          <p className="text-xs font-bold tracking-[0.14em] text-violet uppercase">
            {event.type}
          </p>
        </div>

        {(event.date || event.location) && (
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-white/60">
            {event.date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" aria-hidden="true" />
                <time dateTime={event.date}>
                  {formatLongDate(event.date)}
                </time>
              </span>
            )}

            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden="true" />
                {event.location}
              </span>
            )}
          </p>
        )}

        <h3 className="mt-3 text-xl font-bold text-white">
          {event.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-white/70">
          {event.description}
        </p>

        {url && (
          <Link
            href={url}
            {...(esExterno
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 text-sm font-bold text-violet transition-colors duration-200 hover:text-white"
          >
            Más información
            <span className="sr-only">sobre {event.title}</span>
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </article>
  );
}
