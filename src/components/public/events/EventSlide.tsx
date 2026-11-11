import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Ticket, type LucideIcon } from "lucide-react";
import { formatShortDate } from "@/lib/dates";
import { formatEventPrice, formatEventTime } from "@/lib/format-event";
import { EVENT_STATUS_LABELS, type UgbEvent } from "@/types/event.types";
import { EventStatus } from "./EventStatus";

/** "2026-11-15" -> "15 nov 2026" */
function fechaCorta(isoDate: string): string {
  return `${formatShortDate(isoDate)} ${isoDate.slice(0, 4)}`;
}

/**
 * Una diapositiva del carrusel de eventos: flyer a la izquierda y los datos en
 * texto a la derecha.
 *
 * Los datos van aparte del flyer a propósito: lo que viene "dibujado" en la
 * imagen no se lee bien en móvil, no lo encuentra Google y no lo anuncian los
 * lectores de pantalla.
 */
type EventSlideProps = {
  event: UgbEvent;
  /** Carga la imagen con prioridad (solo la primera diapositiva). */
  priority?: boolean;
  /** El evento ya se realizó: no se ofrece inscripción. */
  past?: boolean;
};

export function EventSlide({ event, priority = false, past = false }: EventSlideProps) {
  const url = event.registrationUrl;
  const esExterno = url?.startsWith("http") ?? false;

  const datos: { icon: LucideIcon; label: string; value: string }[] = [
    ...(event.date ? [{ icon: CalendarDays, label: "Fecha", value: fechaCorta(event.date) }] : []),
    ...(event.time ? [{ icon: Clock, label: "Hora", value: formatEventTime(event.time) }] : []),
    { icon: MapPin, label: "Dónde", value: event.location || event.modality },
    { icon: Ticket, label: "Costo", value: formatEventPrice(event.price) },
  ];

  return (
    <article className="grid items-center gap-6 md:grid-cols-[1.15fr_1fr] md:gap-8">
      {/* Flyer */}
      <div className="relative aspect-video overflow-hidden rounded-2xl border-b-[6px] border-violet bg-ink-soft">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.imageAlt || event.title}
            fill
            preload={priority}
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 55vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-white/40">
            <CalendarDays className="size-12" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Datos */}
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* El estado manual manda; si sigue abierto, se muestra la cuenta atrás */}
          {event.status === "abierto" ? (
            <EventStatus date={event.date} />
          ) : (
            <span className="inline-block rounded-full bg-white/15 px-3 py-0.5 text-sm font-semibold text-white/75">
              {EVENT_STATUS_LABELS[event.status]}
            </span>
          )}
          <p className="text-sm font-semibold tracking-[0.12em] text-violet uppercase">{event.type}</p>
        </div>

        <h3 className="mt-3 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-tight font-bold text-white">{event.title}</h3>
        <p className="mt-2 line-clamp-2 leading-relaxed text-white/70">{event.description}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
          {datos.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-center gap-2">
              <dt className="shrink-0 text-white/70">
                <Icon className="size-4" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </dt>
              <dd className="truncate text-white/85">{value}</dd>
            </div>
          ))}
        </dl>

        {url && !past && (
          <Link
            href={url}
            {...(esExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group/cta mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
          >
            Inscribirme
            <span className="sr-only">
              en {event.title}
              {esExterno && " (se abre en una pestaña nueva)"}
            </span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
