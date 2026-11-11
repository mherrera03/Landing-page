"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UgbEvent } from "@/types/event.types";
import { EventSlide } from "./EventSlide";

type EventCarouselProps = {
  events: UgbEvent[];
  /** id del título de la sección, para nombrar el carrusel. */
  titleId: string;
  /** Kicker + título: van en la misma fila que las flechas. */
  heading: ReactNode;
  /** Los eventos ya se realizaron: se muestran sin botón de inscripción. */
  past?: boolean;
};

/**
 * Carrusel de próximos eventos.
 *
 * Usa scroll horizontal con "snap" en lugar de mover las diapositivas con
 * transform: así en el celular se puede deslizar con el dedo sin código extra,
 * y las flechas y los puntos solo hacen scroll hasta la diapositiva elegida.
 */
export function EventCarousel({ events, titleId, heading, past = false }: EventCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [actual, setActual] = useState(0);
  const total = events.length;

  function irA(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const destino = (i + total) % total; // da la vuelta al llegar a un extremo
    const sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: destino * track.clientWidth, behavior: sinAnimacion ? "auto" : "smooth" });
  }

  // La diapositiva visible se deduce del scroll, así también se actualiza al deslizar con el dedo
  function alHacerScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActual(Math.round(track.scrollLeft / track.clientWidth));
  }

  const flecha =
    "grid size-11 place-items-center rounded-full border border-white/80 text-white transition-colors duration-200 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink";

  return (
    <div aria-roledescription="carrusel" aria-labelledby={titleId}>
      <div className="mb-6 flex items-end justify-between gap-4">
        {heading}
        {total > 1 && (
          <div className="flex shrink-0 gap-3">
            <button type="button" onClick={() => irA(actual - 1)} className={flecha} aria-label="Evento anterior">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => irA(actual + 1)} className={flecha} aria-label="Evento siguiente">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <ul
        ref={trackRef}
        onScroll={alHacerScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {events.map((event, i) => (
          <li
            key={event.id}
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${total}`}
            className="w-full shrink-0 snap-start"
          >
            <EventSlide event={event} priority={i === 0} past={past} />
          </li>
        ))}
      </ul>

      {total > 1 && (
        <div className="mt-6 flex justify-center gap-1.5">
          {events.map((event, i) => (
            <button
              key={event.id}
              type="button"
              onClick={() => irA(i)}
              aria-label={`Ir al evento ${i + 1}: ${event.title}`}
              aria-current={i === actual ? "true" : undefined}
              // El área de clic es más grande que el punto que se ve
              className="grid h-6 place-items-center px-0.5"
            >
              <span
                className={cn(
                  "block h-2 rounded-full transition-all duration-300",
                  i === actual ? "w-7 bg-violet" : "w-2 bg-white/30 hover:bg-white/60",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
