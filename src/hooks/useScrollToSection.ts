"use client";

import { useCallback } from "react";
import { useLenis } from "lenis/react";

/** Desplaza hasta una sección por su id, dejando libre la altura del header fijo. */
export function useScrollToSection() {
  const lenis = useLenis();

  return useCallback(
    (id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      if (lenis) {
        const header = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
        lenis.scrollTo(target, { offset: -(header + 16) });
      } else {
        target.scrollIntoView(); // scroll-padding-top del <html> ya descuenta el header
      }
    },
    [lenis],
  );
}
