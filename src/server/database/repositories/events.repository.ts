
import "server-only";

import { db as conexion } from "../connection";
import type { EventInput } from "@/schemas/event.schema";
import type { UgbEvent } from "@/types/event.types";

type EventRow = {
  id: number;
  slug: string;
  title: string;
  type: UgbEvent["type"];
  modality: UgbEvent["modality"];
  event_date: string;
  event_time: string;
  location: string | null;
  price: number | null;
  capacity: number | null;
  registration_url: string | null;
  status: UgbEvent["status"];
  description: string;
  image: string;
  image_alt: string;
  visible: number;
  featured: number;
  created_at: string;
  updated_at: string;
};

let initialized = false;

function db() {
  const conn = conexion;

  if (!initialized) {
    conn.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        modality TEXT NOT NULL,
        event_date TEXT NOT NULL,
        event_time TEXT NOT NULL,
        location TEXT,
        price REAL,
        capacity INTEGER,
        registration_url TEXT,
        status TEXT NOT NULL DEFAULT 'abierto',
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        visible INTEGER NOT NULL DEFAULT 1,
        featured INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    sembrarEjemplo(conn);

    initialized = true;
  }

  return conn;
}

/**
 * Evento de ejemplo, solo si la tabla está vacía: así una copia recién clonada
 * del proyecto no muestra la sección de eventos en blanco. Nunca pisa lo que
 * el admin haya creado.
 */
function sembrarEjemplo(conn: typeof conexion) {
  const { n } = conn.prepare("SELECT COUNT(*) AS n FROM events").get() as { n: number };
  if (n > 0) return;

  const ahora = new Date().toISOString();

  conn
    .prepare(`
      INSERT INTO events (
        slug, title, type, modality, event_date, event_time,
        location, price, capacity, registration_url, status,
        description, image, image_alt, visible, featured,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      "masterclass-interiorismo-2027",
      "Adiós al minimalismo frío: así será el interiorismo en 2027",
      "Masterclass",
      "Virtual",
      "2026-10-08",
      "19:00",
      "En línea",
      0,
      null,
      "https://forms.cloud.microsoft/r/uLt18RQCVQ",
      "finalizado",
      "Una sesión gratuita para conocer hacia dónde van las tendencias de interiorismo y cómo aplicarlas en tus propios proyectos.",
      "/images/events/masterclass-interiorismo-2027.jpg",
      "Masterclass gratis «Adiós al minimalismo frío: así será el interiorismo en 2027», el jueves 8 de octubre de 2026 a las 7:00 p. m.",
      1,
      1,
      ahora,
      ahora,
    );

  console.log("[db] evento de ejemplo creado");
}

function toEvent(row: EventRow): UgbEvent {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    modality: row.modality,
    date: row.event_date,
    time: row.event_time,
    location: row.location ?? undefined,
    price: row.price ?? undefined,
    capacity: row.capacity ?? undefined,
    registrationUrl: row.registration_url ?? undefined,
    status: row.status,
    description: row.description,
    image: row.image,
    imageAlt: row.image_alt,
    visible: row.visible === 1,
    featured: row.featured === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function valores(input: EventInput) {
  return [
    input.slug,
    input.title,
    input.type,
    input.modality,
    input.date,
    input.time,
    input.location ?? null,
    input.price ?? null,
    input.capacity ?? null,
    input.registrationUrl ?? null,
    input.status,
    input.description,
    input.image,
    input.imageAlt,
    input.visible ? 1 : 0,
    input.featured ? 1 : 0,
  ];
}

function conTransaccion<T>(fn: () => T): T {
  const conn = db();
  conn.exec("BEGIN");

  try {
    const result = fn();
    conn.exec("COMMIT");
    return result;
  } catch (error) {
    conn.exec("ROLLBACK");
    throw error;
  }
}

export function listEvents(): UgbEvent[] {
  const rows = db()
    .prepare(
      "SELECT * FROM events ORDER BY event_date DESC, event_time DESC",
    )
    .all() as unknown as EventRow[];

  return rows.map(toEvent);
}

export function listVisibleEvents(): UgbEvent[] {
  const rows = db()
    .prepare(`
      SELECT * FROM events
      WHERE visible = 1
      ORDER BY featured DESC, event_date ASC, event_time ASC
    `)
    .all() as unknown as EventRow[];

  return rows.map(toEvent);
}

export function getEventById(id: number): UgbEvent | undefined {
  const row = db()
    .prepare("SELECT * FROM events WHERE id = ?")
    .get(id) as EventRow | undefined;

  return row ? toEvent(row) : undefined;
}

export function getEventBySlug(slug: string): UgbEvent | undefined {
  const row = db()
    .prepare("SELECT * FROM events WHERE slug = ?")
    .get(slug) as EventRow | undefined;

  return row ? toEvent(row) : undefined;
}

export function slugTaken(slug: string, excludeId?: number): boolean {
  const row = db()
    .prepare("SELECT id FROM events WHERE slug = ? AND id != ?")
    .get(slug, excludeId ?? -1);

  return row !== undefined;
}

function clearOtherFeatured(exceptId: number) {
  db()
    .prepare("UPDATE events SET featured = 0 WHERE id != ?")
    .run(exceptId);
}

export function insertEvent(input: EventInput): number {
  return conTransaccion(() => {
    const now = new Date().toISOString();

    const result = db()
      .prepare(`
        INSERT INTO events (
          slug, title, type, modality, event_date, event_time,
          location, price, capacity, registration_url, status,
          description, image, image_alt, visible, featured,
          created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(...valores(input), now, now);

    const id = Number(result.lastInsertRowid);

    if (input.featured) {
      clearOtherFeatured(id);
    }

    return id;
  });
}

export function saveEvent(id: number, input: EventInput): void {
  conTransaccion(() => {
    db()
      .prepare(`
        UPDATE events SET
          slug = ?, title = ?, type = ?, modality = ?,
          event_date = ?, event_time = ?, location = ?,
          price = ?, capacity = ?, registration_url = ?,
          status = ?, description = ?, image = ?, image_alt = ?,
          visible = ?, featured = ?, updated_at = ?
        WHERE id = ?
      `)
      .run(...valores(input), new Date().toISOString(), id);

    if (input.featured) {
      clearOtherFeatured(id);
    }
  });
}

export function toggleEventVisibility(id: number): void {
  db()
    .prepare(`
      UPDATE events
      SET visible = 1 - visible,
          updated_at = ?
      WHERE id = ?
    `)
    .run(new Date().toISOString(), id);
}

export function removeEvent(id: number): void {
  db()
    .prepare("DELETE FROM events WHERE id = ?")
    .run(id);
}

export function countAll(): { total: number; visibles: number } {
  const result = db()
    .prepare(`
      SELECT
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN visible = 1 THEN 1 ELSE 0 END), 0) AS visibles
      FROM events
    `)
    .get() as { total: number; visibles: number };

  return result;
}
