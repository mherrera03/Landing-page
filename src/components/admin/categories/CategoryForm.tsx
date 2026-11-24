"use client";

import { useActionState } from "react";
import type { CategoryFormState } from "@/server/actions/categories.actions";
import type { Category } from "@/types/category.types";
import { Input } from "@/components/ui/Input";
import { FormActions } from "../ui/FormActions";
import { FormError } from "../ui/FormError";
import { SubmitButton } from "../ui/SubmitButton";

type CategoryFormProps = {
  action: (prev: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  /** Categoría a editar. Si no viene, se crea una nueva. */
  category?: Category;
  /** Posición propuesta para una categoría nueva: al final de la lista. */
  suggestedOrder?: number;
};

export function CategoryForm({ action, category, suggestedOrder = 1 }: CategoryFormProps) {
  const [state, formAction] = useActionState<CategoryFormState, FormData>(action, {});
  // Tras un error, el formulario se repinta con lo que la persona había escrito
  const v = state.values ?? {};

  return (
    <form action={formAction} className="admin-card max-w-3xl p-5 sm:p-7">
      <FormError className="mb-5">{state.error}</FormError>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Nombre de la categoría"
          required
          placeholder="Humanidades"
          defaultValue={v.name ?? category?.name}
          error={state.fields?.name}
          wrapperClassName="sm:col-span-2"
        />

        <Input
          id="order"
          name="order"
          label="Posición"
          type="number"
          required
          min={0}
          defaultValue={v.order ?? category?.order ?? suggestedOrder}
          error={state.fields?.order}
        />
      </div>

      <p className="mt-2 rounded-xl bg-paper px-4 py-3 text-sm leading-relaxed text-muted">
        {category ? (
          <>
            Su dirección interna es <strong className="text-ink">{category.key}</strong> y no cambia aunque le cambies el nombre:
            así los cursos que ya la usan la siguen encontrando.
          </>
        ) : (
          <>La dirección interna se genera sola a partir del nombre y después ya no cambia, aunque la renombres.</>
        )}
      </p>

      <FormActions cancelHref="/admin/categorias">
        <SubmitButton>{category ? "Guardar cambios" : "Crear categoría"}</SubmitButton>
      </FormActions>
    </form>
  );
}
