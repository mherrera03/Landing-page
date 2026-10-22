"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Trash2, TriangleAlert } from "lucide-react";
import { deleteUserAction } from "@/server/actions/users.actions";
import { Modal } from "@/components/ui/Modal";

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
export function DeleteUserButton({ id, nombre }: { id: number; nombre: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-danger/30 px-4 text-sm font-semibold text-danger transition-colors duration-200 hover:bg-danger/10"
      >
        <Trash2 className="size-4" aria-hidden="true" />
        Eliminar usuario
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Confirmar eliminación">
        <div className="p-6 sm:p-7">
          <span className="grid size-12 place-items-center rounded-xl bg-danger/10 text-danger">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-xl font-bold text-ink">¿Eliminar la cuenta de {nombre}?</h3>
          <p className="mt-2 leading-relaxed text-muted">
            Se borrará de forma permanente y esa persona dejará de tener acceso al panel. Esta acción no se puede
            deshacer.
          </p>
          <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm text-muted">
            Si solo quieres quitarle el acceso por un tiempo, apaga{" "}
            <strong className="text-ink">Puede entrar al panel</strong> en lugar de eliminarla.
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-line px-5 font-semibold text-ink transition-colors duration-200 hover:bg-paper"
            >
              Cancelar
            </button>
            <form action={deleteUserAction} className="flex flex-1">
              <input type="hidden" name="id" value={id} />
              <ConfirmButton />
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
