import Image from "next/image";
import { CalendarDays, Clock, Ticket } from "lucide-react";
import type { EventItem } from "@/types/event.types";

const TZ = "America/El_Salvador";

function formatDate(iso: string) {
  const s = new Intl.DateTimeFormat("es-SV", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ,
  }).format(new Date(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("es-SV", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ,
  }).format(new Date(iso));
}

function getStatus(iso: string) {
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
  const diff = Math.round((Date.parse(day(new Date(iso))) - Date.parse(day(new Date()))) / 864e5);
  if (diff < 0) return "Finalizado";
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Mañana";
  return `En ${diff} días`;
}

export function FeaturedEvent({ event }: { event: EventItem }) {
  if (!event.startsAt || !event.image) return null;

  const rows = [
    { Icon: CalendarDays, label: "Fecha", value: formatDate(event.startsAt) },
    { Icon: Clock, label: "Hora", value: formatTime(event.startsAt) },
    ...(event.price ? [{ Icon: Ticket, label: "Costo", value: event.price }] : []),
  ];

  return (
    <article className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
      <div className="border-2 border-white/80 shadow-[10px_10px_0_var(--color-violet)]">
        <Image
          src={event.image}
          alt={`Afiche: ${event.title}. ${event.description}`}
          width={1280}
          height={720}
          className="block h-auto w-full"
          priority
        />
      </div>

      <div>
        <span className="bg-brand inline-block rounded-full px-3.5 py-1 text-sm font-bold text-ink">
          {getStatus(event.startsAt)}
        </span>
        <h3 className="mt-4 text-3xl font-bold text-white">{event.title}</h3>
        <p className="mt-2 text-white/70">{event.description}</p>

        <dl className="mt-7 grid gap-3.5">
          {rows.map(({ Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs leading-tight text-white/60">{label}</dt>
                <dd className="font-semibold text-white">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {event.registrationUrl && (
          <>
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand mt-8 inline-flex min-h-12 items-center rounded-xl px-7 font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              Inscríbete gratis
            </a>
            <p className="mt-3 text-sm text-white/60">Te llevamos a un formulario de Microsoft Forms.</p>
          </>
        )}
      </div>
    </article>
  );
}