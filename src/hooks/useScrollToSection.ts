"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Aire que queda entre el header y el contenido de la sección. */
const AIRE = 0;

/** Dónde debe quedar el scroll para que la sección empiece justo bajo el header. */
function destino(target: HTMLElement): number {
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;

  // Las secciones llevan un relleno superior amplio para separarse entre sí.
  // Si el scroll frena en su borde, ese relleno queda a la vista como una
  // franja vacía bajo el header, así que se descuenta: la sección arranca
  // donde empieza su contenido, no donde empieza su caja.
  const relleno = parseFloat(getComputedStyle(target).paddingTop) || 0;

  return relleno - header - AIRE;
}

/** Desplaza hasta una sección por su id, dejando libre la altura del header fijo. */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      const offset = destino(target);

      if (lenis) {
        lenis.scrollTo(target, { offset });
      } else {
        // Sin Lenis (el usuario pidió reducir movimiento): salto nativo
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: Math.max(top, 0) });
      }
    },
    [lenis],
  );
}
