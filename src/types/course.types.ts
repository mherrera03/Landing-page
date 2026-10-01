export type CourseCategory = "tecnologia" | "negocios" | "habilidades";
export type CourseStatus = "activo" | "proximamente";
export type CourseLevel = "Básico" | "Intermedio" | "Avanzado";
export type CourseModality = "Híbrida" | "Virtual" | "Presencial";

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
  featured?: boolean;
}
