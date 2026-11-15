import { z } from "zod";
import { SITE } from "@/constants/site";
import { optionalHttpUrl, optionalLocalImage } from "./shared";

export const brandSchema = z
  .object({
    siteDescription: z.string().trim().min(30, "Escribe al menos 30 caracteres.").max(300, "Máximo 300 caracteres."),
    siteUrl: optionalHttpUrl,
    logoImage: optionalLocalImage,
    logoAlt: z.string().trim().max(150, "Máximo 150 caracteres."),
    shareImage: optionalLocalImage,
    shareImageAlt: z.string().trim().max(200, "Máximo 200 caracteres."),
  })
  .superRefine((data, ctx) => {
    if (data.logoImage && !data.logoAlt) {
      ctx.addIssue({ code: "custom", path: ["logoAlt"], message: "Describe el logo." });
    }
    if (data.shareImage && !data.shareImageAlt) {
      ctx.addIssue({ code: "custom", path: ["shareImageAlt"], message: "Describe la imagen para compartir." });
    }
  });

export type BrandSettings = z.infer<typeof brandSchema>;

export const BRAND_DEFAULTS: BrandSettings = {
  siteDescription: SITE.description,
  siteUrl: "",
  logoImage: "/images/logo.png",
  logoAlt: SITE.name,
  shareImage: "",
  shareImageAlt: "",
};
