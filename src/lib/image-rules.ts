/**
 * Reglas de las imágenes que se suben desde el panel.
 * Las comparten el formulario (para avisar al instante) y el servidor (que es
 * quien decide de verdad): así no pueden desincronizarse.
 */

/** Formatos aceptados y la extensión con la que se guarda cada uno. */
export const IMAGE_EXTENSIONS = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/avif": "avif",
} as const;

export type ImageMimeType = keyof typeof IMAGE_EXTENSIONS;

export const IMAGE_MIME_TYPES = Object.keys(IMAGE_EXTENSIONS) as ImageMimeType[];

export const MAX_IMAGE_MB = 4;

const BYTES_PER_MB = 1024 * 1024;

/** Devuelve el motivo por el que la imagen no sirve, o null si está bien. */
export function imageProblem(file: { type: string; size: number }): string | null {
  if (!(IMAGE_MIME_TYPES as string[]).includes(file.type)) {
    return "Formato no permitido. Usa WebP, JPG, PNG o AVIF.";
  }
  if (file.size > MAX_IMAGE_MB * BYTES_PER_MB) {
    return `La imagen pesa ${(file.size / BYTES_PER_MB).toFixed(1)} MB. El máximo son ${MAX_IMAGE_MB} MB.`;
  }
  return null;
}
