"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { settingsSchema } from "@/schemas/settings.schema";
import { requireAdmin } from "@/server/auth/dal";
import { saveSettings } from "@/server/database/repositories/settings.repository";

export type SettingsState = { saved?: boolean; fields?: Record<string, string> };

export async function saveSettingsAction(_previous: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    email: formData.get("email"),
    whatsapp1: formData.get("whatsapp1"),
    whatsapp2: formData.get("whatsapp2"),
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
