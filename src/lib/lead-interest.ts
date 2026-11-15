/**
 * Aviso entre dos partes de la landing que no se conocen: la ficha de un curso
 * le dice al formulario de contacto qué curso interesa, para que lo precargue.
 */
const LEAD_INTEREST_EVENT = "ugb:lead-interest";

export function announceLeadInterest(courseTitle: string): void {
  window.dispatchEvent(new CustomEvent<string>(LEAD_INTEREST_EVENT, { detail: courseTitle }));
}

/** Escucha el aviso. Devuelve la función para dejar de escuchar. */
export function onLeadInterest(handler: (courseTitle: string) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<string>).detail);
  window.addEventListener(LEAD_INTEREST_EVENT, listener);
  return () => window.removeEventListener(LEAD_INTEREST_EVENT, listener);
}
