"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { partnerSchema, type PartnerFormField } from "@/schemas/partner.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/partners.repository";
import { parseForm, readId } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type PartnerFormState = FormState<PartnerFormField>;

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/aliados");
}

function parsePartner(formData: FormData) {
  return parseForm(formData, partnerSchema, {
    switches: ["visible"],
    // Los logos suelen venir en SVG: se admite igual que en el logo del sitio
    images: [{ folder: "partners", fileField: "logoFile", pathField: "logo", allowSvg: true }],
  });
}

export async function createPartnerAction(_prev: PartnerFormState, formData: FormData): Promise<PartnerFormState> {
  await requireSession();

  const parsed = await parsePartner(formData);
  if (!parsed.ok) return parsed.state;

  await repo.create(parsed.data);
  refreshPages();
  redirect("/admin/aliados?creado=1");
}

export async function updatePartnerAction(id: number, _prev: PartnerFormState, formData: FormData): Promise<PartnerFormState> {
  await requireSession();

  if (!(await repo.findById(id))) return { error: "Este aliado ya no existe." };

  const parsed = await parsePartner(formData);
  if (!parsed.ok) return parsed.state;

  await repo.update(id, parsed.data);
  refreshPages();
  redirect("/admin/aliados?actualizado=1");
}

export async function togglePartnerVisibilityAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id === null) return;

  await repo.toggleVisible(id);
  refreshPages();
}

export async function deletePartnerAction(formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  if (id !== null) {
    await repo.remove(id);
    refreshPages();
  }

  redirect("/admin/aliados?eliminado=1");
}
