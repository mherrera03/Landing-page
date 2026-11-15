import type { UgbEvent } from "@/types/event.types";

/** Criterio compartido entre el inicio, el listado y la ficha del evento. */
export function isPastEvent(event: Pick<UgbEvent, "date" | "status">, today: string): boolean {
  return event.status === "finalizado" || event.date < today;
}

/** Fecha y hora juntas ordenan igual como texto que como fecha. */
const byDate = (a: UgbEvent, b: UgbEvent) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);

/** Separa los eventos en próximos (el más cercano primero) y pasados (el más reciente primero). */
export function splitEvents(events: UgbEvent[], today: string): { upcoming: UgbEvent[]; past: UgbEvent[] } {
  return {
    upcoming: events.filter((event) => !isPastEvent(event, today)).sort(byDate),
    past: events.filter((event) => isPastEvent(event, today)).sort((a, b) => byDate(b, a)),
  };
}

export function formatEventPrice(price?: number): string {
  return price === undefined || price === 0 ? "Gratis" : `$${price.toFixed(2)}`;
}
