import { z } from "zod";
import { SLUG_MAX } from "@/lib/text";

/** Piezas de validación que comparten varios formularios del panel. */

/** Dirección web de un curso, evento o publicación: forma parte de la URL. */
export const slugField = z
  .string()
  .trim()
  .min(3, "La dirección debe tener al menos 3 caracteres.")
  .max(SLUG_MAX, "La dirección es demasiado larga.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa solo minúsculas, números y guiones. Ejemplo: marketing-digital.");

/**
 * Ruta de una imagen guardada en el propio sitio (las que genera uploads.ts).
 * La ruta viaja en un campo oculto del formulario: sin esta comprobación se
 * podría colar una dirección externa, que next/image se niega a mostrar.
 */
const LOCAL_IMAGE = /^\/images\/[a-zA-Z0-9/_-]+\.(?:png|jpg|jpeg|webp|avif)$/;
const LOCAL_IMAGE_MESSAGE = "Usa una imagen del sitio.";

export const localImage = (requiredMessage: string) =>
  z.string().trim().min(1, requiredMessage).regex(LOCAL_IMAGE, LOCAL_IMAGE_MESSAGE);

export const optionalLocalImage = z.union([z.literal(""), z.string().regex(LOCAL_IMAGE, LOCAL_IMAGE_MESSAGE)]);

/** Solo http y https: un enlace `javascript:` o `data:` nunca debe llegar a un href. */
export const httpUrl = z
  .url("Ingresa un enlace válido.")
  .refine((url) => /^https?:\/\//i.test(url), "El enlace debe empezar con http:// o https://.");

export const optionalHttpUrl = z
  .string()
  .trim()
  .pipe(z.union([z.literal(""), httpUrl]));

/** ¿La fecha "AAAA-MM-DD" existe en el calendario? (el 30 de febrero pasa el formato, pero no existe) */
export function isRealDate(isoDate: string): boolean {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === isoDate;
}
