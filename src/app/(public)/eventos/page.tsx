import type { Metadata } from "next";
import { connection } from "next/server";
import { getEvents } from "@/services/events.service";
import { isPastEvent, todayInElSalvador } from "@/lib/dates";
import { EventsExplorer } from "@/components/public/events/EventsExplorer";
import type { UgbEvent } from "@/types/event.types";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Masterclasses, aperturas de cohortes y programas para empresas de UGB Plus.",
};

export default async function EventsPage() {
  // Se genera en cada visita: qué evento es "próximo" depende del día de hoy,
  // y una página generada al compilar se quedaría con la fecha de ese momento.
  await connection();

  const hoy = todayInElSalvador();
  const events = await getEvents();

  const porFecha = (a: UgbEvent, b: UgbEvent) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
  const upcoming = events.filter((e) => !isPastEvent(e, hoy)).sort(porFecha);
  const past = events.filter((e) => isPastEvent(e, hoy)).sort((a, b) => porFecha(b, a)); // el más reciente primero

  return (
    <section aria-labelledby="eventos-titulo" className="py-10 lg:py-16">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand opacity-20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-semibold tracking-[0.14em] text-violet uppercase">Eventos</p>
            <h1 id="eventos-titulo" className="mt-1 text-[clamp(1.75rem,3.4vw,2.4rem)] leading-tight font-bold tracking-[-0.02em] text-white">
              Todos los eventos
            </h1>
            <p className="mt-1 mb-6 text-white/75">Masterclasses, aperturas de cohortes y programas para empresas.</p>

            <EventsExplorer upcoming={upcoming} past={past} />
          </div>
        </div>
      </div>
    </section>
  );
}
