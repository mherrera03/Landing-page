import { deletePartnerAction } from "@/server/actions/partners.actions";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

export function DeletePartnerButton({ id, name }: { id: number; name: string }) {
  return (
    <ConfirmDeleteButton
      action={deletePartnerAction}
      id={id}
      label="Eliminar aliado"
      question="¿Eliminar este aliado?"
      alternative={
        <>
          Si solo quieres quitar su logo por un tiempo, apaga <strong className="text-ink">Visible en la landing</strong> en lugar de
          eliminarlo.
        </>
      }
    >
      Se borrará <strong className="text-ink">{name}</strong> de forma permanente y su logo desaparecerá de la landing. Esta acción no
      se puede deshacer.
    </ConfirmDeleteButton>
  );
}
