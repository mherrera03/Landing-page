import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Guarda las imágenes que suben desde el admin.
 *
 * Hoy escribe en public/images/courses (sirve en tu PC y en un VPS).
 * Si algún día se publica en Vercel o similar, donde el disco se borra en cada
 * despliegue, basta con reescribir `saveImage` para que suba a un servicio en la
 * nube: el resto de la aplicación no cambia porque todo pasa por aquí.
 */
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "courses");
const PUBLIC_PREFIX = "/images/courses";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
export const ALLOWED_IMAGE_TYPES = ["image/webp", "image/jpeg", "image/png", "image/avif"] as const;

const EXTENSION: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
};

export type SaveImageResult = { ok: true; path: string } | { ok: false; error: string };

export async function saveImage(file: Blob): Promise<SaveImageResult> {
  if (file.size === 0) return { ok: false, error: "El archivo está vacío." };
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo son 4 MB.` };
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return { ok: false, error: "Formato no permitido. Usa WebP, JPG, PNG o AVIF." };
  }

  // Nombre generado por el servidor: el del archivo original podría traer
  // rutas (../) o caracteres raros que escaparan de la carpeta.
  const name = `${crypto.randomUUID()}.${EXTENSION[file.type]}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));

  return { ok: true, path: `${PUBLIC_PREFIX}/${name}` };
}
