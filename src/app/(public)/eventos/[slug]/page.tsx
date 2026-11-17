import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { formatLongDate, formatTime, todayInElSalvador } from "@/lib/dates";
import { formatEventPrice, isPastEvent } from "@/lib/events";
import { findVisibleBySlug } from "@/server/database/repositories/events.repository";
import { EVENT_STATUS_LABELS } from "@/types/event.types";
import { RegisterLink } from "@/components/public/events/RegisterLink";
import { BackLink } from "@/components/public/layout/BackLink";

// Los metadatos y la página piden el mismo evento: con cache se consulta una sola vez por visita
const getEvent = cache(findVisibleBySlug);

export async function generateMetadata({ params }: PageProps<"/eventos/[slug]">): Promise<Metadata> {
  const event = await getEvent((await params).slug);
  return { title: event?.title ?? "Evento no encontrado", description: event?.description };
}

export default async function EventPage({ params }: PageProps<"/eventos/[slug]">) {
  const event = await getEvent((await params).slug);
  if (!event) notFound();

  const past = isPastEvent(event, todayInElSalvador());

  return (
    <article className="container-page py-10 lg:py-16">
      <BackLink href="/eventos">Volver a eventos</BackLink>

      <div className="mt-5 grid overflow-hidden rounded-3xl bg-ink text-white shadow-soft lg:grid-cols-2">
        <div className="relative min-h-64 bg-ink-soft lg:min-h-120">
          {event.image ? (
            <Image src={event.image} alt={event.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center">
              <CalendarDays className="size-16 text-white/40" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold tracking-widest text-violet uppercase">{event.type}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{event.title}</h1>
          <p className="mt-5 leading-relaxed whitespace-pre-line text-white/75">{event.description}</p>

          <dl className="mt-7 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-white/60">Fecha y hora</dt>
              <dd>
                <time dateTime={`${event.date}T${event.time}`}>
                  {formatLongDate(event.date)}, {formatTime(event.time)}
                </time>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Modalidad</dt>
              <dd>{event.modality}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Lugar</dt>
              <dd>{event.location || "Por confirmar"}</dd>
            </div>
            <div>
              <dt className="text-sm text-white/60">Costo</dt>
              <dd>{formatEventPrice(event.price)}</dd>
            </div>
          </dl>

          {/* Inscribirse a un evento que ya pasó no tiene sentido */}
          {past ? (
            <p className="mt-8 inline-flex rounded-full bg-white/15 px-5 py-2 font-semibold">{EVENT_STATUS_LABELS.finalizado}</p>
          ) : (
            <RegisterLink
              event={event}
              className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-ink hover:bg-paper"
            />
          )}
        </div>
      </div>
    </article>
  );
}
