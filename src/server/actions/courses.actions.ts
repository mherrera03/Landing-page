"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { courseSchema, type CourseFormField } from "@/schemas/course.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/courses.repository";
import { saveImage } from "@/server/storage/uploads";

export type CourseFormState = {
  error?: string;
  fields?: Partial<Record<CourseFormField, string>>;
  /** Lo que el usuario había escrito, para no perderlo si hay un error. */
  values?: Record<string, string>;
};

/** Reconstruye los valores del formulario como texto, para repintarlo tras un error. */
function toFormValues(data: ReturnType<typeof courseSchema.parse>): Record<string, string> {
  return {
    title: data.title,
    slug: data.slug,
    category: data.category,
    description: data.description,
    level: data.level,
    durationHours: String(data.durationHours),
    students: data.students === null ? "" : String(data.students),
    modality: data.modality ?? "",
    image: data.image,
    imageAlt: data.imageAlt,
    status: data.status,
  };
}

/** La landing y el listado del admin deben reflejar el cambio de inmediato. */
function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/cursos");
  revalidatePath("/admin");
}

/** Convierte el formulario en datos validados. Si algo falla, devuelve los errores. */
async function parseForm(formData: FormData): Promise<
  { ok: true; data: ReturnType<typeof courseSchema.parse> } | { ok: false; state: CourseFormState }
> {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string").map(([k, v]) => [k, String(v)]),
  );

  // Si subieron una imagen nueva, reemplaza a la anterior.
  // Se comprueba contra Blob (File lo extiende): según el runtime, el archivo
  // subido no siempre es exactamente la clase File.
  const file = formData.get("imagenArchivo");
  let image = String(formData.get("image") ?? "");

  if (file instanceof Blob && file.size > 0) {
    const saved = await saveImage(file);
    if (!saved.ok) return { ok: false, state: { values, fields: { image: saved.error } } };
    image = saved.path;
  }

  const result = courseSchema.safeParse({
    ...values,
    image,
    featured: formData.get("featured") === "on",
    visible: formData.get("visible") === "on",
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const fields: CourseFormState["fields"] = {};
    for (const key of Object.keys(fieldErrors) as CourseFormField[]) fields[key] = fieldErrors[key]?.[0];
    return { ok: false, state: { values: { ...values, image }, fields } };
  }

  return { ok: true, data: result.data };
}

export async function createCourseAction(_prev: CourseFormState, formData: FormData): Promise<CourseFormState> {
  await requireSession();

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(parsed.data.slug)) {
    return { values: toFormValues(parsed.data), fields: { slug: "Ya existe un curso con esta dirección." } };
  }

  repo.create({ ...parsed.data, order: 0 });
  refreshPages();
  redirect("/admin/cursos?creado=1");
}

export async function updateCourseAction(id: number, _prev: CourseFormState, formData: FormData): Promise<CourseFormState> {
  await requireSession();

  const actual = repo.findById(id);
  if (!actual) return { error: "Este curso ya no existe." };

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(parsed.data.slug, id)) {
    return { values: toFormValues(parsed.data), fields: { slug: "Ya existe otro curso con esta dirección." } };
  }

  repo.update(id, { ...parsed.data, order: actual.order });
  refreshPages();
  redirect("/admin/cursos?actualizado=1");
}

export async function toggleCourseVisibilityAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    repo.toggleVisible(id);
    refreshPages();
  }
}

export async function deleteCourseAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    repo.remove(id);
    refreshPages();
  }
  redirect("/admin/cursos?eliminado=1");
}
