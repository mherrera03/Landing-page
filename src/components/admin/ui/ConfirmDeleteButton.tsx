"use client";

import { useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, TriangleAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

type ConfirmDeleteButtonProps = {
  /** Acción del servidor que elimina. Recibe el id en el campo `id`. */
  action: (formData: FormData) => Promise<void>;
  id: number;
  /** Texto del botón que abre el diálogo: "Eliminar curso". */
  label: string;
  /** Muestra solo el icono (filas con poco espacio). El texto queda para lectores de pantalla. */
  iconOnly?: boolean;
  /** Pregunta que encabeza el diálogo: "¿Eliminar este curso?". */
  question: string;
  /** Qué se pierde al eliminar. */
  children: ReactNode;
  /** Alternativa menos drástica (ocultar, desactivar…), si existe. */
  alternative?: ReactNode;
};

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-danger px-5 font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Eliminando…" : "Sí, eliminar"}
    </button>
  );
}

/** Eliminar es irreversible, así que siempre pide confirmación. */
export function ConfirmDeleteButton({ action, id, label, iconOnly = false, question, children, alternative }: ConfirmDeleteButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        title={iconOnly ? label : undefined}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-danger/30 text-sm font-semibold text-danger transition-colors duration-200 hover:bg-danger/10",
          iconOnly ? "w-11" : "px-4",
        )}
      >
        <Trash2 className="size-4" aria-hidden="true" />
        <span className={cn(iconOnly && "sr-only")}>{label}</span>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Confirmar eliminación">
        <div className="p-6 sm:p-7">
          <span className="grid size-12 place-items-center rounded-xl bg-danger/10 text-danger">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-xl font-bold text-ink">{question}</h3>
          <p className="mt-2 leading-relaxed text-muted">{children}</p>
          {alternative && <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm text-muted">{alternative}</p>}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-line px-5 font-semibold text-ink transition-colors duration-200 hover:bg-paper"
            >
              Cancelar
            </button>
            <form action={action} className="flex flex-1">
              <input type="hidden" name="id" value={id} />
              <ConfirmButton />
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
