import type { CourseCategory } from "@/types/course.types";

/** Tupla fija: así Zod y TypeScript conservan el tipo CourseCategory. */
export const COURSE_CATEGORY_KEYS = ["tecnologia", "negocios", "habilidades"] as const satisfies readonly CourseCategory[];

export const COURSE_CATEGORIES: Record<CourseCategory, { label: string }> = {
  tecnologia: { label: "Tecnología" },
  negocios: { label: "Negocios" },
  habilidades: { label: "Habilidades" },
};
