import { deleteLeadAction } from "@/server/actions/leads.actions";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

export function DeleteLeadButton({ id, nombre }: { id: number; nombre: string }) {
  return (
    <ConfirmDeleteButton
      action={deleteLeadAction}
      id={id}
      label={`Eliminar la solicitud de ${nombre}`}
      iconOnly
      question={`¿Eliminar la solicitud de ${nombre}?`}
      alternative={
        <>
          Si ya la resolviste, mejor márcala como <strong className="text-ink">atendida</strong>: así queda el registro de que esa
          persona escribió.
        </>
      }
    >
      Se borrará de forma permanente, con sus datos de contacto y su mensaje. Esta acción no se puede deshacer.
    </ConfirmDeleteButton>
  );
}
