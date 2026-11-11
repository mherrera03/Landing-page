import "server-only";
import { db } from "../connection";
import type { PublicationInput } from "@/schemas/publication.schema";
import type { Publication, PublicationKind } from "@/types/publication.types";

type Row = { id: number; tipo: PublicationKind; slug: string; titulo: string; resumen: string; contenido: string; imagen: string; imagen_alt: string; enlace: string; visible: number; creado_en: string; actualizado_en: string };

function toPublication(row: Row): Publication {
  return { id: row.id, kind: row.tipo, slug: row.slug, title: row.titulo, summary: row.resumen, content: row.contenido, image: row.imagen, imageAlt: row.imagen_alt, link: row.enlace, visible: row.visible === 1, createdAt: row.creado_en, updatedAt: row.actualizado_en };
}

export function list(kind: PublicationKind, visibleOnly = false): Publication[] {
  const rows = db.prepare(`SELECT * FROM publicaciones WHERE tipo = ? ${visibleOnly ? "AND visible = 1" : ""} ORDER BY creado_en DESC, id DESC`).all(kind) as unknown as Row[];
  return rows.map(toPublication);
}

export function findById(kind: PublicationKind, id: number): Publication | null {
  const row = db.prepare("SELECT * FROM publicaciones WHERE tipo = ? AND id = ?").get(kind, id) as Row | undefined;
  return row ? toPublication(row) : null;
}

export function findVisibleBySlug(kind: PublicationKind, slug: string): Publication | null {
  const row = db.prepare("SELECT * FROM publicaciones WHERE tipo = ? AND slug = ? AND visible = 1").get(kind, slug) as Row | undefined;
  return row ? toPublication(row) : null;
}

export function slugTaken(kind: PublicationKind, slug: string, exceptId = -1): boolean {
  return !!db.prepare("SELECT id FROM publicaciones WHERE tipo = ? AND slug = ? AND id != ?").get(kind, slug, exceptId);
}

export function create(kind: PublicationKind, input: PublicationInput): number {
  const result = db.prepare(`INSERT INTO publicaciones (tipo, slug, titulo, resumen, contenido, imagen, imagen_alt, enlace, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(kind, input.slug, input.title, input.summary, input.content, input.image, input.imageAlt, input.link, input.visible ? 1 : 0);
  return Number(result.lastInsertRowid);
}

export function update(kind: PublicationKind, id: number, input: PublicationInput): void {
  db.prepare(`UPDATE publicaciones SET slug = ?, titulo = ?, resumen = ?, contenido = ?, imagen = ?, imagen_alt = ?, enlace = ?, visible = ?, actualizado_en = datetime('now') WHERE tipo = ? AND id = ?`)
    .run(input.slug, input.title, input.summary, input.content, input.image, input.imageAlt, input.link, input.visible ? 1 : 0, kind, id);
}

export function remove(kind: PublicationKind, id: number): void {
  db.prepare("DELETE FROM publicaciones WHERE tipo = ? AND id = ?").run(kind, id);
}

export function toggle(kind: PublicationKind, id: number): void {
  db.prepare("UPDATE publicaciones SET visible = 1 - visible, actualizado_en = datetime('now') WHERE tipo = ? AND id = ?").run(kind, id);
}
