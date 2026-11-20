import { deleteCategoryAction } from "@/server/actions/categories.actions";
import { ConfirmDeleteButton } from "../ui/ConfirmDeleteButton";

type DeleteCategoryButtonProps = {
  id: number;
  name: string;
  /** Cursos que la usan, visibles y ocultos. Si hay alguno, no se podrá borrar. */
  courses: number;
};

export function DeleteCategoryButton({ id, name, courses }: DeleteCategoryButtonProps) {
  return (
    <ConfirmDeleteButton
      action={deleteCategoryAction}
      id={id}
      label="Eliminar categoría"
      question="¿Eliminar esta categoría?"
      alternative={
        courses > 0 ? (
          <>
            Ahora mismo no se puede: {courses === 1 ? "hay 1 curso que la usa" : `hay ${courses} cursos que la usan`}. Cámbiales la
            categoría primero.
          </>
        ) : undefined
      }
    >
      Se borrará <strong className="text-ink">{name}</strong> de forma permanente. Esta acción no se puede deshacer.
    </ConfirmDeleteButton>
  );
}
