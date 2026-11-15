import { deleteEventAction } from "@/server/actions/events.actions";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

export function DeleteEventButton({ id, title }: { id: number; title: string }) {
  return (
    <ConfirmDeleteButton
      action={deleteEventAction}
      id={id}
      label="Eliminar evento"
      question="¿Eliminar este evento?"
      alternative={
        <>
          Si solo quieres quitarlo de la vista por un tiempo, apaga <strong className="text-ink">Visible en la landing</strong> en
          lugar de eliminarlo.
        </>
      }
    >
      Se borrará <strong className="text-ink">{title}</strong> de forma permanente y desaparecerá de la landing. Esta acción no se
      puede deshacer.
    </ConfirmDeleteButton>
  );
}
