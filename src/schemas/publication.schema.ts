import { z } from "zod";

const scheduledDate = z.union([
  z.literal(""),
  z.string().regex(/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/, "Usa fecha y hora válidas.")
    .refine((value) => {
      const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value.slice(0, 10);
    }, "La fecha no existe."),
]);

export const publicationSchema = z.object({
  slug: z.string().trim().min(3, "La dirección debe tener al menos 3 caracteres.").max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa minúsculas, números y guiones."),
  title: z.string().trim().min(5, "El título debe tener al menos 5 caracteres.").max(150),
  summary: z.string().trim().min(10, "Escribe un resumen de al menos 10 caracteres.").max(300),
  content: z.string().trim().max(10000),
  image: z.string().trim(),
  imageAlt: z.string().trim().max(200),
  link: z.union([z.literal(""), z.string().trim().url("Ingresa un enlace válido.").refine((url) => /^https?:\/\//i.test(url), "El enlace debe empezar con http:// o https://.")]),
  startsAt: scheduledDate,
  endsAt: scheduledDate,
  visible: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.image && !data.imageAlt) ctx.addIssue({ code: "custom", path: ["imageAlt"], message: "Describe la imagen." });
  if (data.startsAt && data.endsAt && data.endsAt <= data.startsAt) ctx.addIssue({ code: "custom", path: ["endsAt"], message: "El fin debe ser posterior al inicio." });
});

export type PublicationInput = z.infer<typeof publicationSchema>;
