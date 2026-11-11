import { z } from "zod";

const optionalHttpUrl = z.union([
  z.literal(""),
  z.url("Ingresa un enlace válido.").refine((url) => /^https?:\/\//i.test(url), "Usa un enlace http:// o https://."),
]);

export const settingsSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  whatsapp1: z.string().regex(/^\d{8,15}$/, "Usa solo números con código de país (8 a 15 dígitos)."),
  whatsapp2: z.union([z.literal(""), z.string().regex(/^\d{8,15}$/, "Usa solo números con código de país (8 a 15 dígitos).")]),
  address: z.string().trim().max(250, "Máximo 250 caracteres."),
  hours: z.string().trim().max(180, "Máximo 180 caracteres."),
  mapUrl: optionalHttpUrl,
  facebookUrl: optionalHttpUrl,
  instagramUrl: optionalHttpUrl,
  linkedinUrl: optionalHttpUrl,
  youtubeUrl: optionalHttpUrl,
});

export type PublicSettings = z.infer<typeof settingsSchema>;
