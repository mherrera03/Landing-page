"use client";

import { useSyncExternalStore } from "react";

// Sin suscripción: solo sirve para distinguir servidor de navegador
const subscribe = () => () => {};

/**
 * false en el servidor y durante la hidratación; true ya en el navegador.
 * Para lo que depende de `document` o de la hora local sin provocar
 * diferencias entre lo que pinta el servidor y lo que pinta el navegador.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
