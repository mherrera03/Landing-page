export type CourseCategory = "tecnologia" | "negocios" | "habilidades";

export const COURSE_LEVELS = ["Básico", "Intermedio", "Avanzado"] as const;
export const COURSE_MODALITIES = ["Híbrida", "Virtual", "Presencial"] as const;
export const COURSE_STATUSES = ["activo", "proximamente"] as const;

export type CourseLevel = (typeof COURSE_LEVELS)[number];
export type CourseModality = (typeof COURSE_MODALITIES)[number];
export type CourseStatus = (typeof COURSE_STATUSES)[number];

export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
  activo: "Activo",
  proximamente: "Próximamente",
};

export interface Course {
  id: number;
  slug: string;
  title: string;
  category: CourseCategory;
  description: string;
  /** null cuando el curso aún no ha abierto */
  students: number | null;
  level: CourseLevel;
  durationHours: number;
  modality: CourseModality | null;
  image: string;
  imageAlt: string;
  status: CourseStatus;
  /** Se muestra en la portada. Solo un curso puede estarlo. */
  featured: boolean;
  /** Si es false, no aparece en la landing. */
  visible: boolean;
  order: number;
  updatedAt: string;
}
