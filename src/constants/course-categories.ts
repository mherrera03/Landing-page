import type { CourseCategory } from "@/types/course.types";

export const COURSE_CATEGORIES: Record<CourseCategory, { label: string }> = {
  tecnologia: { label: "Tecnología" },
  negocios: { label: "Negocios" },
  habilidades: { label: "Habilidades" },
};

export const COURSE_CATEGORY_KEYS = Object.keys(COURSE_CATEGORIES) as CourseCategory[];
