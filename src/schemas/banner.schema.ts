import { z } from "zod";

export const bannerSchema = z.object({
  image: z.string().trim().min(1, "Sube una imagen para el banner."),

  imageAlt: z
    .string()
    .trim()
    .min(5, "Describe brevemente la imagen.")
    .max(200, "Máximo 200 caracteres."),

  visible: z.boolean(),
});

export type BannerInput = z.infer<typeof bannerSchema>;
export type BannerFormField = keyof BannerInput;
