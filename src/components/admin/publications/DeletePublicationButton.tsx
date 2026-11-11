"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deletePublicationAction } from "@/server/actions/publications.actions";
import type { PublicationKind } from "@/types/publication.types";
import { Modal } from "@/components/ui/Modal";

function Confirm() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-full bg-danger px-5 font-semibold text-white disabled:opacity-60">{pending ? "Eliminando…" : "Sí, eliminar"}</button>;
}

export function DeletePublicationButton({ kind, id, title }: { kind: PublicationKind; id: number; title: string }) {
  const [open, setOpen] = useState(false);
  const action = deletePublicationAction.bind(null, kind);
  return <>
    <button type="button" onClick={() => setOpen(true)} className="min-h-10 rounded-full border border-danger/30 px-4 text-sm font-semibold text-danger" aria-haspopup="dialog">Eliminar</button>
    <Modal open={open} onClose={() => setOpen(false)} title="Confirmar eliminación">
      <div className="p-6"><h3 className="text-xl font-bold text-ink">¿Eliminar este contenido?</h3><p className="mt-3 text-muted">Se borrará <strong className="text-ink">{title}</strong> de forma permanente. Puedes ocultarlo si quieres conservarlo.</p>
        <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setOpen(false)} className="min-h-11 rounded-full border border-line px-5 font-semibold text-ink">Cancelar</button><form action={action}><input type="hidden" name="id" value={id} /><Confirm /></form></div>
      </div>
    </Modal>
  </>;
}
