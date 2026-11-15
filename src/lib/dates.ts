/**
 * Fechas y horas en texto.
 *
 * Se arman a mano, sin toLocaleDateString ni toLocaleTimeString, para que el
 * servidor y el navegador den exactamente el mismo resultado (si no, React
 * avisa de diferencias al hidratar). También evita el desfase de un día que
 * provoca interpretar una fecha sin hora como UTC.
 */

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** "2026-11-15" -> "15 de noviembre de 2026" */
export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day} de ${MESES[month - 1]} de ${year}`;
}

/** "2026-11-15" -> "15 nov", para espacios reducidos. */
export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  if (!month || !day) return isoDate;
  return `${day} ${MESES[month - 1].slice(0, 3)}`;
}

/** "19:00" -> "7:00 p. m." (los segundos, si vienen, se ignoran) */
export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return time;
  const sufijo = h < 12 ? "a. m." : "p. m.";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/**
 * "2026-11-15 14:30:00" -> "15 de noviembre de 2026, 2:30 p. m."
 *
 * Es el formato con el que SQLite guarda las fechas (datetime local).
 */
export function formatDateTime(value: string): string {
  const [fecha, hora] = value.split(" ");
  return hora ? `${formatLongDate(fecha)}, ${formatTime(hora)}` : formatLongDate(fecha);
}

/** Fecha de hoy en El Salvador, como "AAAA-MM-DD" (comparable como texto con las fechas de la base). */
export function todayInElSalvador(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/El_Salvador" }).format(new Date());
}

/** Fecha y hora local para comparar con los horarios de anuncios (AAAA-MM-DDTHH:mm). */
export function nowInElSalvador(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/El_Salvador",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${value("year")}-${value("month")}-${value("day")}T${value("hour")}:${value("minute")}`;
}
