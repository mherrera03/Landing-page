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

/**
 * "2026-11-15" -> "15 de noviembre de 2026".
 *
 * Se construye a mano en vez de usar toLocaleDateString para que el servidor y
 * el navegador den exactamente el mismo texto (si no, React avisa de hidratación).
 * También evita el desfase de un día que provoca interpretar la fecha como UTC.
 */
export function formatLongDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day} de ${MESES[month - 1]} de ${year}`;
}

/**
 * "2026-11-15 14:30:00" -> "15 de noviembre de 2026, 2:30 p. m."
 *
 * Es el formato con el que SQLite guarda las fechas (datetime local).
 */
export function formatDateTime(value: string): string {
  const [fecha, hora = ""] = value.split(" ");
  const texto = formatLongDate(fecha);
  const [h, m] = hora.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return texto;

  const sufijo = h < 12 ? "a. m." : "p. m.";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${texto}, ${hora12}:${String(m).padStart(2, "0")} ${sufijo}`;
}

/** "2026-11-15" -> "15 nov", para espacios reducidos. */
export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  if (!month || !day) return isoDate;
  return `${day} ${MESES[month - 1].slice(0, 3)}`;
}
