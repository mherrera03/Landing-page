"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  bannerSchema,
  type BannerFormField,
} from "@/schemas/banner.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/banners.repository";
import { saveImage } from "@/server/storage/uploads";

export type BannerFormState = {
  error?: string;
  fields?: Partial<Record<BannerFormField, string>>;
  values?: Record<string, string>;
};

function refreshPages() {
  revalidatePath("/");
  revalidatePath("/admin/banners");
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
    const saved = await saveImage(file, "banners");

    if (!saved.ok) {
      return {
        ok: false as const,
        state: {
          values: { ...values, image },
          fields: { image: saved.error },
        } satisfies BannerFormState,
      };
    }

    image = saved.path;
  }

  const result = bannerSchema.safeParse({
    ...values,
    image,
    visible: formData.get("visible") === "on",
  });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const fields: BannerFormState["fields"] = {};

    for (const key of Object.keys(fieldErrors) as BannerFormField[]) {
      const message = fieldErrors[key]?.[0];
      if (message) fields[key] = message;
    }

    return {
      ok: false as const,
      state: {
        values: { ...values, image },
        fields,
      } satisfies BannerFormState,
    };
  }

  return { ok: true as const, data: result.data };
}

export async function createBannerAction(
  _prev: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  await requireSession();

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed.state;

  repo.insertBanner(parsed.data);
  refreshPages();

  redirect("/admin/banners?creado=1");
}

export async function updateBannerAction(
  id: number,
  _prev: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  await requireSession();

  if (!repo.getBannerById(id)) {
    return { error: "Este banner ya no existe." };
  }

  const parsed = await parseForm(formData);
  if (!parsed.ok) return parsed.state;

  repo.saveBanner(id, parsed.data);
  refreshPages();

  redirect("/admin/banners?actualizado=1");
}

export async function toggleBannerVisibilityAction(
  formData: FormData,
): Promise<void> {
  await requireSession();

  const id = Number(formData.get("id"));

  if (!Number.isSafeInteger(id) || id <= 0) return;
  if (!repo.getBannerById(id)) return;

  repo.toggleBannerVisibility(id);
  refreshPages();
}

export async function deleteBannerAction(
  formData: FormData,
): Promise<void> {
  await requireSession();

  const id = Number(formData.get("id"));

  if (Number.isSafeInteger(id) && id > 0 && repo.getBannerById(id)) {
    repo.removeBanner(id);
    refreshPages();
  }

  redirect("/admin/banners?eliminado=1");
}
