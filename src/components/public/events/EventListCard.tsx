import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { formatShortDate } from "@/lib/dates";
import { formatEventTime } from "@/lib/format-event";
import type { UgbEvent } from "@/types/event.types";

/** Tarjeta compacta de la página /eventos: flyer, tipo, título y una línea de datos. */
export function EventListCard({ event, past = false }: { event: UgbEvent; past?: boolean }) {
  const url = event.registrationUrl;
  const esExterno = url?.startsWith("http") ?? false;

  // "15 nov · 7:00 p. m. · En línea"
  const datos = [
    event.date && formatShortDate(event.date),
    event.time && formatEventTime(event.time),
    event.location || event.modality,
  ].filter(Boolean);

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white/[0.05] p-2.5 transition-colors duration-200 hover:bg-white/[0.08]">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink-soft">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.imageAlt || event.title}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className={past ? "object-cover opacity-70 grayscale-[40%]" : "object-cover"}
          />
        ) : (
          <div className="grid h-full place-items-center text-white/35">
            <CalendarDays className="size-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pt-4 pb-1.5">
        <p className="text-sm font-semibold tracking-[0.12em] text-violet uppercase">{event.type}</p>
        <h3 className="mt-1 text-lg leading-snug font-bold text-white">{event.title}</h3>
        <p className="mt-0.5 text-sm text-white/65">
          {event.date ? <time dateTime={event.date}>{datos.join(" · ")}</time> : datos.join(" · ")}
        </p>

        {/* Inscribirse a un evento que ya pasó no tiene sentido */}
        {url && !past && (
          <div className="mt-auto pt-3">
            <Link
              href={url}
              {...(esExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex min-h-8 items-center rounded-full bg-white px-3.5 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              Inscribirme
              <span className="sr-only">
                {" "}
                en {event.title}
                {esExterno && " (se abre en una pestaña nueva)"}
              </span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
