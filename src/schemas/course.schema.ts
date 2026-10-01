import { z } from "zod";
import { COURSE_LEVELS, COURSE_MODALITIES, COURSE_STATUSES } from "@/types/course.types";
import { COURSE_CATEGORY_KEYS } from "@/constants/course-categories";

/** "Fundamentos de IA" -> "fundamentos-de-ia" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const courseSchema = z.object({
  title: z.string().trim().min(5, "El título debe tener al menos 5 caracteres.").max(120, "El título es demasiado largo."),
  slug: z
    .string()
    .trim()
    .min(3, "La dirección debe tener al menos 3 caracteres.")
    .max(80, "La dirección es demasiado larga.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Usa solo minúsculas, números y guiones. Ejemplo: marketing-digital."),
  category: z.enum(COURSE_CATEGORY_KEYS, "Selecciona una categoría."),
  description: z.string().trim().min(10, "Escribe una descripción de al menos 10 caracteres.").max(500, "La descripción no puede pasar de 500 caracteres."),
  level: z.enum(COURSE_LEVELS, "Selecciona un nivel."),
  durationHours: z.coerce.number<number>().int("Escribe un número entero.").min(1, "Debe ser al menos 1 hora.").max(2000, "¿Seguro que son tantas horas?"),
  // Vacío = aún no hay estudiantes inscritos
  students: z
    .union([z.literal(""), z.coerce.number<number>().int("Escribe un número entero.").min(0, "No puede ser negativo").max(1000000)])
    .transform((v) => (v === "" ? null : v)),
  modality: z.union([z.literal(""), z.enum(COURSE_MODALITIES)]).transform((v) => (v === "" ? null : v)),
  image: z.string().trim().min(1, "Sube una imagen para el curso."),
  imageAlt: z
    .string()
    .trim()
    .min(5, "Describe la imagen en pocas palabras (lo leen quienes no pueden verla).")
    .max(200, "La descripción de la imagen es demasiado larga."),
  status: z.enum(COURSE_STATUSES, "Selecciona un estado."),
  featured: z.coerce.boolean<boolean>(),
  visible: z.coerce.boolean<boolean>(),
});

export type CourseFormInput = z.infer<typeof courseSchema>;
export type CourseFormField = keyof CourseFormInput;
