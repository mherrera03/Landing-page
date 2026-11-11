import { z } from "zod";
import { SITE } from "@/constants/site";

const localImage = z.union([z.literal(""), z.string().regex(/^\/images\/[a-zA-Z0-9/_-]+\.(?:png|jpg|jpeg|webp|avif)$/, "Usa una imagen del sitio.")]);

export const brandSchema = z.object({
  siteDescription: z.string().trim().min(30, "Escribe al menos 30 caracteres.").max(300, "Máximo 300 caracteres."),
  siteUrl: z.union([z.literal(""), z.url("Ingresa una URL válida.").refine((url) => /^https?:\/\//i.test(url), "Usa http:// o https://.")]),
  logoImage: localImage,
  logoAlt: z.string().trim().max(150),
  shareImage: localImage,
  shareImageAlt: z.string().trim().max(200),
}).superRefine((data, ctx) => {
  if (data.logoImage && !data.logoAlt) ctx.addIssue({ code: "custom", path: ["logoAlt"], message: "Describe el logo." });
  if (data.shareImage && !data.shareImageAlt) ctx.addIssue({ code: "custom", path: ["shareImageAlt"], message: "Describe la imagen para compartir." });
});

export type BrandSettings = z.infer<typeof brandSchema>;

export const BRAND_DEFAULTS: BrandSettings = {
  siteDescription: SITE.description,
  siteUrl: "",
  logoImage: "/images/logo.png",
  logoAlt: "UGB Plus",
  shareImage: "",
  shareImageAlt: "",
};
