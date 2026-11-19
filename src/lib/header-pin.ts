/**
 * Mantiene visible el header mientras la página se desplaza sola.
 *
 * En móvil el header se oculta al bajar. Al tocar un enlace del menú, la página
 * baja hasta la sección y el header se escondería, dejando una franja vacía
 * arriba (el destino se calcula contando su altura). Mientras dure ese
 * desplazamiento automático, el header no se oculta.
 */
let fijadoHasta = 0;

/** Impide ocultar el header durante `ms` milisegundos. */
export function pinHeader(ms: number): void {
  fijadoHasta = performance.now() + ms;
}

export function isHeaderPinned(): boolean {
  return performance.now() < fijadoHasta;
}
