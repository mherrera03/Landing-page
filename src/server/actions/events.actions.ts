
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  eventSchema,
  type EventFormField,
  type EventInput,
} from "@/schemas/event.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/events.repository";
import { saveImage } from "@/server/storage/uploads";

export type EventFormState = {
  error?: string;
  fields?: Partial<Record<EventFormField, string>>;
  values?: Record<string, string>;
};

function toFormValues(data: EventInput): Record<string, string> {
  return {
    title: data.title,
    slug: data.slug,
    type: data.type,
    modality: data.modality,
    date: data.date,
    time: data.time,
    location: data.location ?? "",
    price: data.price == null ? "" : String(data.price),
    capacity: data.capacity == null ? "" : String(data.capacity),
    registrationUrl: data.registrationUrl ?? "",
    status: data.status,
    description: data.description,
    image: data.image,
    imageAlt: data.imageAlt,
  };
}

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/eventos");
  revalidatePath("/admin");
}

async function parseForm(formData: FormData) {
  const values = Object.fromEntries(
    [...formData.entries()]
      .filter(([, value]) => typeof value === "string")
      .map(([key, value]) => [key, String(value)]),
  ) as Record<string, string>;

  const file = formData.get("imagenArchivo");
  let image = String(formData.get("image") ?? "");

  if (file instanceof Blob && file.size > 0) {
    const saved = await saveImage(file, "events");

    if (!saved.ok) {
      return {
        ok: false as const,
        state: {
          values: { ...values, image },
          fields: { image: saved.error },
        },
      };
    }

    image = saved.path;
  }

  const result = eventSchema.safeParse({
    ...values,
    image,
    price: values.price ?? "",
    capacity: values.capacity ?? "",
    visible: formData.get("visible") === "on",
    featured: formData.get("featured") === "on",
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const fields: EventFormState["fields"] = {};

    for (const key of Object.keys(fieldErrors) as EventFormField[]) {
      const message = fieldErrors[key]?.[0];
      if (message) fields[key] = message;
    }

    return {
      ok: false as const,
      state: {
        values: { ...values, image },
        fields,
      },
    };
  }

  return { ok: true as const, data: result.data };
}

export async function createEventAction(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireSession();

  const parsed = await parseForm(formData);

  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(parsed.data.slug)) {
    return {
      values: toFormValues(parsed.data),
      fields: {
        slug: "Ya existe un evento con esta dirección.",
      },
    };
  }

  repo.insertEvent(parsed.data);
  refreshPages();

  redirect("/admin/eventos?creado=1");
}

export async function updateEventAction(
  id: number,
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireSession();

  const actual = repo.getEventById(id);

  if (!actual) {
    return { error: "Este evento ya no existe." };
  }

  const parsed = await parseForm(formData);

  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(parsed.data.slug, id)) {
    return {
      values: toFormValues(parsed.data),
      fields: {
        slug: "Ya existe otro evento con esta dirección.",
      },
    };
  }

  repo.saveEvent(id, parsed.data);
  refreshPages();

  redirect("/admin/eventos?actualizado=1");
}

export async function toggleEventVisibilityAction(
  formData: FormData,
): Promise<void> {
  await requireSession();

  const id = Number(formData.get("id"));

  if (!Number.isSafeInteger(id) || id <= 0) return;
  if (!repo.getEventById(id)) return;

  repo.toggleEventVisibility(id);
  refreshPages();
}

export async function deleteEventAction(
  formData: FormData,
): Promise<void> {
  await requireSession();

  const id = Number(formData.get("id"));

  if (Number.isSafeInteger(id) && id > 0 && repo.getEventById(id)) {
    repo.removeEvent(id);
    refreshPages();
  }

  redirect("/admin/eventos?eliminado=1");
}
