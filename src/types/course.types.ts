export type CourseCategory = "tecnologia" | "negocios" | "habilidades";
export type CourseStatus = "activo" | "proximamente";
export type CourseLevel = "Básico" | "Intermedio" | "Avanzado";
export type CourseModality = "Híbrida" | "Virtual" | "Presencial";

export const COURSE_LEVELS: CourseLevel[] = ["Básico", "Intermedio", "Avanzado"];
export const COURSE_MODALITIES: CourseModality[] = ["Híbrida", "Virtual", "Presencial"];
export const COURSE_STATUSES: CourseStatus[] = ["activo", "proximamente"];

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
