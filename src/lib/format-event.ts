/** "2026-10-08" → "jueves, 8 de octubre de 2026" */
export function formatEventDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-SV", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * "19:00" → "7:00 p. m."
 *
 * Se arma a mano (sin toLocaleTimeString) para que servidor y navegador den el
 * mismo texto y React no avise de diferencias al hidratar.
 */
export function formatEventTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

export function formatEventPrice(price?: number): string {
  return price === undefined || price === 0 ? "Gratis" : `$${price.toFixed(2)}`;
}
