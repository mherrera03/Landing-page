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

let listo = false;

function db() {
     const conn = conexion;
  if (!listo) {
    conn.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        slug             TEXT NOT NULL UNIQUE,
        title            TEXT NOT NULL,
        type             TEXT NOT NULL,
        modality         TEXT NOT NULL,
        event_date       TEXT NOT NULL,
        event_time       TEXT NOT NULL,
        location         TEXT,
        price            REAL,
        capacity         INTEGER,
        registration_url TEXT,
        status           TEXT NOT NULL DEFAULT 'abierto',
        description      TEXT NOT NULL,
        image            TEXT NOT NULL,
        image_alt        TEXT NOT NULL,
        visible          INTEGER NOT NULL DEFAULT 1,
        featured         INTEGER NOT NULL DEFAULT 0,
        created_at       TEXT NOT NULL,
        updated_at       TEXT NOT NULL
      );
    `);
    listo = true;
  }
  return conn;
}

function toEvent(r: EventRow): UgbEvent {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    type: r.type,
    modality: r.modality,
    date: r.event_date,
    time: r.event_time,
    location: r.location ?? undefined,
    price: r.price ?? undefined,
    capacity: r.capacity ?? undefined,
    registrationUrl: r.registration_url ?? undefined,
    status: r.status,
    description: r.description,
    image: r.image,
    imageAlt: r.image_alt,
    visible: r.visible === 1,
    featured: r.featured === 1,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function valores(e: EventInput) {
  return [
    e.slug,
    e.title,
    e.type,
    e.modality,
    e.date,
    e.time,
    e.location ?? null,
    e.price ?? null,
    e.capacity ?? null,
    e.registrationUrl ?? null,
    e.status,
    e.description,
    e.image,
    e.imageAlt,
    e.visible ? 1 : 0,
    e.featured ? 1 : 0,
  ];
}

/** Todos los eventos, para el panel admin (más recientes primero). */
export function listEvents(): UgbEvent[] {
  const rows = db()
    .prepare("SELECT * FROM events ORDER BY event_date DESC, event_time DESC")
    .all() as unknown as EventRow[];
  return rows.map(toEvent);
}

/** Eventos visibles para la landing (el destacado primero, luego por fecha). */
export function listVisibleEvents(): UgbEvent[] {
  const rows = db()
    .prepare("SELECT * FROM events WHERE visible = 1 ORDER BY featured DESC, event_date ASC, event_time ASC")
    .all() as unknown as EventRow[];
  return rows.map(toEvent);
}

export function getEventById(id: number): UgbEvent | undefined {
  const row = db().prepare("SELECT * FROM events WHERE id = ?").get(id) as unknown as EventRow | undefined;
  return row ? toEvent(row) : undefined;
}

export function getEventBySlug(slug: string): UgbEvent | undefined {
  const row = db().prepare("SELECT * FROM events WHERE slug = ?").get(slug) as unknown as EventRow | undefined;
  return row ? toEvent(row) : undefined;
}

export function slugTaken(slug: string, excludeId?: number): boolean {
  const row = db()
    .prepare("SELECT id FROM events WHERE slug = ? AND id != ?")
    .get(slug, excludeId ?? -1);
  return Boolean(row);
}

function conTransaccion<T>(fn: () => T): T {
  const conn = db();
  conn.exec("BEGIN");
  try {
    const result = fn();
    conn.exec("COMMIT");
    return result;
  } catch (err) {
    conn.exec("ROLLBACK");
    throw err;
  }
}

export function insertEvent(input: EventInput): number {
  return conTransaccion(() => {
    const now = new Date().toISOString();
    const res = db()
      .prepare(
        `INSERT INTO events
          (slug, title, type, modality, event_date, event_time, location, price, capacity,
           registration_url, status, description, image, image_alt, visible, featured, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(...valores(input), now, now);
    const id = Number(res.lastInsertRowid);
    // Solo un evento puede estar destacado
    if (input.featured) db().prepare("UPDATE events SET featured = 0 WHERE id != ?").run(id);
    return id;
  });
}

export function saveEvent(id: number, input: EventInput): void {
  conTransaccion(() => {
    db()
      .prepare(
        `UPDATE events SET
          slug = ?, title = ?, type = ?, modality = ?, event_date = ?, event_time = ?, location = ?,
          price = ?, capacity = ?, registration_url = ?, status = ?, description = ?, image = ?,
          image_alt = ?, visible = ?, featured = ?, updated_at = ?
         WHERE id = ?`,
      )
      .run(...valores(input), new Date().toISOString(), id);
    if (input.featured) db().prepare("UPDATE events SET featured = 0 WHERE id != ?").run(id);
  });
}

export function removeEvent(id: number): void {
  db().prepare("DELETE FROM events WHERE id = ?").run(id);
}

export function toggleEventVisibility(id: number): void {
  db()
    .prepare(
      "UPDATE events SET visible = 1 - visible, updated_at = datetime('now','localtime') WHERE id = ?",
    )
    .run(id);
}