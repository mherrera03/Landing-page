import type { ReactNode } from "react";
import Link from "next/link";

type FormActionsProps = {
  /** A dónde vuelve "Cancelar" (el listado de la sección). */
  cancelHref: string;
  /** El botón de envío. */
  children: ReactNode;
};

/** Pie de los formularios de crear y editar: guardar a la izquierda, cancelar al lado. */
export function FormActions({ cancelHref, children }: FormActionsProps) {
  return (
    <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
      {children}
      <Link
        href={cancelHref}
        className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
      >
        Cancelar
      </Link>
    </div>
  );
}
