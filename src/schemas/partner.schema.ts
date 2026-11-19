import { z } from "zod";
import { PARTNER_GROUPS } from "@/types/partner.types";
import { localImageOrSvg, optionalHttpUrl } from "./shared";

export const partnerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe el nombre de la institución.")
    .max(120, "El nombre no puede pasar de 120 caracteres."),
  logo: localImageOrSvg("Sube el logo de la institución."),
  url: optionalHttpUrl,
  group: z.enum(PARTNER_GROUPS, "Selecciona un grupo."),
  order: z.coerce
    .number("Escribe un número.")
    .int("Escribe un número entero.")
    .min(0, "El mínimo es 0.")
    .max(9999, "El máximo es 9999."),
  visible: z.boolean(),
});

export type PartnerInput = z.infer<typeof partnerSchema>;
export type PartnerFormField = keyof PartnerInput;
