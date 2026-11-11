"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { publicationSchema, type PublicationInput } from "@/schemas/publication.schema";
import { requireSession } from "@/server/auth/dal";
import { saveImage } from "@/server/storage/uploads";
import * as repo from "@/server/database/repositories/publications.repository";
import type { PublicationKind } from "@/types/publication.types";

export type PublicationState = { error?: string; fields?: Record<string, string>; values?: Record<string, string> };

const segment = (kind: PublicationKind) => kind === "noticia" ? "noticias" : "anuncios";

function refresh(kind: PublicationKind, slug?: string) {
  const part = segment(kind);
  revalidatePath(`/admin/${part}`);
  revalidatePath(`/${part}`);
  if (slug) revalidatePath(`/${part}/${slug}`);
  revalidatePath("/");
}

async function parse(formData: FormData, kind: PublicationKind): Promise<{ data: PublicationInput } | { state: PublicationState }> {
  const values = Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string")) as Record<string, string>;
  const file = formData.get("imagenArchivo");
  let image = values.image ?? "";
  if (file instanceof Blob && file.size > 0) {
    const saved = await saveImage(file, kind === "noticia" ? "news" : "announcements");
    if (!saved.ok) return { state: { values, fields: { image: saved.error } } };
    image = saved.path;
  }
  const result = publicationSchema.safeParse({ ...values, image, visible: formData.get("visible") === "on" });
  if (!result.success) {
    const fields = Object.fromEntries(Object.entries(z.flattenError(result.error).fieldErrors).map(([key, messages]) => [key, messages?.[0] ?? "Dato inválido."]));
    return { state: { values: { ...values, image }, fields } };
  }
  if (kind === "noticia" && result.data.content.length < 30) return { state: { values: { ...values, image }, fields: { content: "La noticia necesita al menos 30 caracteres de contenido." } } };
  return { data: result.data };
}

export async function createPublicationAction(kind: PublicationKind, _prev: PublicationState, formData: FormData): Promise<PublicationState> {
  await requireSession();
  const parsed = await parse(formData, kind);
  if ("state" in parsed) return parsed.state;
  if (repo.slugTaken(kind, parsed.data.slug)) return { fields: { slug: "Esta dirección ya existe." }, values: Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string> };
  repo.create(kind, parsed.data);
  refresh(kind, parsed.data.slug);
  redirect(`/admin/${segment(kind)}?creado=1`);
}

export async function updatePublicationAction(kind: PublicationKind, id: number, _prev: PublicationState, formData: FormData): Promise<PublicationState> {
  await requireSession();
  const previous = repo.findById(kind, id);
  if (!previous) return { error: "El contenido ya no existe." };
  const parsed = await parse(formData, kind);
  if ("state" in parsed) return parsed.state;
  if (repo.slugTaken(kind, parsed.data.slug, id)) return { fields: { slug: "Esta dirección ya existe." } };
  repo.update(kind, id, parsed.data);
  refresh(kind, previous.slug);
  refresh(kind, parsed.data.slug);
  redirect(`/admin/${segment(kind)}?actualizado=1`);
}

export async function togglePublicationAction(kind: PublicationKind, formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return;
  const item = repo.findById(kind, id);
  if (!item) return;
  repo.toggle(kind, id);
  refresh(kind, item.slug);
}

export async function deletePublicationAction(kind: PublicationKind, formData: FormData): Promise<void> {
  await requireSession();
  const id = Number(formData.get("id"));
  if (Number.isSafeInteger(id) && id > 0) {
    const item = repo.findById(kind, id);
    if (item) { repo.remove(kind, id); refresh(kind, item.slug); }
  }
  redirect(`/admin/${segment(kind)}?eliminado=1`);
}
