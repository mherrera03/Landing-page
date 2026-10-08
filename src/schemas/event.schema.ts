import { z } from "zod";
import { EVENT_KINDS } from "@/types/event.types";

const kinds = EVENT_KINDS as [typeof EVENT_KINDS[number], ...typeof EVENT_KINDS];

export const eventSchema = z.object({
  title: z.string().trim().min(5, "El título debe tener al menos 5 caracteres.").max(120, "El título es demasiado largo."),
  slug: z
    .string()
    .trim()
    .min(3, "La dirección debe tener al menos 3 caracteres.")
    .max(80, "La dirección es demasiado larga.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa solo minúsculas, números y guiones. Ejemplo: masterclass-abierta."),
  kind: z.enum(kinds, "Selecciona un tipo."),
  tag: z.string().trim().min(2, "Escribe una etiqueta corta, por ejemplo: Próximamente.").max(30, "La etiqueta debe ser corta (máximo 30 caracteres)."),
  description: z
    .string()
    .trim()
    .min(10, "Escribe una descripción de al menos 10 caracteres.")
    .max(400, "La descripción no puede pasar de 400 caracteres."),
  // Vacío = sin fecha concreta (las noticias no la llevan)
  date: z
    .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Usa el selector de fecha.")])
    .transform((v) => (v === "" ? null : v)),
  place: z.string().trim().max(80, "El lugar es demasiado largo."),
  // Admite enlaces externos (https://…) y secciones de la propia landing (/#contacto)
  link: z
    .union([
      z.literal(""),
      z.string().trim().regex(/^(https?:\/\/\S+|\/[^\s]*)$/, "Escribe un enlace que empiece con https:// o con / para una sección del sitio."),
    ])
    .transform((v) => v.trim()),
  linkText: z.string().trim().max(40, "El texto del botón debe ser corto."),
  visible: z.coerce.boolean<boolean>(),
});

export type EventFormInput = z.infer<typeof eventSchema>;
export type EventFormField = keyof EventFormInput;
