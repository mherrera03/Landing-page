"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { settingsSchema } from "@/schemas/settings.schema";
import { requireAdmin } from "@/server/auth/dal";
import { saveSettings } from "@/server/database/repositories/settings.repository";
import { landingSchema } from "@/schemas/landing.schema";
import { saveLandingSettings } from "@/server/database/repositories/settings.repository";
import { brandSchema } from "@/schemas/brand.schema";
import { saveBrandSettings } from "@/server/database/repositories/settings.repository";
import { saveImage } from "@/server/storage/uploads";
import { saveFeaturedAnnouncementId } from "@/server/database/repositories/settings.repository";
import { findById } from "@/server/database/repositories/publications.repository";

export type SettingsState = { saved?: boolean; fields?: Record<string, string> };

export async function saveSettingsAction(_previous: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    email: formData.get("email"),
    whatsapp1: formData.get("whatsapp1"),
    whatsapp2: formData.get("whatsapp2"),
    address: formData.get("address"),
    hours: formData.get("hours"),
    mapUrl: formData.get("mapUrl"),
    facebookUrl: formData.get("facebookUrl"),
    instagramUrl: formData.get("instagramUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
  });
  if (!parsed.success) {
    const fields = Object.fromEntries(Object.entries(z.flattenError(parsed.error).fieldErrors).map(([key, errors]) => [key, errors?.[0] ?? "Dato inválido."]));
    return { fields };
  }
  saveSettings(parsed.data);
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
  return { saved: true };
}

export async function saveLandingAction(_previous: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const parsed = landingSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    const fields = Object.fromEntries(Object.entries(z.flattenError(parsed.error).fieldErrors).map(([key, errors]) => [key, errors?.[0] ?? "Dato inválido."]));
    return { fields };
  }
  saveLandingSettings(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin/configuracion");
  return { saved: true };
}

export async function saveBrandAction(_previous: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const values = {
    siteDescription: formData.get("siteDescription"),
    siteUrl: formData.get("siteUrl"),
    logoImage: formData.get("logoImage"),
    logoAlt: formData.get("logoAlt"),
    shareImage: formData.get("shareImage"),
    shareImageAlt: formData.get("shareImageAlt"),
  };
  const logoFile = formData.get("logoFile");
  const shareFile = formData.get("shareFile");
  if (logoFile instanceof Blob && logoFile.size > 0 && !String(values.logoAlt ?? "").trim()) return { fields: { logoAlt: "Describe el logo." } };
  if (shareFile instanceof Blob && shareFile.size > 0 && !String(values.shareImageAlt ?? "").trim()) return { fields: { shareImageAlt: "Describe la imagen para compartir." } };
  if (logoFile instanceof Blob && logoFile.size > 0) {
    const saved = await saveImage(logoFile, "branding");
    if (!saved.ok) return { fields: { logoImage: saved.error } };
    values.logoImage = saved.path;
  }
  if (shareFile instanceof Blob && shareFile.size > 0) {
    const saved = await saveImage(shareFile, "branding");
    if (!saved.ok) return { fields: { shareImage: saved.error } };
    values.shareImage = saved.path;
  }
  const parsed = brandSchema.safeParse(values);
  if (!parsed.success) {
    const fields = Object.fromEntries(Object.entries(z.flattenError(parsed.error).fieldErrors).map(([key, errors]) => [key, errors?.[0] ?? "Dato inválido."]));
    return { fields };
  }
  saveBrandSettings(parsed.data);
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
  return { saved: true };
}

export async function saveFeaturedAnnouncementAction(_previous: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const id = Number(formData.get("featuredAnnouncementId"));
  if (!Number.isSafeInteger(id) || id < 0) return { fields: { featuredAnnouncementId: "Selecciona un anuncio válido." } };
  if (id > 0 && !findById("anuncio", id)?.visible) return { fields: { featuredAnnouncementId: "El anuncio debe estar publicado." } };
  saveFeaturedAnnouncementId(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
  return { saved: true };
}
