import { z } from "zod";
import { optionalHttpUrl } from "./shared";

/** Como lo pide wa.me: solo dígitos, con el código de país por delante. */
const whatsappNumber = z.string().trim().regex(/^\d{8,15}$/, "Usa solo números con código de país (8 a 15 dígitos).");

export const settingsSchema = z.object({
  email: z.string().trim().pipe(z.email("Ingresa un correo válido.")),
  whatsapp1: whatsappNumber,
  whatsapp2: z.union([z.literal(""), whatsappNumber]),
  address: z.string().trim().max(250, "Máximo 250 caracteres."),
  hours: z.string().trim().max(180, "Máximo 180 caracteres."),
  mapUrl: optionalHttpUrl,
  facebookUrl: optionalHttpUrl,
  instagramUrl: optionalHttpUrl,
  linkedinUrl: optionalHttpUrl,
  youtubeUrl: optionalHttpUrl,
});

export type PublicSettings = z.infer<typeof settingsSchema>;
