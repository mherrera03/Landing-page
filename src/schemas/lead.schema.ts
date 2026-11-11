import { z } from "zod";
import { isValidPhoneNumber, validatePhoneNumberLength } from "libphonenumber-js";
import { COUNTRIES } from "@/constants/countries";

export const LEAD_INTERESTS = ["Cursos", "Diplomados", "Capacitación empresarial", "Otros"] as const;

// Lo usan el formulario (cliente) y la API (servidor): una sola fuente de verdad.
export const leadSchema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo (mínimo 3 letras).").max(120, "El nombre es demasiado largo."),
  email: z.string().trim().toLowerCase().pipe(z.email("Escribe un correo válido, por ejemplo nombre@correo.com.")),
  country: z.enum(COUNTRIES, "Selecciona tu país."),
  // El formulario arma el número completo con la clave del país elegido
  // ("+503 7777 7777"); aquí se valida contra las reglas de numeración de ese país.
  phone: z
    .string()
    .trim()
    .min(1, "Escribe tu número de teléfono.")
    .superRefine((value, ctx) => {
      if (!value) return; // ya lo reporta .min()
      if (!value.startsWith("+")) {
        ctx.addIssue({ code: "custom", message: "Falta la clave del país." });
      } else if (validatePhoneNumberLength(value) === "TOO_LONG") {
        ctx.addIssue({ code: "custom", message: "El número tiene demasiados dígitos." });
      } else if (!isValidPhoneNumber(value)) {
        ctx.addIssue({ code: "custom", message: "El número está incompleto o no es válido para ese país." });
      }
    }),
  interest: z.enum(LEAD_INTERESTS, "Selecciona una opción."),
  message: z.string().trim().max(1000, "El mensaje no puede pasar de 1000 caracteres."),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadField = keyof LeadInput;
