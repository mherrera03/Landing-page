import { z } from "zod";

export const settingsSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  whatsapp1: z.string().regex(/^\d{8,15}$/, "Usa solo números con código de país (8 a 15 dígitos)."),
  whatsapp2: z.union([z.literal(""), z.string().regex(/^\d{8,15}$/, "Usa solo números con código de país (8 a 15 dígitos).")]),
});

export type PublicSettings = z.infer<typeof settingsSchema>;
