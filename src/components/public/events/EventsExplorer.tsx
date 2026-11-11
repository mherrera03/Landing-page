"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { EVENT_TYPES, type EventType, type UgbEvent } from "@/types/event.types";
import { EventListCard } from "./EventListCard";

/** Cuántas tarjetas se muestran de entrada y cuántas más con cada "Cargar más". */
const POR_PAGINA = 6;

type Pestana = "proximos" | "pasados";

const PESTANAS: { id: Pestana; label: string }[] = [
  { id: "proximos", label: "Próximos" },
  { id: "pasados", label: "Pasados" },
];

/**
 * Lista de /eventos con pestañas (próximos/pasados), filtro por tipo y "Cargar más".
 *
 * La separación entre próximos y pasados ya viene hecha del servidor; aquí solo
 * se filtra y se pagina lo que ya está en memoria.
 */
export function EventsExplorer({ upcoming, past }: { upcoming: UgbEvent[]; past: UgbEvent[] }) {
  const [pestana, setPestana] = useState<Pestana>("proximos");
  const [tipo, setTipo] = useState<EventType | null>(null);
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const lista = pestana === "proximos" ? upcoming : past;
  // Solo se ofrecen los tipos que de verdad tienen eventos en la pestaña actual
  const tipos = EVENT_TYPES.filter((t) => lista.some((e) => e.type === t));
  const filtrados = tipo ? lista.filter((e) => e.type === tipo) : lista;
  const mostrados = filtrados.slice(0, visibles);

  function cambiarPestana(p: Pestana) {
    setPestana(p);
    setTipo(null);
    setVisibles(POR_PAGINA);
  }

  function cambiarTipo(t: EventType | null) {
    setTipo(t);
    setVisibles(POR_PAGINA);
  }

  const chip = (activo: boolean) =>
    cn(
      "inline-flex min-h-8 items-center rounded-full border px-3.5 text-sm transition-colors duration-200",
      activo ? "border-violet bg-violet/15 text-white" : "border-white/30 text-white/80 hover:border-white/60 hover:text-white",
    );

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full bg-white/[0.07] p-1" role="group" aria-label="Mostrar eventos">
          {PESTANAS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => cambiarPestana(id)}
              aria-pressed={pestana === id}
              className={cn(
                "min-h-8 rounded-full px-4 text-sm font-medium transition-colors duration-200",
                pestana === id ? "bg-white text-ink" : "text-white/80 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {tipos.length > 1 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
            <button type="button" onClick={() => cambiarTipo(null)} aria-pressed={tipo === null} className={chip(tipo === null)}>
              Todos
            </button>
            {tipos.map((t) => (
              <button key={t} type="button" onClick={() => cambiarTipo(t)} aria-pressed={tipo === t} className={chip(tipo === t)}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {mostrados.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mostrados.map((event) => (
            <li key={event.id}>
              <EventListCard event={event} past={pestana === "pasados"} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl bg-white/[0.05] px-6 py-12 text-center text-white/70">
          {pestana === "proximos"
            ? "Por ahora no hay eventos programados. Pronto anunciaremos nuevas fechas."
            : "Todavía no hay eventos pasados para mostrar."}
        </p>
      )}

      {filtrados.length > visibles && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibles((v) => v + POR_PAGINA)}
            className="inline-flex min-h-11 items-center rounded-full border border-white/80 px-6 font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-ink"
          >
            Cargar más
          </button>
        </div>
      )}

      {/* Anuncia a los lectores de pantalla cuántos eventos hay tras filtrar o cargar más */}
      <p className="sr-only" aria-live="polite">
        Mostrando {mostrados.length} de {filtrados.length} eventos.
      </p>
    </>
  );
}
