import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { formatLongDate } from "@/lib/dates";
import type { EventItem } from "@/types/event.types";

/** "19:00" -> "7:00 p. m." */
function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/**
 * Evento destacado: banner grande con los datos en texto al lado.
 *
 * El texto va aparte de la imagen a propósito. Los banners traen el título y la
 * fecha "dibujados" dentro, y eso no se puede leer en un móvil pequeño, no lo
 * encuentra Google y no lo anuncian los lectores de pantalla.
 */
export function FeaturedEvent({ event }: { event: EventItem }) {
  const esExterno = event.link.startsWith("http");

  return (
    <article className="mb-5 overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07]">
      {/* grid-cols-2 de Tailwind usa minmax(0,1fr): sin eso la imagen no deja
          encoger su columna y se come el espacio del texto. */}
      <div className="grid lg:grid-cols-2">
        {event.image && (
          <div className="relative aspect-video w-full">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              preload
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-bold tracking-[0.14em] text-violet uppercase">{event.tag}</p>

          <h3 className="text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-extrabold tracking-[-0.02em] text-white">
            {event.title}
          </h3>

          {(event.date || event.time || event.place) && (
            <ul className="flex flex-wrap gap-2">
              {event.date && (
                <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white">
                  <CalendarDays className="size-4 shrink-0 text-violet" aria-hidden="true" />
                  <time dateTime={event.date}>{formatLongDate(event.date)}</time>
                </li>
              )}
              {event.time && (
                <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white">
                  <Clock className="size-4 shrink-0 text-violet" aria-hidden="true" />
                  {formatTime(event.time)}
                </li>
              )}
              {event.place && (
                <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white">
                  <MapPin className="size-4 shrink-0 text-violet" aria-hidden="true" />
                  {event.place}
                </li>
              )}
            </ul>
          )}

          <p className="leading-relaxed text-white/75">{event.description}</p>

          {event.link && (
            <Link
              href={event.link}
              {...(esExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group/cta mt-1 inline-flex min-h-13 w-fit items-center gap-2 rounded-full bg-white px-7 font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              {event.linkText || "Inscribirme"}
              <span className="sr-only">
                en {event.title}
                {esExterno && " (se abre en una pestaña nueva)"}
              </span>
              <ArrowRight className="size-5 transition-transform duration-200 group-hover/cta:translate-x-1" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
