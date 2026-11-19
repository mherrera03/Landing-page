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
  "image/svg+xml": "svg",
} as const;

export type ImageMimeType = keyof typeof IMAGE_EXTENSIONS;

export const SVG_MIME_TYPE = "image/svg+xml" satisfies ImageMimeType;

/**
 * SVG solo se acepta donde se pide expresamente (el logo): es un documento que
 * puede traer scripts y no sirve, por ejemplo, como imagen para compartir.
 */
export type ImageRulesOptions = { allowSvg?: boolean };

export function imageMimeTypes({ allowSvg = false }: ImageRulesOptions = {}): ImageMimeType[] {
  return (Object.keys(IMAGE_EXTENSIONS) as ImageMimeType[]).filter((type) => allowSvg || type !== SVG_MIME_TYPE);
}

/** Formatos aceptados, para mostrarlos a quien sube la imagen. */
export function imageFormatsLabel({ allowSvg = false }: ImageRulesOptions = {}): string {
  return allowSvg ? "WebP, JPG, PNG, AVIF o SVG" : "WebP, JPG, PNG o AVIF";
}

export const MAX_IMAGE_MB = 4;

const BYTES_PER_MB = 1024 * 1024;

/** Devuelve el motivo por el que la imagen no sirve, o null si está bien. */
export function imageProblem(file: { type: string; size: number }, options: ImageRulesOptions = {}): string | null {
  if (!(imageMimeTypes(options) as string[]).includes(file.type)) {
    return `Formato no permitido. Usa ${imageFormatsLabel(options)}.`;
  }
  if (file.size > MAX_IMAGE_MB * BYTES_PER_MB) {
    return `La imagen pesa ${(file.size / BYTES_PER_MB).toFixed(1)} MB. El máximo son ${MAX_IMAGE_MB} MB.`;
  }
  return null;
}
