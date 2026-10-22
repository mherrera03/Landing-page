"use client";

import { useSyncExternalStore } from "react";

const TZ = "America/El_Salvador";

/** Fecha de hoy en El Salvador, como "AAAA-MM-DD". */
function todayInSV(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

/** Días entre hoy y la fecha del evento. Negativo si ya pasó. */
function daysUntil(isoDate: string): number {
  const [y1, m1, d1] = isoDate.split("-").map(Number);
  const [y2, m2, d2] = todayInSV().split("-").map(Number);
  return Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86_400_000);
}

// Sin suscripción: solo sirve para distinguir servidor de navegador
const subscribe = () => () => {};

/**
 * "Hoy", "Mañana", "En 5 días" o "Finalizado".
 *
 * Se calcula en el navegador a propósito: la landing se genera de forma
 * estática, así que calcularlo en el servidor dejaría el texto congelado
 * en la fecha de la última compilación.
 */
export function EventStatus({ date }: { date: string }) {
  const enNavegador = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!enNavegador) return null;

  const dias = daysUntil(date);
  const label = dias < 0 ? "Finalizado" : dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`;
  const finalizado = dias < 0;

  return (
    <span
      className={
        finalizado
          ? "inline-block rounded-full bg-white/15 px-3.5 py-1 text-sm font-bold text-white/70"
          : "inline-block rounded-full bg-brand px-3.5 py-1 text-sm font-bold text-ink"
      }
    >
      {label}
    </span>
  );
}
