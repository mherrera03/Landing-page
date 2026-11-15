import { z } from "zod";
import { todayInElSalvador } from "@/lib/dates";

const text = (min: number, max: number) =>
  z.string().trim().min(min, `Escribe al menos ${min} caracteres.`).max(max, `Máximo ${max} caracteres.`);

const integer = (min: number, max: number) =>
  z.coerce
    .number("Escribe un número.")
    .int("Escribe un número entero.")
    .min(min, `El mínimo es ${min}.`)
    .max(max, `El máximo es ${max}.`);

/** Destino de un botón: una ruta interna (/#contacto) o un enlace http(s). */
const destination = z
  .string()
  .trim()
  .min(1, "Escribe una dirección.")
  .refine((value) => {
    if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
    try {
      const url = new URL(value);
      return (url.protocol === "http:" || url.protocol === "https:") && !!url.hostname;
    } catch {
      return false;
    }
  }, "Usa una ruta interna como /#contacto o un enlace http(s).");

export const landingSchema = z.object({
  heroTitle1: text(5, 100),
  heroTitle2: text(5, 100),
  heroDescription: text(20, 400),
  heroPrimaryLabel: text(2, 40),
  heroPrimaryHref: destination,
  heroSecondaryLabel: text(2, 40),
  heroSecondaryHref: destination,
  contactButtonLabel: text(2, 40),
  contactButtonHref: destination,
  heroActivePrograms: integer(0, 1_000_000),
  heroPracticePercent: integer(0, 100),
  foundingYear: integer(1900, 9999).refine(
    (year) => year <= Number(todayInElSalvador().slice(0, 4)),
    "El año no puede estar en el futuro.",
  ),
  peopleTrained: integer(0, 100_000_000),
  programsDelivered: integer(0, 1_000_000),
  satisfactionPercent: integer(0, 100),
});

export type LandingSettings = z.infer<typeof landingSchema>;

export const LANDING_DEFAULTS: LandingSettings = {
  heroTitle1: "Actualiza tus habilidades.",
  heroTitle2: "Expande tu futuro.",
  heroDescription:
    "Programas, cursos y experiencias de formación continua pensadas para profesionales, estudiantes y organizaciones que buscan mantenerse relevantes en un entorno que cambia.",
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
