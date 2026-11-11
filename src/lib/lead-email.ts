import { LEAD_INTERESTS } from "@/schemas/lead.schema";
import { SITE } from "@/constants/site";
import type { Lead } from "@/types/lead.types";

type LeadInterest = (typeof LEAD_INTERESTS)[number];

type EmailTemplate = {
  subject: string;
  /** Recibe el nombre del interesado y devuelve el cuerpo en texto plano. */
  body: (name: string) => string;
};

const FIRMA = `\n\nSaludos cordiales,\nEquipo ${SITE.name} - ${SITE.tagline}\n${SITE.university}\n${SITE.email}`;

/**
 * Plantillas por tipo de interés. El Record obliga a tener una por cada opción
 * de LEAD_INTERESTS: si se agrega una opción nueva, TypeScript avisará aquí.
 */
const TEMPLATES: Record<LeadInterest, EmailTemplate> = {
  Cursos: {
    subject: `${SITE.name} - Información sobre nuestros cursos`,
    body: (name) =>
      `Hola, ${name}:\n\nGracias por tu interés en los cursos de ${SITE.name}. ` +
      `Te compartimos la información de nuestra oferta actual...` +
      FIRMA,
  },
  Diplomados: {
    subject: `${SITE.name} - Información sobre nuestros diplomados`,
    body: (name) =>
      `Hola, ${name}:\n\nGracias por tu interés en los diplomados de ${SITE.name}. ` +
      `A continuación te detallamos los programas disponibles...` +
      FIRMA,
  },
  "Capacitación empresarial": {
    subject: `${SITE.name} - Capacitación empresarial`,
    body: (name) =>
      `Estimado/a ${name}:\n\nGracias por considerar a ${SITE.name} para la capacitación de su organización. ` +
      `Para preparar una propuesta a la medida, nos gustaría conocer...` +
      FIRMA,
  },
  Otros: {
    subject: `${SITE.name} - Respuesta a tu solicitud`,
    body: (name) =>
      `Hola, ${name}:\n\nGracias por escribirnos. Hemos recibido tu solicitud y...` +
      FIRMA,
  },
};

function isLeadInterest(value: string): value is LeadInterest {
  return (LEAD_INTERESTS as readonly string[]).includes(value);
}

/** Arma el enlace mailto: con asunto y cuerpo según el interés del lead. */
export function leadMailto(lead: Pick<Lead, "email" | "name" | "interest">): string {
  const template = TEMPLATES[isLeadInterest(lead.interest) ? lead.interest : "Otros"];
  // \r\n es el salto de línea que mejor respetan Outlook y Gmail en mailto.
  const body = template.body(lead.name).replace(/\n/g, "\r\n");
  const params = `subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(body)}`;
  return `mailto:${lead.email}?${params}`;
}