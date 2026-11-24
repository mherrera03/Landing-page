/**
 * La clave de una categoría. Dejó de ser una unión cerrada cuando las
 * categorías pasaron a crearse desde el panel: el compilador ya no puede saber
 * cuáles existen. Quien guarde un curso lo comprueba contra la tabla.
 */
export type CourseCategory = string;

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
  /** Nombre visible de la categoría, ya resuelto. "" si la categoría se borró. */
  categoryName: string;
  /** Orden de su categoría, para la barra de filtros. 9999 si se borró: al final. */
  categoryOrder: number;
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
