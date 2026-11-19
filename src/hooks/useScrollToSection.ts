"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";
import { pinHeader } from "@/lib/header-pin";

/** Dónde debe quedar el scroll para que la sección empiece justo bajo el header. */
function destino(target: HTMLElement): number {
  const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;

  // Las secciones llevan un relleno superior amplio para separarse entre sí.
  // Si el scroll frena en su borde, ese relleno queda a la vista como una
  // franja vacía bajo el header, así que se descuenta: la sección arranca
  // donde empieza su contenido, no donde empieza su caja.
  const relleno = parseFloat(getComputedStyle(target).paddingTop) || 0;

  return relleno - header;
}

/** Desplaza hasta una sección por su id, dejando libre la altura del header fijo. */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;

      // Se pasa la posición exacta en píxeles, no el elemento: con un elemento,
      // Lenis descuenta además el scroll-padding-top del CSS (que ya incluye el
      // header) y la sección quedaba 88 px más abajo de lo debido.
      const top = Math.max(target.getBoundingClientRect().top + window.scrollY + destino(target), 0);

      if (lenis) {
        // Se fija con margen por si el desplazamiento se interrumpe; al terminar se suelta
        pinHeader(2500);
        lenis.scrollTo(top, { onComplete: () => pinHeader(200) });
      } else {
        pinHeader(300);
        // Sin Lenis (el usuario pidió reducir movimiento): salto nativo
        window.scrollTo({ top });
      }
    },
    [lenis],
  );
}
