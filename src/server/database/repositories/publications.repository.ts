import "server-only";
import { execute, queryAll, queryOne } from "../connection";
import type { PublicationInput } from "@/schemas/publication.schema";
import type { Publication, PublicationKind } from "@/types/publication.types";

type PublicationRow = {
  id: number;
  tipo: PublicationKind;
  slug: string;
  titulo: string;
  resumen: string;
  contenido: string;
  imagen: string;
  imagen_alt: string;
  enlace: string;
  inicio: string;
  fin: string;
  visible: number;
  creado_en: string;
  actualizado_en: string;
};

function toPublication(row: PublicationRow): Publication {
  return {
    id: row.id,
    kind: row.tipo,
    slug: row.slug,
    title: row.titulo,
    summary: row.resumen,
    content: row.contenido,
    image: row.imagen,
    imageAlt: row.imagen_alt,
    link: row.enlace,
    startsAt: row.inicio,
    endsAt: row.fin,
    visible: row.visible === 1,
    createdAt: row.creado_en,
    updatedAt: row.actualizado_en,
  };
}

function toRow(input: PublicationInput) {
  return {
    slug: input.slug,
    titulo: input.title,
    resumen: input.summary,
    contenido: input.content,
    imagen: input.image,
    imagen_alt: input.imageAlt,
    enlace: input.link,
    inicio: input.startsAt,
    fin: input.endsAt,
    visible: input.visible ? 1 : 0,
  };
}

/** Todas, incluidas las ocultas: solo para el admin. Las más recientes primero. */
export function findAll(kind: PublicationKind): Publication[] {
  return queryAll<PublicationRow>(
    "SELECT * FROM publicaciones WHERE tipo = ? ORDER BY creado_en DESC, id DESC",
    kind,
  ).map(toPublication);
}

/** Solo las publicadas, para el sitio público. */
export function findVisible(kind: PublicationKind): Publication[] {
  return queryAll<PublicationRow>(
    "SELECT * FROM publicaciones WHERE tipo = ? AND visible = 1 ORDER BY creado_en DESC, id DESC",
    kind,
  ).map(toPublication);
}

/**
 * Anuncios publicados y dentro de su horario.
 * `now` y las fechas guardadas van como hora local de El Salvador ("AAAA-MM-DDTHH:mm"),
 * un formato que se puede comparar como texto.
 */
export function findActiveAnnouncements(now: string): Publication[] {
  return queryAll<PublicationRow>(
    `SELECT * FROM publicaciones
     WHERE tipo = 'anuncio' AND visible = 1
       AND (inicio = '' OR inicio <= @now) AND (fin = '' OR fin >= @now)
     ORDER BY creado_en DESC, id DESC`,
    { now },
  ).map(toPublication);
}

export function findById(kind: PublicationKind, id: number): Publication | null {
  const row = queryOne<PublicationRow>("SELECT * FROM publicaciones WHERE tipo = ? AND id = ?", kind, id);
  return row ? toPublication(row) : null;
}

/** Una publicación oculta nunca debe poder abrirse desde una URL pública. */
export function findVisibleBySlug(kind: PublicationKind, slug: string): Publication | null {
  const row = queryOne<PublicationRow>(
    "SELECT * FROM publicaciones WHERE tipo = ? AND slug = ? AND visible = 1",
    kind,
    slug,
  );
  return row ? toPublication(row) : null;
}

/** El slug solo debe ser único dentro de su tipo: una noticia y un anuncio pueden compartirlo. */
export function slugTaken(kind: PublicationKind, slug: string, exceptId = -1): boolean {
  return queryOne("SELECT id FROM publicaciones WHERE tipo = ? AND slug = ? AND id != ?", kind, slug, exceptId) !== undefined;
}

export function create(kind: PublicationKind, input: PublicationInput): number {
  return execute(
    `INSERT INTO publicaciones (tipo, slug, titulo, resumen, contenido, imagen, imagen_alt, enlace, inicio, fin,
                                visible, creado_en, actualizado_en)
     VALUES (@tipo, @slug, @titulo, @resumen, @contenido, @imagen, @imagen_alt, @enlace, @inicio, @fin,
             @visible, datetime('now','localtime'), datetime('now','localtime'))`,
    { ...toRow(input), tipo: kind },
  );
}

export function update(kind: PublicationKind, id: number, input: PublicationInput): void {
  execute(
    `UPDATE publicaciones SET
       slug = @slug, titulo = @titulo, resumen = @resumen, contenido = @contenido, imagen = @imagen,
       imagen_alt = @imagen_alt, enlace = @enlace, inicio = @inicio, fin = @fin, visible = @visible,
       actualizado_en = datetime('now','localtime')
     WHERE tipo = @tipo AND id = @id`,
    { ...toRow(input), tipo: kind, id },
  );
}

export function toggleVisible(kind: PublicationKind, id: number): void {
  execute(
    "UPDATE publicaciones SET visible = 1 - visible, actualizado_en = datetime('now','localtime') WHERE tipo = ? AND id = ?",
    kind,
    id,
  );
}

export function remove(kind: PublicationKind, id: number): void {
  execute("DELETE FROM publicaciones WHERE tipo = ? AND id = ?", kind, id);
}
