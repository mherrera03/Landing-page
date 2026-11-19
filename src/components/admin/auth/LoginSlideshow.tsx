"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Fotos del panel del login. Son decorativas (van detrás del degradado de
 * marca, que las tiñe), por eso el contenedor es aria-hidden y el alt va
 * vacío: describirlas solo añadiría ruido a un lector de pantalla.
 *
 * Vienen de las fotografías del cliente, ya recortadas a vertical y
 * convertidas a webp. Para cambiarlas basta con reemplazar esta lista y
 * dejar los archivos en public/images/login.
 */
const FOTOS = [
  "/images/login/entrega-diplomas.webp",
  "/images/login/trabajo-de-campo.webp",
  "/images/login/ponencia.webp",
  "/images/login/grupo-institucional.webp",
  "/images/login/stand-ugb-plus.webp",
  "/images/login/ceremonia-cierre.webp",
];

/** Cuánto se queda cada foto antes de pasar a la siguiente. */
const INTERVALO_MS = 6000;

/**
 * El ancho real de los archivos. Sin esto, `sizes` haría que Next pidiera la
 * imagen a 3840 px: trabajo y bytes de más para una foto que acaba teñida.
 */
const ANCHO_MAXIMO = 950;

export function LoginSlideshow() {
  const [actual, setActual] = useState(0);
  // Las seis fotos juntas pesan casi medio mega. Al cargar solo se montan la
  // primera y la siguiente; las demás entran conforme les toca el turno, que
  // es justo cuando hacen falta.
  const [montadas, setMontadas] = useState(2);

  useEffect(() => {
    // Si el sistema pide reducir el movimiento, no se pasan solas: se queda la
    // primera. Un fondo que cambia cada 6 segundos es justo lo que molesta a
    // quien activa esa opción.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      setActual((i) => (i + 1) % FOTOS.length);
      // Una más en cada vuelta: así la siguiente siempre está cargada antes de
      // que le toque, sin pedir las seis de golpe al abrir la página.
      setMontadas((m) => Math.min(m + 1, FOTOS.length));
    }, INTERVALO_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
      {FOTOS.slice(0, montadas).map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes={`(min-width: 1024px) ${ANCHO_MAXIMO}px, 100vw`}
          preload={i === 0}
          className={cn(
            "object-cover transition-opacity duration-1000 ease-out",
            i === actual ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </div>
  );
}
