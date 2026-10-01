import { z } from "zod";

export const LEAD_INTERESTS = ["Cursos", "Diplomados", "Capacitación empresarial", "Otros"] as const;

// Lo usan el formulario (cliente) y la API (servidor): una sola fuente de verdad.
export const leadSchema = z.object({
  name: z.string().trim().min(3, "Escribe tu nombre completo (mínimo 3 letras).").max(120, "El nombre es demasiado largo."),
  email: z.string().trim().toLowerCase().pipe(z.email("Escribe un correo válido, por ejemplo nombre@correo.com.")),
  phone: z
    .string()
    .trim()
    .max(20, "El teléfono es demasiado largo.")
    .regex(/^[0-9+()\-\s]*$/, "Usa solo números, espacios, + y guiones."),
  interest: z.enum(LEAD_INTERESTS, "Selecciona una opción."),
  message: z.string().trim().max(1000, "El mensaje no puede pasar de 1000 caracteres."),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadField = keyof LeadInput;
