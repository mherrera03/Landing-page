import "server-only";
import { execute, inTransaction, queryAll, queryOne } from "../connection";
import type { CourseInput } from "@/schemas/course.schema";
import type { Course, CourseCategory, CourseLevel, CourseModality, CourseStatus } from "@/types/course.types";

/** Fila tal cual viene de SQLite (sin tipos booleanos ni nulos de TypeScript). */
type CourseRow = {
  id: number;
  slug: string;
  titulo: string;
  categoria: CourseCategory;
  descripcion: string;
  estudiantes: number | null;
  nivel: CourseLevel;
  duracion_horas: number;
  modalidad: CourseModality | null;
  imagen: string;
  imagen_alt: string;
  estado: CourseStatus;
  destacado: number;
  visible: number;
  orden: number;
  creado_en: string;
  actualizado_en: string;
};

/** Convierte la fila de la base de datos al tipo que usa la interfaz. */
function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    category: row.categoria,
    description: row.descripcion,
    students: row.estudiantes,
    level: row.nivel,
    durationHours: row.duracion_horas,
    modality: row.modalidad,
    image: row.imagen,
    imageAlt: row.imagen_alt,
    status: row.estado,
    featured: row.destacado === 1,
    visible: row.visible === 1,
    order: row.orden,
    updatedAt: row.actualizado_en,
  };
}

function toRow(input: CourseInput) {
  return {
    slug: input.slug,
    titulo: input.title,
    categoria: input.category,
    descripcion: input.description,
    estudiantes: input.students,
    nivel: input.level,
    duracion_horas: input.durationHours,
    modalidad: input.modality,
    imagen: input.image,
    imagen_alt: input.imageAlt,
    estado: input.status,
    destacado: input.featured ? 1 : 0,
    visible: input.visible ? 1 : 0,
  };
}

/** Solo los visibles, para la landing. */
export function findVisible(): Course[] {
  return queryAll<CourseRow>("SELECT * FROM cursos WHERE visible = 1 ORDER BY orden, id").map(toCourse);
}

/** Todos, incluidos los ocultos: solo para el admin. */
export function findAll(): Course[] {
  return queryAll<CourseRow>("SELECT * FROM cursos ORDER BY orden, id").map(toCourse);
}

/** Los últimos que se tocaron, para el resumen del panel. */
export function findRecent(limit: number): Course[] {
  return queryAll<CourseRow>("SELECT * FROM cursos ORDER BY actualizado_en DESC, id DESC LIMIT ?", limit).map(toCourse);
}

export function findById(id: number): Course | null {
  const row = queryOne<CourseRow>("SELECT * FROM cursos WHERE id = ?", id);
  return row ? toCourse(row) : null;
}

/** Un curso oculto nunca debe poder abrirse desde una URL pública. */
export function findVisibleBySlug(slug: string): Course | null {
  const row = queryOne<CourseRow>("SELECT * FROM cursos WHERE slug = ? AND visible = 1", slug);
  return row ? toCourse(row) : null;
}

/** El curso que se muestra en la portada: el marcado como destacado, o el primero. */
export function findFeatured(): Course | null {
  const row = queryOne<CourseRow>("SELECT * FROM cursos WHERE visible = 1 ORDER BY destacado DESC, orden, id LIMIT 1");
  return row ? toCourse(row) : null;
}

/** ¿El slug ya lo usa otro curso? (el slug forma parte de la URL, debe ser único) */
export function slugTaken(slug: string, exceptId = -1): boolean {
  return queryOne("SELECT id FROM cursos WHERE slug = ? AND id != ?", slug, exceptId) !== undefined;
}

/** Solo un curso puede estar destacado a la vez. */
function clearOtherFeatured(exceptId: number) {
  execute("UPDATE cursos SET destacado = 0 WHERE id != ?", exceptId);
}

/** El curso nuevo se coloca al final del listado. */
export function create(input: CourseInput): number {
  return inTransaction(() => {
    const id = execute(
      `INSERT INTO cursos (slug, titulo, categoria, descripcion, estudiantes, nivel, duracion_horas,
                           modalidad, imagen, imagen_alt, estado, destacado, visible, orden)
       VALUES (@slug, @titulo, @categoria, @descripcion, @estudiantes, @nivel, @duracion_horas,
               @modalidad, @imagen, @imagen_alt, @estado, @destacado, @visible,
               (SELECT COALESCE(MAX(orden), 0) + 1 FROM cursos))`,
      toRow(input),
    );
    if (input.featured) clearOtherFeatured(id);
    return id;
  });
}

export function update(id: number, input: CourseInput): void {
  inTransaction(() => {
    execute(
      `UPDATE cursos SET
         slug = @slug, titulo = @titulo, categoria = @categoria, descripcion = @descripcion,
         estudiantes = @estudiantes, nivel = @nivel, duracion_horas = @duracion_horas,
         modalidad = @modalidad, imagen = @imagen, imagen_alt = @imagen_alt, estado = @estado,
         destacado = @destacado, visible = @visible,
         actualizado_en = datetime('now','localtime')
       WHERE id = @id`,
      { ...toRow(input), id },
    );
    if (input.featured) clearOtherFeatured(id);
  });
}

export function toggleVisible(id: number): void {
  execute("UPDATE cursos SET visible = 1 - visible, actualizado_en = datetime('now','localtime') WHERE id = ?", id);
}

export function remove(id: number): void {
  execute("DELETE FROM cursos WHERE id = ?", id);
}

export function countAll(): { total: number; visibles: number } {
  return queryOne<{ total: number; visibles: number }>(
    "SELECT COUNT(*) AS total, COALESCE(SUM(visible), 0) AS visibles FROM cursos",
  )!;
}
