import { deleteUserAction } from "@/server/actions/users.actions";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

export function DeleteUserButton({ id, nombre }: { id: number; nombre: string }) {
  return (
    <ConfirmDeleteButton
      action={deleteUserAction}
      id={id}
      label="Eliminar usuario"
      question={`¿Eliminar la cuenta de ${nombre}?`}
      alternative={
        <>
          Si solo quieres quitarle el acceso por un tiempo, apaga <strong className="text-ink">Puede entrar al panel</strong> en
          lugar de eliminarla.
        </>
      }
    >
      Se borrará de forma permanente y esa persona dejará de tener acceso al panel. Esta acción no se puede deshacer.
    </ConfirmDeleteButton>
  );
}
