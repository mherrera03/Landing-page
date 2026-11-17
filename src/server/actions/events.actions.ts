"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eventSchema, type EventFormField } from "@/schemas/event.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/events.repository";
import { parseForm, readId } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type EventFormState = FormState<EventFormField>;

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/eventos");
  revalidatePath("/admin/eventos");
  revalidatePath("/admin");
}

function parseEvent(formData: FormData) {
  return parseForm(formData, eventSchema, { switches: ["visible", "featured"], images: [{ folder: "events" }] });
}

export async function createEventAction(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireSession();

  const parsed = await parseEvent(formData);
  if (!parsed.ok) return parsed.state;

  if (await repo.slugTaken(parsed.data.slug)) {
    return { values: parsed.values, fields: { slug: "Ya existe un evento con esta dirección." } };
  }

  await repo.create(parsed.data);
  refreshPages();
  redirect("/admin/eventos?creado=1");
}

export async function updateEventAction(id: number, _prev: EventFormState, formData: FormData): Promise<EventFormState> {
  await requireSession();

  if (!await repo.findById(id)) return { error: "Este evento ya no existe." };

  const parsed = await parseEvent(formData);
  if (!parsed.ok) return parsed.state;

  if (await repo.slugTaken(parsed.data.slug, id)) {
    return { values: parsed.values, fields: { slug: "Ya existe otro evento con esta dirección." } };
  }

  await repo.update(id, parsed.data);
  refreshPages();
  redirect("/admin/eventos?actualizado=1");
}

export async function toggleEventVisibilityAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id === null) return;

  await repo.toggleVisible(id);
  refreshPages();
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id !== null) {
    await repo.remove(id);
    refreshPages();
  }

  redirect("/admin/eventos?eliminado=1");
}
