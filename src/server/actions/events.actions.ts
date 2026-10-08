"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eventSchema, type EventFormField } from "@/schemas/event.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/events.repository";
import { saveImage } from "@/server/storage/uploads";

export type EventFormState = {
  error?: string;
  fields?: Partial<Record<EventFormField, string>>;
  /** Lo que el usuario había escrito, para no perderlo si hay un error. */
  values?: Record<string, string>;
};

/** La landing y el listado del admin deben reflejar el cambio de inmediato. */
function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/eventos");
  revalidatePath("/admin");
}

/** Reconstruye los valores del formulario como texto, para repintarlo tras un error. */
function toFormValues(data: ReturnType<typeof eventSchema.parse>): Record<string, string> {
  return {
    title: data.title,
    slug: data.slug,
    kind: data.kind,
    tag: data.tag,
    description: data.description,
    date: data.date ?? "",
    time: data.time ?? "",
    place: data.place,
    link: data.link,
    linkText: data.linkText,
    image: data.image,
    imageAlt: data.imageAlt,
  };
}

async function parseForm(formData: FormData) {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string").map(([k, v]) => [k, String(v)]),
  );

  // Si subieron un banner nuevo, reemplaza al anterior
  const file = formData.get("imagenArchivo");
  let image = String(formData.get("image") ?? "");

  if (file instanceof Blob && file.size > 0) {
    const saved = await saveImage(file, "events");
    if (!saved.ok) return { ok: false as const, state: { values, fields: { image: saved.error } } };
    image = saved.path;
  }

  const result = eventSchema.safeParse({
    ...values,
    image,
    featured: formData.get("featured") === "on",
    visible: formData.get("visible") === "on",
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const fields: EventFormState["fields"] = {};
    for (const key of Object.keys(fieldErrors) as EventFormField[]) fields[key] = fieldErrors[key]?.[0];
    return { ok: false as const, state: { values: { ...values, image }, fields } };
  }

  return { ok: true as const, data: result.data };
}

export async function createEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireSession();

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(parsed.data.slug)) {
    return { values: toFormValues(parsed.data), fields: { slug: "Ya existe un evento con esta dirección." } };
  }

  repo.create({ ...parsed.data, order: 0 });
  refreshPages();
  redirect("/admin/eventos?creado=1");
}

export async function updateEventAction(id: number, _prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireSession();

  const actual = repo.findById(id);
  if (!actual) return { error: "Este evento ya no existe." };

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(parsed.data.slug, id)) {
    return { values: toFormValues(parsed.data), fields: { slug: "Ya existe otro evento con esta dirección." } };
  }

  repo.update(id, { ...parsed.data, order: actual.order });
  refreshPages();
  redirect("/admin/eventos?actualizado=1");
}

export async function toggleEventVisibilityAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    repo.toggleVisible(id);
    refreshPages();
  }
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (Number.isInteger(id)) {
    repo.remove(id);
    refreshPages();
  }
  redirect("/admin/eventos?eliminado=1");
}
