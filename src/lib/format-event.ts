/** "2026-10-08" → "jueves, 8 de octubre de 2026" */
export function formatEventDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-SV", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "19:00" → "7:00 p. m." */
export function formatEventTime(time: string): string {
  return new Date(`1970-01-01T${time}:00`).toLocaleTimeString("es-SV", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatEventPrice(price?: number): string {
  return price === undefined || price === 0 ? "Gratis" : `$${price.toFixed(2)}`;
}
