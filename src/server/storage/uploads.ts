import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { IMAGE_EXTENSIONS, imageProblem, type ImageMimeType } from "@/lib/image-rules";

/**
 * Guarda las imágenes que suben desde el admin.
 *
 * Hoy escribe en public/images/<carpeta> (sirve en tu PC y en un VPS).
 * Si algún día se publica en Vercel o similar, donde el disco se borra en cada
 * despliegue, basta con reescribir `saveImage` para que suba a un servicio en la
 * nube: el resto de la aplicación no cambia porque todo pasa por aquí.
 */

/** Carpetas donde el admin puede guardar imágenes. */
export type UploadFolder = "courses" | "events" | "news" | "announcements" | "branding";

export type SaveImageResult = { ok: true; path: string } | { ok: false; error: string };

export async function saveImage(file: Blob, folder: UploadFolder): Promise<SaveImageResult> {
  if (file.size === 0) return { ok: false, error: "El archivo está vacío." };

  const problem = imageProblem(file);
  if (problem) return { ok: false, error: problem };

  // Nombre generado por el servidor: el del archivo original podría traer
  // rutas (../) o caracteres raros que escaparan de la carpeta.
  const name = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type as ImageMimeType]}`;
  // `folder` viene de un tipo cerrado, no del usuario: no puede escapar de public/images
  const dir = path.join(process.cwd(), "public", "images", folder);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  return { ok: true, path: `/images/${folder}/${name}` };
}
