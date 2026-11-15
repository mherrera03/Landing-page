import { z } from "zod";
import { isRealDate, optionalHttpUrl, optionalLocalImage, slugField } from "./shared";

/** Fecha y hora de un campo datetime-local ("2026-11-15T14:30"), o vacío si no se programa. */
const scheduledDate = z.union([
  z.literal(""),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/, "Usa fecha y hora válidas.")
    .refine((value) => isRealDate(value.slice(0, 10)), "La fecha no existe."),
]);

export const publicationSchema = z
  .object({
    slug: slugField,
    title: z.string().trim().min(5, "El título debe tener al menos 5 caracteres.").max(150, "Máximo 150 caracteres."),
    summary: z.string().trim().min(10, "Escribe un resumen de al menos 10 caracteres.").max(300, "Máximo 300 caracteres."),
    content: z.string().trim().max(10000, "Máximo 10 000 caracteres."),
    image: optionalLocalImage,
    imageAlt: z.string().trim().max(200, "Máximo 200 caracteres."),
    link: optionalHttpUrl,
    startsAt: scheduledDate,
    endsAt: scheduledDate,
    visible: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.image && !data.imageAlt) {
      ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "Describe la imagen." });
    }
    if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "El fin debe ser posterior al inicio." });
    }
  });

export type PublicationInput = z.infer<typeof publicationSchema>;
export type PublicationFormField = keyof PublicationInput;
