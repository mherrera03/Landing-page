"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { publicationSchema, type PublicationFormField } from "@/schemas/publication.schema";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/publications.repository";
import { parseForm, readId } from "@/server/forms";
import type { UploadFolder } from "@/server/storage/uploads";
import type { FormState } from "@/types/form.types";
import { PUBLICATION_PATHS, type PublicationKind } from "@/types/publication.types";

export type PublicationFormState = FormState<PublicationFormField>;

const UPLOAD_FOLDERS: Record<PublicationKind, UploadFolder> = {
  noticia: "news",
  anuncio: "announcements",
};

/** Una noticia sin cuerpo no tiene sentido; en un anuncio el texto adicional es opcional. */
const MIN_NEWS_CONTENT = 30;

function refreshPages(kind: PublicationKind, ...slugs: string[]) {
  const path = PUBLICATION_PATHS[kind];
  revalidatePath("/"); // la franja de anuncios sale en todo el sitio público
  revalidatePath(`/${path}`);
  revalidatePath(`/admin/${path}`);
  for (const slug of slugs) revalidatePath(`/${path}/${slug}`);
}

async function parsePublication(kind: PublicationKind, formData: FormData) {
  const parsed = await parseForm(formData, publicationSchema, {
    switches: ["visible"],
    images: [{ folder: UPLOAD_FOLDERS[kind] }],
  });

  if (parsed.ok && kind === "noticia" && parsed.data.content.length < MIN_NEWS_CONTENT) {
    const state: PublicationFormState = {
      values: parsed.values,
      fields: { content: `La noticia necesita al menos ${MIN_NEWS_CONTENT} caracteres de contenido.` },
    };
    return { ok: false as const, state };
  }

  return parsed;
}

export async function createPublicationAction(
  kind: PublicationKind,
  _prev: PublicationFormState,
  formData: FormData,
): Promise<PublicationFormState> {
  await requireSession();

  const parsed = await parsePublication(kind, formData);
  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(kind, parsed.data.slug)) {
    return { values: parsed.values, fields: { slug: "Esta dirección ya existe." } };
  }

  repo.create(kind, parsed.data);
  refreshPages(kind, parsed.data.slug);
  redirect(`/admin/${PUBLICATION_PATHS[kind]}?creado=1`);
}

export async function updatePublicationAction(
  kind: PublicationKind,
  id: number,
  _prev: PublicationFormState,
  formData: FormData,
): Promise<PublicationFormState> {
  await requireSession();

  const previous = repo.findById(kind, id);
  if (!previous) return { error: "El contenido ya no existe." };

  const parsed = await parsePublication(kind, formData);
  if (!parsed.ok) return parsed.state;

  if (repo.slugTaken(kind, parsed.data.slug, id)) {
    return { values: parsed.values, fields: { slug: "Esta dirección ya existe." } };
  }

  repo.update(kind, id, parsed.data);
  // Si cambió la dirección, la página anterior también debe dejar de mostrarse
  refreshPages(kind, previous.slug, parsed.data.slug);
  redirect(`/admin/${PUBLICATION_PATHS[kind]}?actualizado=1`);
}

export async function togglePublicationAction(kind: PublicationKind, formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  const item = id === null ? null : repo.findById(kind, id);
  if (!item) return;

  repo.toggleVisible(kind, item.id);
  refreshPages(kind, item.slug);
}

export async function deletePublicationAction(kind: PublicationKind, formData: FormData): Promise<void> {
  await requireSession();

  const id = readId(formData);
  const item = id === null ? null : repo.findById(kind, id);
  if (item) {
    repo.remove(kind, item.id);
    refreshPages(kind, item.slug);
  }

  redirect(`/admin/${PUBLICATION_PATHS[kind]}?eliminado=1`);
}
