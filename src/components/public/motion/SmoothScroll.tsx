"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollToSection } from "@/hooks/useScrollToSection";

gsap.registerPlugin(ScrollTrigger);

/** Hace que Lenis avance con el reloj de GSAP y avise a ScrollTrigger en cada scroll. */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

/**
 * Enlaces a secciones de la misma página (/#contacto): desplaza hasta la sección
 * dejando libre la altura del header fijo, y actualiza la URL para poder compartirla.
 */
function AnchorScroll() {
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;

      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;

      e.preventDefault();
      if (location.hash !== url.hash) history.pushState(null, "", url.hash);
      scrollToSection(id);
    };

    // Fase de captura: se ejecuta antes que el manejador de next/link
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [scrollToSection]);

  return null;
}

/**
 * Scroll suave (Lenis) sincronizado con GSAP ScrollTrigger.
 * Si el usuario pidió "reducir movimiento" en su sistema, se usa el scroll nativo.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduceMotion ? (
        <>
          <AnchorScroll />
          {children}
        </>
      ) : (
        <ReactLenis root options={{ autoRaf: false, lerp: 0.1 }}>
          <LenisGsapSync />
          <AnchorScroll />
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
