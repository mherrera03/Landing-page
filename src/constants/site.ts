export const SITE = {
  name: "UGB Plus",
  tagline: "Formación Continua",
  university: "Universidad Gerardo Barrios",
  description:
    "Programas, cursos y experiencias de formación continua de la Universidad Gerardo Barrios para profesionales, estudiantes y organizaciones.",
  email: "ugbplus@ugb.edu.sv",
  locale: "es_SV",
} as const;

/**
 * Líneas de WhatsApp de UGB Plus.
 * `number` va en formato internacional sin signos, como lo pide wa.me.
 */
export const WHATSAPP_LINES = [
  { number: "50326456571", label: "+503 2645-6571" },
  { number: "50326456572", label: "+503 2645-6572" },
] as const;
