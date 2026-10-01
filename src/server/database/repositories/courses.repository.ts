import "server-only";
import { db } from "../connection";
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

/** Datos que el admin envía al crear o editar un curso. */
export type CourseInput = {
  slug: string;
  title: string;
  category: CourseCategory;
  description: string;
  students: number | null;
  level: CourseLevel;
  durationHours: number;
  modality: CourseModality | null;
  image: string;
  imageAlt: string;
  status: CourseStatus;
  featured: boolean;
  visible: boolean;
  order: number;
};

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
    orden: input.order,
  };
}

/** Solo los visibles, para la landing. */
export function findVisible(): Course[] {
  const rows = db.prepare("SELECT * FROM cursos WHERE visible = 1 ORDER BY orden, id").all() as CourseRow[];
  return rows.map(toCourse);
}

/** Todos, incluidos los ocultos: solo para el admin. */
export function findAll(): Course[] {
  const rows = db.prepare("SELECT * FROM cursos ORDER BY orden, id").all() as CourseRow[];
  return rows.map(toCourse);
}

export function findById(id: number): Course | null {
  const row = db.prepare("SELECT * FROM cursos WHERE id = ?").get(id) as CourseRow | undefined;
  return row ? toCourse(row) : null;
}

/** El curso que se muestra en la portada: el marcado como destacado, o el primero. */
export function findFeatured(): Course | null {
  const row = (db.prepare("SELECT * FROM cursos WHERE visible = 1 AND destacado = 1 ORDER BY orden, id LIMIT 1").get() ??
    db.prepare("SELECT * FROM cursos WHERE visible = 1 ORDER BY orden, id LIMIT 1").get()) as CourseRow | undefined;
  return row ? toCourse(row) : null;
}

/** ¿El slug ya lo usa otro curso? (el slug forma parte de la URL, debe ser único) */
export function slugTaken(slug: string, exceptId?: number): boolean {
  const row = db.prepare("SELECT id FROM cursos WHERE slug = ? AND id != ?").get(slug, exceptId ?? -1);
  return row !== undefined;
}

/** Solo un curso puede estar destacado a la vez. */
function clearOtherFeatured(exceptId: number) {
  db.prepare("UPDATE cursos SET destacado = 0 WHERE id != ?").run(exceptId);
}

export function create(input: CourseInput): number {
  const siguienteOrden = input.order || ((db.prepare("SELECT COALESCE(MAX(orden), 0) + 1 AS n FROM cursos").get() as { n: number }).n);

  const result = db
    .prepare(
      `INSERT INTO cursos (slug, titulo, categoria, descripcion, estudiantes, nivel, duracion_horas,
                           modalidad, imagen, imagen_alt, estado, destacado, visible, orden)
       VALUES (@slug, @titulo, @categoria, @descripcion, @estudiantes, @nivel, @duracion_horas,
               @modalidad, @imagen, @imagen_alt, @estado, @destacado, @visible, @orden)`,
    )
    .run({ ...toRow(input), orden: siguienteOrden });

  const id = Number(result.lastInsertRowid);
  if (input.featured) clearOtherFeatured(id);
  return id;
}

export function update(id: number, input: CourseInput): void {
  db.prepare(
    `UPDATE cursos SET
       slug = @slug, titulo = @titulo, categoria = @categoria, descripcion = @descripcion,
       estudiantes = @estudiantes, nivel = @nivel, duracion_horas = @duracion_horas,
       modalidad = @modalidad, imagen = @imagen, imagen_alt = @imagen_alt, estado = @estado,
       destacado = @destacado, visible = @visible, orden = @orden,
       actualizado_en = datetime('now','localtime')
     WHERE id = @id`,
  ).run({ ...toRow(input), id });

  if (input.featured) clearOtherFeatured(id);
}

export function toggleVisible(id: number): void {
  db.prepare("UPDATE cursos SET visible = 1 - visible, actualizado_en = datetime('now','localtime') WHERE id = ?").run(id);
}

export function remove(id: number): void {
  db.prepare("DELETE FROM cursos WHERE id = ?").run(id);
}

export function countAll(): { total: number; visibles: number; proximamente: number } {
  return db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN visible = 1 THEN 1 ELSE 0 END) AS visibles,
              SUM(CASE WHEN estado = 'proximamente' THEN 1 ELSE 0 END) AS proximamente
       FROM cursos`,
    )
    .get() as { total: number; visibles: number; proximamente: number };
}
