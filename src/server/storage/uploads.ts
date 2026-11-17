import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { put, del } from "@vercel/blob";
import { IMAGE_EXTENSIONS, imageProblem, type ImageMimeType } from "@/lib/image-rules";

/**
 * Guarda las imágenes que suben desde el panel.
 *
 * Hay dos destinos y los elige el entorno, no quien llama:
 *
 * - Sin configurar nada, escribe en `public/images/<carpeta>`. Es lo que sirve
 *   en tu equipo y en un VPS, donde el disco es permanente.
 * - Con `BLOB_READ_WRITE_TOKEN`, sube a Vercel Blob. Hace falta en Vercel,
 *   donde el disco es de solo lectura y además se borra en cada despliegue.
 *
 * Lo único que cambia para el resto de la aplicación es la ruta devuelta:
 * local es `/images/...` y en Blob una URL completa. Ambas valen tal cual en
 * `next/image` (el dominio de Blob está permitido en next.config.ts).
 */

/** Carpetas donde el panel puede guardar imágenes. */
export type UploadFolder = "courses" | "events" | "news" | "announcements" | "branding";

export type SaveImageResult = { ok: true; path: string } | { ok: false; error: string };

function usaBlob(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export async function saveImage(file: Blob, folder: UploadFolder): Promise<SaveImageResult> {
  if (file.size === 0) return { ok: false, error: "El archivo está vacío." };

  const problem = imageProblem(file);
  if (problem) return { ok: false, error: problem };

  // Nombre generado por el servidor: el del archivo original podría traer
  // rutas (../) o caracteres raros que escaparan de la carpeta.
  const name = `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type as ImageMimeType]}`;

  try {
    if (usaBlob()) {
      // `addRandomSuffix: false` porque el nombre ya es un UUID irrepetible
      const { url } = await put(`${folder}/${name}`, file, { access: "public", addRandomSuffix: false });
      return { ok: true, path: url };
    }

    // `folder` viene de un tipo cerrado, no del usuario: no puede escapar de public/images
    const dir = path.join(process.cwd(), "public", "images", folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

    return { ok: true, path: `/images/${folder}/${name}` };
  } catch (error) {
    console.error("[uploads] no se pudo guardar la imagen", error);
    return { ok: false, error: "No pudimos guardar la imagen. Vuelve a intentarlo." };
  }
}

/**
 * Borra una imagen que ya nadie usa, para no acumular archivos huérfanos.
 *
 * Nunca interrumpe la operación que la llamó: si falla, solo queda el aviso en
 * el registro. Perder una imagen suelta es mucho menos grave que impedir que se
 * guarde un curso.
 */
export async function deleteImage(ruta: string): Promise<void> {
  if (!ruta) return;

  try {
    if (ruta.startsWith("http")) {
      if (usaBlob()) await del(ruta);
      return;
    }

    // Solo las que subió el panel; las de ejemplo vienen con el repositorio
    if (!ruta.startsWith("/images/")) return;
    await fs.unlink(path.join(process.cwd(), "public", ruta));
  } catch (error) {
    console.warn("[uploads] no se pudo borrar la imagen", ruta, error);
  }
}
