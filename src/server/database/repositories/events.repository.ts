import "server-only";
import { db } from "../connection";
import type { EventItem, EventKind } from "@/types/event.types";

/** Fila tal cual viene de SQLite. */
type EventRow = {
  id: number;
  slug: string;
  titulo: string;
  tipo: EventKind;
  etiqueta: string;
  descripcion: string;
  fecha: string | null;
  hora: string | null;
  lugar: string;
  enlace: string;
  enlace_texto: string;
  imagen: string;
  imagen_alt: string;
  destacado: number;
  visible: number;
  orden: number;
  creado_en: string;
  actualizado_en: string;
};

function toEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    slug: row.slug,
    kind: row.tipo,
    tag: row.etiqueta,
    title: row.titulo,
    description: row.descripcion,
    date: row.fecha,
    time: row.hora,
    place: row.lugar,
    link: row.enlace,
    linkText: row.enlace_texto,
    image: row.imagen,
    imageAlt: row.imagen_alt,
    featured: row.destacado === 1,
    visible: row.visible === 1,
    order: row.orden,
    updatedAt: row.actualizado_en,
  };
}

export type EventInput = {
  slug: string;
  title: string;
  kind: EventKind;
  tag: string;
  description: string;
  date: string | null;
  time: string | null;
  place: string;
  link: string;
  linkText: string;
  image: string;
  imageAlt: string;
  featured: boolean;
  visible: boolean;
  order: number;
};

function toRow(input: EventInput) {
  return {
    slug: input.slug,
    titulo: input.title,
    tipo: input.kind,
    etiqueta: input.tag,
    descripcion: input.description,
    fecha: input.date,
    hora: input.time,
    lugar: input.place,
    enlace: input.link,
    enlace_texto: input.linkText,
    imagen: input.image,
    imagen_alt: input.imageAlt,
    destacado: input.featured ? 1 : 0,
    visible: input.visible ? 1 : 0,
    orden: input.order,
  };
}

/** Solo los visibles, para la landing. */
export function findVisible(): EventItem[] {
  const rows = db.prepare("SELECT * FROM eventos WHERE visible = 1 ORDER BY orden, id").all() as EventRow[];
  return rows.map(toEvent);
}

/** Todos, incluidos los ocultos: solo para el admin. */
export function findAll(): EventItem[] {
  const rows = db.prepare("SELECT * FROM eventos ORDER BY orden, id").all() as EventRow[];
  return rows.map(toEvent);
}

export function findById(id: number): EventItem | null {
  const row = db.prepare("SELECT * FROM eventos WHERE id = ?").get(id) as EventRow | undefined;
  return row ? toEvent(row) : null;
}

/** ¿El slug ya lo usa otro evento? */
export function slugTaken(slug: string, exceptId?: number): boolean {
  return db.prepare("SELECT id FROM eventos WHERE slug = ? AND id != ?").get(slug, exceptId ?? -1) !== undefined;
}

/** El evento destacado, para mostrarlo en grande. */
export function findFeatured(): EventItem | null {
  const row = db.prepare("SELECT * FROM eventos WHERE visible = 1 AND destacado = 1 ORDER BY orden, id LIMIT 1").get() as
    | EventRow
    | undefined;
  return row ? toEvent(row) : null;
}

/** Solo un evento puede estar destacado a la vez. */
function clearOtherFeatured(exceptId: number) {
  db.prepare("UPDATE eventos SET destacado = 0 WHERE id != ?").run(exceptId);
}

export function create(input: EventInput): number {
  const siguienteOrden =
    input.order || (db.prepare("SELECT COALESCE(MAX(orden), 0) + 1 AS n FROM eventos").get() as { n: number }).n;

  const result = db
    .prepare(
      `INSERT INTO eventos (slug, titulo, tipo, etiqueta, descripcion, fecha, hora, lugar, enlace, enlace_texto,
                            imagen, imagen_alt, destacado, visible, orden)
       VALUES (@slug, @titulo, @tipo, @etiqueta, @descripcion, @fecha, @hora, @lugar, @enlace, @enlace_texto,
               @imagen, @imagen_alt, @destacado, @visible, @orden)`,
    )
    .run({ ...toRow(input), orden: siguienteOrden });

  const id = Number(result.lastInsertRowid);
  if (input.featured) clearOtherFeatured(id);
  return id;
}

export function update(id: number, input: EventInput): void {
  db.prepare(
    `UPDATE eventos SET
       slug = @slug, titulo = @titulo, tipo = @tipo, etiqueta = @etiqueta, descripcion = @descripcion,
       fecha = @fecha, hora = @hora, lugar = @lugar, enlace = @enlace, enlace_texto = @enlace_texto,
       imagen = @imagen, imagen_alt = @imagen_alt, destacado = @destacado,
       visible = @visible, orden = @orden,
       actualizado_en = datetime('now','localtime')
     WHERE id = @id`,
  ).run({ ...toRow(input), id });

  if (input.featured) clearOtherFeatured(id);
}

export function toggleVisible(id: number): void {
  db.prepare("UPDATE eventos SET visible = 1 - visible, actualizado_en = datetime('now','localtime') WHERE id = ?").run(id);
}

export function remove(id: number): void {
  db.prepare("DELETE FROM eventos WHERE id = ?").run(id);
}

export function countAll(): { total: number; visibles: number } {
  return db
    .prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN visible = 1 THEN 1 ELSE 0 END) AS visibles FROM eventos")
    .get() as { total: number; visibles: number };
}
