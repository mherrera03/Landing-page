import { z } from "zod";
import { todayInElSalvador } from "@/lib/dates";

const destination = z.string().trim().min(1, "Escribe una dirección.").refine(
  (value) => {
    if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
    try {
      const url = new URL(value);
      return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname;
    } catch {
      return false;
    }
  },
  "Usa una ruta interna como /#contacto o un enlace http(s).",
);

export const landingSchema = z.object({
  heroTitle1: z.string().trim().min(5).max(100),
  heroTitle2: z.string().trim().min(5).max(100),
  heroDescription: z.string().trim().min(20).max(400),
  heroPrimaryLabel: z.string().trim().min(2).max(40),
  heroPrimaryHref: destination,
  heroSecondaryLabel: z.string().trim().min(2).max(40),
  heroSecondaryHref: destination,
  contactButtonLabel: z.string().trim().min(2).max(40),
  contactButtonHref: destination,
  heroActivePrograms: z.coerce.number().int().min(0).max(1000000),
  heroPracticePercent: z.coerce.number().int().min(0).max(100),
  foundingYear: z.coerce.number().int().min(1900).refine((year) => year <= Number(todayInElSalvador().slice(0, 4)), "El año no puede estar en el futuro."),
  peopleTrained: z.coerce.number().int().min(0).max(100000000),
  programsDelivered: z.coerce.number().int().min(0).max(1000000),
  satisfactionPercent: z.coerce.number().int().min(0).max(100),
});

export type LandingSettings = z.infer<typeof landingSchema>;

export const LANDING_DEFAULTS: LandingSettings = {
  heroTitle1: "Actualiza tus habilidades.",
  heroTitle2: "Expande tu futuro.",
  heroDescription: "Programas, cursos y experiencias de formación continua pensadas para profesionales, estudiantes y organizaciones que buscan mantenerse relevantes en un entorno que cambia.",
  heroPrimaryLabel: "Explorar programas",
  heroPrimaryHref: "/#programas",
  heroSecondaryLabel: "Conocer UGB Plus",
  heroSecondaryHref: "/#nosotros",
  contactButtonLabel: "Inscribirme",
  contactButtonHref: "/#contacto",
  heroActivePrograms: 20,
  heroPracticePercent: 100,
  foundingYear: 2016,
  peopleTrained: 4999,
  programsDelivered: 99,
  satisfactionPercent: 98,
};
