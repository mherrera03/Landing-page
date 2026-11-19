"use server";

import { revalidatePath } from "next/cache";
import { brandSchema } from "@/schemas/brand.schema";
import { landingSchema } from "@/schemas/landing.schema";
import { settingsSchema } from "@/schemas/settings.schema";
import { requireAdmin } from "@/server/auth/dal";
import { findById as findPublicationById } from "@/server/database/repositories/publications.repository";
import * as repo from "@/server/database/repositories/settings.repository";
import { parseForm } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type SettingsState = FormState;

/** Estos ajustes salen en el encabezado, el pie y la portada: se refresca todo el sitio. */
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveSettingsAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();

  const parsed = await parseForm(formData, settingsSchema);
  if (!parsed.ok) return parsed.state;

  await repo.saveSettings(parsed.data);
  refreshSite();
  return { saved: true };
}

export async function saveLandingAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();

  const parsed = await parseForm(formData, landingSchema);
  if (!parsed.ok) return parsed.state;

  await repo.saveLandingSettings(parsed.data);
  refreshSite();
  return { saved: true };
}

export async function saveBrandAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();

  const parsed = await parseForm(formData, brandSchema, {
    images: [
      { folder: "branding", fileField: "logoFile", pathField: "logoImage", allowSvg: true },
      { folder: "branding", fileField: "shareFile", pathField: "shareImage" },
    ],
  });
  if (!parsed.ok) return parsed.state;

  await repo.saveBrandSettings(parsed.data);
  refreshSite();
  return { saved: true };
}

export async function saveFeaturedAnnouncementAction(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();

  // 0 = automático: se muestra el anuncio activo más reciente
  const id = Number(formData.get("featuredAnnouncementId"));
  if (!Number.isSafeInteger(id) || id < 0) {
    return { fields: { featuredAnnouncementId: "Selecciona un anuncio válido." } };
  }
  if (id > 0 && !(await findPublicationById("anuncio", id))?.visible) {
    return { fields: { featuredAnnouncementId: "El anuncio debe estar publicado." } };
  }

  await repo.saveFeaturedAnnouncementId(id);
  refreshSite();
  return { saved: true };
}
