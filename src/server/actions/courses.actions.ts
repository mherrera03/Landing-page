"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { courseSchema, type CourseFormField } from "@/schemas/course.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/courses.repository";
import * as categoriesRepo from "@/server/database/repositories/categories.repository";
import { parseForm, readId } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type CourseFormState = FormState<CourseFormField>;

/** La landing y el listado del admin deben reflejar el cambio de inmediato. */
function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin");
}

function parseCourse(formData: FormData) {
  return parseForm(formData, courseSchema, { switches: ["featured", "visible"], images: [{ folder: "courses" }] });
}

export async function createCourseAction(_prev: CourseFormState, formData: FormData): Promise<CourseFormState> {
  await requireSession();

  const parsed = await parseCourse(formData);
  if (!parsed.ok) return parsed.state;

  if (await repo.slugTaken(parsed.data.slug)) {
    return { values: parsed.values, fields: { slug: "Ya existe un curso con esta dirección." } };
  }

  // Sin el CHECK de la tabla, este es el cerrojo que impide dejar un curso
  // apuntando a una categoría que ya no existe.
  if (!(await categoriesRepo.exists(parsed.data.category))) {
    return { values: parsed.values, fields: { category: "Esa categoría ya no existe." } };
  }

  await repo.create(parsed.data);
  refreshPages();
  redirect("/admin/cursos?creado=1");
}

export async function updateCourseAction(id: number, _prev: CourseFormState, formData: FormData): Promise<CourseFormState> {
  await requireSession();

  if (!await repo.findById(id)) return { error: "Este curso ya no existe." };

  const parsed = await parseCourse(formData);
  if (!parsed.ok) return parsed.state;

  if (await repo.slugTaken(parsed.data.slug, id)) {
    return { values: parsed.values, fields: { slug: "Ya existe otro curso con esta dirección." } };
  }

  if (!(await categoriesRepo.exists(parsed.data.category))) {
    return { values: parsed.values, fields: { category: "Esa categoría ya no existe." } };
  }

  await repo.update(id, parsed.data);
  refreshPages();
  redirect("/admin/cursos?actualizado=1");
}

export async function toggleCourseVisibilityAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id === null) return;

  await repo.toggleVisible(id);
  refreshPages();
}

export async function deleteCourseAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id !== null) {
    await repo.remove(id);
    refreshPages();
  }

  redirect("/admin/cursos?eliminado=1");
}
