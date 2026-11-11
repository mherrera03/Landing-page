import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getVisibleEventBySlug } from "@/server/database/repositories/events.repository";
import { formatLongDate, isPastEvent, todayInElSalvador } from "@/lib/dates";
import { formatEventPrice, formatEventTime } from "@/lib/format-event";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getVisibleEventBySlug((await params).slug);
  return { title: event?.title ?? "Evento no encontrado", description: event?.description };
}

export default async function EventPage({ params }: Props) {
  const event = getVisibleEventBySlug((await params).slug);
  if (!event) notFound();
  const past = isPastEvent(event, todayInElSalvador());
  const external = event.registrationUrl?.startsWith("http");

  return (
    <article className="container-page py-10 lg:py-16">
      <Link href="/eventos" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-deep"><ArrowLeft className="size-4" />Volver a eventos</Link>
      <div className="mt-5 grid overflow-hidden rounded-3xl bg-ink text-white shadow-soft lg:grid-cols-2">
        <div className="relative min-h-64 bg-ink-soft lg:min-h-120">
          {event.image ? <Image src={event.image} alt={event.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /> : <div className="grid h-full place-items-center"><CalendarDays className="size-16 text-white/40" /></div>}
        </div>
        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold tracking-widest text-violet uppercase">{event.type}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{event.title}</h1>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-white/75">{event.description}</p>
          <dl className="mt-7 grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-2">
            <div><dt className="text-sm text-white/60">Fecha y hora</dt><dd><time dateTime={`${event.date}T${event.time}`}>{formatLongDate(event.date)}, {formatEventTime(event.time)}</time></dd></div>
            <div><dt className="text-sm text-white/60">Modalidad</dt><dd>{event.modality}</dd></div>
            <div><dt className="text-sm text-white/60">Lugar</dt><dd>{event.location || "Por confirmar"}</dd></div>
            <div><dt className="text-sm text-white/60">Costo</dt><dd>{formatEventPrice(event.price)}</dd></div>
          </dl>
          {past ? <p className="mt-8 inline-flex rounded-full bg-white/15 px-5 py-2 font-semibold">Finalizado</p> : event.registrationUrl && <Link href={event.registrationUrl} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-8 inline-flex min-h-11 items-center rounded-full bg-white px-6 font-semibold text-ink hover:bg-paper">Inscribirme</Link>}
        </div>
      </div>
    </article>
  );
}
