import { z } from "zod";
import { slugify } from "@/lib/text";

/**
 * La clave no está aquí a propósito: no es un campo del formulario. Se genera
 * del nombre al crear la categoría y después queda fija.
 *
 * Tampoco se reutiliza `slugField` para el nombre: exige tres caracteres y
 * rechazaría nombres legítimos como "IA" o "TI".
 */
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(60, "El nombre no puede pasar de 60 caracteres.")
    // Un nombre de solo símbolos ("!!!") daría una clave vacía.
    .refine((value) => slugify(value).length > 0, "Escribe un nombre con letras o números."),
  order: z.coerce
    .number("Escribe un número.")
    .int("Escribe un número entero.")
    .min(0, "El mínimo es 0.")
    .max(9999, "El máximo es 9999."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
export type CategoryFormField = keyof CategoryInput;
