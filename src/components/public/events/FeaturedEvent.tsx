import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Ticket, type LucideIcon } from "lucide-react";
import { formatLongDate } from "@/lib/dates";
import { formatEventPrice } from "@/lib/format-event";
import { EVENT_STATUS_LABELS, type UgbEvent } from "@/types/event.types";
import { EventStatus } from "./EventStatus";

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
export function FeaturedEvent({ event }: { event: UgbEvent }) {
  const url = event.registrationUrl;
  const esExterno = url?.startsWith("http") ?? false;
  const esFormulario = url ? /forms\.(cloud\.microsoft|office\.com|gle)/.test(url) : false;

  const datos: { icon: LucideIcon; label: string; value: string }[] = [
    ...(event.date ? [{ icon: CalendarDays, label: "Fecha", value: formatLongDate(event.date) }] : []),
    ...(event.time ? [{ icon: Clock, label: "Hora", value: formatTime(event.time) }] : []),
    { icon: MapPin, label: "Dónde", value: event.location || event.modality },
    { icon: Ticket, label: "Costo", value: formatEventPrice(event.price) },
  ];

  return (
    <article className="mb-14 grid items-center gap-8 lg:mb-16 lg:grid-cols-2 lg:gap-12">
      {event.image && (
        <div className="border-2 border-white/80 shadow-[10px_10px_0_var(--color-violet)]">
          <Image
            src={event.image}
            alt={event.imageAlt}
            width={1280}
            height={720}
            preload
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="block h-auto w-full"
          />
        </div>
      )}

      <div>
        <div className="flex flex-wrap items-center gap-3">
          {/* El estado manual manda; si sigue abierto, se muestra la cuenta atrás */}
          {event.status === "abierto" ? (
            <EventStatus date={event.date} />
          ) : (
            <span className="inline-block rounded-full bg-white/15 px-3.5 py-1 text-sm font-bold text-white/70">
              {EVENT_STATUS_LABELS[event.status]}
            </span>
          )}
          <p className="text-xs font-bold tracking-[0.14em] text-violet uppercase">{event.type}</p>
        </div>

        <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-extrabold tracking-[-0.02em] text-white">
          {event.title}
        </h3>
        <p className="mt-2 leading-relaxed text-white/75">{event.description}</p>

        <dl className="mt-7 grid gap-3.5 sm:grid-cols-2">
          {datos.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-violet">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs leading-tight text-white/60">{label}</dt>
                <dd className="font-semibold text-white">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {url && (
          <>
            <Link
              href={url}
              {...(esExterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group/cta mt-8 inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-7 font-bold text-ink transition-transform duration-200 hover:-translate-y-0.5"
            >
              Inscribirme
              <span className="sr-only">
                en {event.title}
                {esExterno && " (se abre en una pestaña nueva)"}
              </span>
              <ArrowRight className="size-5 transition-transform duration-200 group-hover/cta:translate-x-1" aria-hidden="true" />
            </Link>

            {/* Avisar a dónde lleva el enlace evita sorpresas al salir del sitio */}
            {esFormulario && <p className="mt-3 text-sm text-white/60">Te llevamos a un formulario externo para completar tu inscripción.</p>}
          </>
        )}
      </div>
    </article>
  );
}
