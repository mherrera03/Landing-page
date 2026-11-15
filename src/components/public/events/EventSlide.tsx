import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Ticket, type LucideIcon } from "lucide-react";
import { formatShortDate, formatTime } from "@/lib/dates";
import { formatEventPrice } from "@/lib/events";
import type { UgbEvent } from "@/types/event.types";
import { EventStatus } from "./EventStatus";
import { RegisterLink } from "./RegisterLink";

type EventSlideProps = {
  event: UgbEvent;
  /** Carga la imagen con prioridad (solo la primera diapositiva). */
  priority?: boolean;
  /** El evento ya se realizó: no se ofrece inscripción. */
  past?: boolean;
};

/**
 * Una diapositiva del carrusel de eventos: flyer a la izquierda y los datos en
 * texto a la derecha.
 *
 * Los datos van aparte del flyer a propósito: lo que viene "dibujado" en la
 * imagen no se lee bien en móvil, no lo encuentra Google y no lo anuncian los
 * lectores de pantalla.
 */
export function EventSlide({ event, priority = false, past = false }: EventSlideProps) {
  const datos: { icon: LucideIcon; label: string; value: string }[] = [
    // "15 nov 2026"
    { icon: CalendarDays, label: "Fecha", value: `${formatShortDate(event.date)} ${event.date.slice(0, 4)}` },
    { icon: Clock, label: "Hora", value: formatTime(event.time) },
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
          <EventStatus event={event} past={past} />
          <p className="text-sm font-semibold tracking-[0.12em] text-violet uppercase">{event.type}</p>
        </div>

        <h3 className="mt-3 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-tight font-bold text-white">{event.title}</h3>
        <Link
          href={`/eventos/${event.slug}`}
          className="mt-2 inline-flex min-h-9 items-center text-sm font-semibold text-white underline-offset-4 hover:underline"
        >
          Ver detalles del evento
        </Link>
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

        {/* Inscribirse a un evento que ya pasó no tiene sentido */}
        {!past && (
          <RegisterLink
            event={event}
            className="group/cta mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
          >
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" aria-hidden="true" />
          </RegisterLink>
        )}
      </div>
    </article>
  );
}
