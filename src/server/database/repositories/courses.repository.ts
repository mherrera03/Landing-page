import "server-only";
import { nowForDatabase } from "@/lib/dates";
import { execute, inTransaction, queryAll, queryOne, type Tx } from "../connection";
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
  /** Vienen del LEFT JOIN con `categorias`, no de la tabla `cursos`. */
  categoria_nombre: string;
  categoria_orden: number;
};

/** Convierte la fila de la base de datos al tipo que usa la interfaz. */
function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    category: row.categoria,
    categoryName: row.categoria_nombre,
    categoryOrder: row.categoria_orden,
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

/**
 * Todas las lecturas resuelven aquí el nombre y el orden de la categoría, para
 * que ninguna vista tenga que buscarlos por su cuenta ni recibir la lista por
 * props. `LEFT JOIN` y no `JOIN`: si una categoría se borrara dejando cursos
 * detrás, esos cursos deben seguir viéndose (con el nombre vacío), no
 * desaparecer del panel sin explicación.
 */
const SELECT_CURSO = `
  SELECT c.*,
         COALESCE(cat.nombre, '') AS categoria_nombre,
         COALESCE(cat.orden, 9999) AS categoria_orden
  FROM cursos c
  LEFT JOIN categorias cat ON cat.clave = c.categoria
`;

/** Solo los visibles, para la landing. */
export async function findVisible(): Promise<Course[]> {
  return (await queryAll<CourseRow>(`${SELECT_CURSO} WHERE c.visible = 1 ORDER BY c.orden, c.id`)).map(toCourse);
}

/** Todos, incluidos los ocultos: solo para el admin. */
export async function findAll(): Promise<Course[]> {
  return (await queryAll<CourseRow>(`${SELECT_CURSO} ORDER BY c.orden, c.id`)).map(toCourse);
}

/** Los últimos que se tocaron, para el resumen del panel. */
export async function findRecent(limit: number): Promise<Course[]> {
  return (await queryAll<CourseRow>(`${SELECT_CURSO} ORDER BY c.actualizado_en DESC, c.id DESC LIMIT ?`, limit)).map(toCourse);
}

export async function findById(id: number): Promise<Course | null> {
  const row = await queryOne<CourseRow>(`${SELECT_CURSO} WHERE c.id = ?`, id);
  return row ? toCourse(row) : null;
}

/** Un curso oculto nunca debe poder abrirse desde una URL pública. */
export async function findVisibleBySlug(slug: string): Promise<Course | null> {
  const row = await queryOne<CourseRow>(`${SELECT_CURSO} WHERE c.slug = ? AND c.visible = 1`, slug);
  return row ? toCourse(row) : null;
}

/** El curso que se muestra en la portada: el marcado como destacado, o el primero. */
export async function findFeatured(): Promise<Course | null> {
  const row = await queryOne<CourseRow>(`${SELECT_CURSO} WHERE c.visible = 1 ORDER BY c.destacado DESC, c.orden, c.id LIMIT 1`);
  return row ? toCourse(row) : null;
}

/** ¿El slug ya lo usa otro curso? (el slug forma parte de la URL, debe ser único) */
export async function slugTaken(slug: string, exceptId = -1): Promise<boolean> {
  return (await queryOne("SELECT id FROM cursos WHERE slug = ? AND id != ?", slug, exceptId)) !== undefined;
}

/** Solo un curso puede estar destacado a la vez. */
function clearOtherFeatured(tx: Tx, exceptId: number) {
  return tx.execute("UPDATE cursos SET destacado = 0 WHERE id != ?", exceptId);
}

/** El curso nuevo se coloca al final del listado. */
export function create(input: CourseInput): Promise<number> {
  return inTransaction(async (tx) => {
    const id = await tx.execute(
      `INSERT INTO cursos (slug, titulo, categoria, descripcion, estudiantes, nivel, duracion_horas,
                           modalidad, imagen, imagen_alt, estado, destacado, visible, orden,
                           creado_en, actualizado_en)
       VALUES (@slug, @titulo, @categoria, @descripcion, @estudiantes, @nivel, @duracion_horas,
               @modalidad, @imagen, @imagen_alt, @estado, @destacado, @visible,
               (SELECT COALESCE(MAX(orden), 0) + 1 FROM cursos), @now, @now)`,
      { ...toRow(input), now: nowForDatabase() },
    );
    if (input.featured) await clearOtherFeatured(tx, id);
    return id;
  });
}

export async function update(id: number, input: CourseInput): Promise<void> {
  await inTransaction(async (tx) => {
    await tx.execute(
      `UPDATE cursos SET
         slug = @slug, titulo = @titulo, categoria = @categoria, descripcion = @descripcion,
         estudiantes = @estudiantes, nivel = @nivel, duracion_horas = @duracion_horas,
         modalidad = @modalidad, imagen = @imagen, imagen_alt = @imagen_alt, estado = @estado,
         destacado = @destacado, visible = @visible,
         actualizado_en = @now
       WHERE id = @id`,
      { ...toRow(input), id, now: nowForDatabase() },
    );
    if (input.featured) await clearOtherFeatured(tx, id);
  });
}

export async function toggleVisible(id: number): Promise<void> {
  await execute("UPDATE cursos SET visible = 1 - visible, actualizado_en = ? WHERE id = ?", nowForDatabase(), id);
}

export async function remove(id: number): Promise<void> {
  await execute("DELETE FROM cursos WHERE id = ?", id);
}

export async function countAll(): Promise<{ total: number; visibles: number }> {
  return (await queryOne<{ total: number; visibles: number }>(
    "SELECT COUNT(*) AS total, COALESCE(SUM(visible), 0) AS visibles FROM cursos",
  ))!;
}
