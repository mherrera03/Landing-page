import { z } from "zod";
import { COUNTRIES } from "@/constants/countries";

export const LEAD_INTERESTS = ["Cursos", "Diplomados", "Capacitación empresarial", "Otros"] as const;

/** Cuenta solo los dígitos, ignorando espacios, guiones y paréntesis. */
const countDigits = (value: string) => value.match(/\d/g)?.length ?? 0;

// Lo usan el formulario (cliente) y la API (servidor): una sola fuente de verdad.
export const leadSchema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo (mínimo 3 letras).").max(120, "El nombre es demasiado largo."),
  email: z.string().trim().toLowerCase().pipe(z.email("Escribe un correo válido, por ejemplo nombre@correo.com.")),
  country: z.enum(COUNTRIES, "Selecciona tu país."),
  phone: z
    .string()
    .trim()
    .min(1, "Escribe tu número de teléfono.")
    .max(25, "El teléfono es demasiado largo.")
    // El código de país (clave LADA) es obligatorio
    .regex(/^\+/, "Empieza con la clave de tu país. Ejemplo: +503 7777-7777.")
    .regex(/^\+[\d\s()-]+$/, "Después del + usa solo números, espacios, paréntesis y guiones.")
    .refine((v) => countDigits(v) >= 9, "El número parece incompleto. Ejemplo: +503 7777-7777.")
    .refine((v) => countDigits(v) <= 15, "El número tiene demasiados dígitos."),
  interest: z.enum(LEAD_INTERESTS, "Selecciona una opción."),
  message: z.string().trim().max(1000, "El mensaje no puede pasar de 1000 caracteres."),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadField = keyof LeadInput;
