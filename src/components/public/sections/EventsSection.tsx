import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getEvents } from "@/services/events.service";
import { ROUTES } from "@/constants/routes";
import { EventCarousel } from "../events/EventCarousel";
import { Reveal } from "../motion/Reveal";

/** Cuántos eventos caben en el carrusel de la portada; el resto, en "Ver todos". */
const MAX_EN_CARRUSEL = 6;

export async function EventsSection() {
  const todos = await getEvents();
  // Los finalizados no son "próximos": se quedan fuera del carrusel
  const proximos = todos.filter((e) => e.status !== "finalizado").slice(0, MAX_EN_CARRUSEL);

  // Si no hay ninguno próximo, se muestra el último que se realizó para que la
  // sección no quede vacía (siempre que exista alguno)
  const ultimo = todos
    .filter((e) => e.status === "finalizado")
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`))[0];

  const mostrandoPasado = proximos.length === 0 && !!ultimo;
  const events = mostrandoPasado ? [ultimo] : proximos;

  const heading = (
    <div>
      <p className="text-sm font-semibold tracking-[0.14em] text-violet uppercase">Agenda UGB Plus</p>
      <h2 id="eventos-titulo" className="mt-1 text-[clamp(1.75rem,3.4vw,2.4rem)] leading-tight font-bold tracking-[-0.02em] text-white">
        {mostrandoPasado ? "Nuestro último evento" : "Próximos eventos"}
      </h2>
    </div>
  );

  return (
    <section id="eventos" aria-labelledby="eventos-titulo" className="py-16 lg:py-24">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-brand opacity-20 blur-3xl" />

          <div className="relative">
            {events.length > 0 ? (
              <EventCarousel events={events} titleId="eventos-titulo" heading={heading} past={mostrandoPasado} />
            ) : (
              <>
                {heading}
                <p className="mt-6 text-white/70">Pronto anunciaremos nuevos eventos. ¡Vuelve a visitarnos!</p>
              </>
            )}

            <div className="mt-6 flex justify-center">
              <Link
                href={ROUTES.events}
                className="group/all inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/80 px-6 font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-ink"
              >
                Ver todos los eventos
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/all:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
