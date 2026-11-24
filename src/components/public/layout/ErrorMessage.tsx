"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Pantalla amable para cuando algo falla al cargar (base de datos, conexión…).
 * Dice qué pasó en palabras simples y da dos salidas: reintentar o volver al inicio.
 */
export function ErrorMessage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Queda en la consola del navegador; el detalle completo está en el registro del servidor (digest)
    console.error(error);
  }, [error]);

  return (
    <section className="container-page flex min-h-[70svh] flex-col items-center justify-center py-20 text-center" role="alert">
      <h1 className="text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.035em] text-ink">Algo salió mal de nuestro lado</h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        No pudimos cargar esta página. Suele ser algo temporal: inténtalo de nuevo en unos segundos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button size="lg" onClick={() => retry()}>
          <RotateCw className="size-4" aria-hidden="true" />
          Intentar de nuevo
        </Button>
        <Button href="/" size="lg" variant="ghost">
          Volver al inicio
        </Button>
      </div>
    </section>
  );
}
