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

/** "2026-11-15" -> "15 nov", para espacios reducidos. */
export function formatShortDate(isoDate: string): string {
  const [, month, day] = isoDate.split("-").map(Number);
  if (!month || !day) return isoDate;
  return `${day} ${MESES[month - 1].slice(0, 3)}`;
}
