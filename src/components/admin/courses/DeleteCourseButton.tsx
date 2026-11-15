import { deleteCourseAction } from "@/server/actions/courses.actions";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

export function DeleteCourseButton({ id, title }: { id: number; title: string }) {
  return (
    <ConfirmDeleteButton
      action={deleteCourseAction}
      id={id}
      label="Eliminar curso"
      question="¿Eliminar este curso?"
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
