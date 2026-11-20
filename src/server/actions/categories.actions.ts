"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/text";
import { categorySchema, type CategoryFormField } from "@/schemas/category.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/categories.repository";
import { deleteBlocker } from "@/server/services/categories.service";
import { parseForm, readId } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type CategoryFormState = FormState<CategoryFormField>;

/** Cambiar una categoría cambia lo que se ve en la landing y en Cursos. */
function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/cursos");
}

export async function createCategoryAction(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  await requireSession();

  const parsed = await parseForm(formData, categorySchema);
  if (!parsed.ok) return parsed.state;

  // La clave se deduce del nombre y queda fija de por vida. `freeKey` evita el
  // choque de "Diseño" con "Diseno", que dan la misma base.
  const key = await repo.freeKey(slugify(parsed.data.name));

  await repo.create(parsed.data, key);
  refreshPages();
  redirect("/admin/categorias?creado=1");
}

export async function updateCategoryAction(
  id: number,
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireSession();

  if (!(await repo.findById(id))) return { error: "Esta categoría ya no existe." };

  const parsed = await parseForm(formData, categorySchema);
  if (!parsed.ok) return parsed.state;

  // Solo nombre y orden: la clave no se toca, y por eso renombrar no rompe nada.
  await repo.update(id, parsed.data);
  refreshPages();
  redirect("/admin/categorias?actualizado=1");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id === null) redirect("/admin/categorias");

  const categoria = await repo.findById(id);
  if (!categoria) redirect("/admin/categorias");

  // El aviso viaja en la URL porque esta acción no devuelve estado: es un
  // formulario suelto dentro del diálogo de confirmación.
  const bloqueo = await deleteBlocker(categoria);
  if (bloqueo?.kind === "last") redirect("/admin/categorias?ultima=1");
  if (bloqueo?.kind === "inUse") redirect(`/admin/categorias?enUso=${bloqueo.courses}`);

  await repo.remove(id);
  refreshPages();
  redirect("/admin/categorias?eliminado=1");
}
