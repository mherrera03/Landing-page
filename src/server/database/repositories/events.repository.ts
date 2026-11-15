import "server-only";
import { execute, inTransaction, queryAll, queryOne } from "../connection";
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

function toRow(input: EventInput) {
  return {
    slug: input.slug,
    title: input.title,
    type: input.type,
    modality: input.modality,
    event_date: input.date,
    event_time: input.time,
    location: input.location ?? null,
    price: input.price ?? null,
    capacity: input.capacity ?? null,
    registration_url: input.registrationUrl ?? null,
    status: input.status,
    description: input.description,
    image: input.image,
    image_alt: input.imageAlt,
    visible: input.visible ? 1 : 0,
    featured: input.featured ? 1 : 0,
    now: new Date().toISOString(),
  };
}

/** Todos, incluidos los ocultos: solo para el admin. El más reciente primero. */
export function findAll(): UgbEvent[] {
  return queryAll<EventRow>("SELECT * FROM events ORDER BY event_date DESC, event_time DESC").map(toEvent);
}

/** Solo los visibles, para el sitio público. */
export function findVisible(): UgbEvent[] {
  return queryAll<EventRow>(
    "SELECT * FROM events WHERE visible = 1 ORDER BY featured DESC, event_date, event_time",
  ).map(toEvent);
}

export function findById(id: number): UgbEvent | null {
  const row = queryOne<EventRow>("SELECT * FROM events WHERE id = ?", id);
  return row ? toEvent(row) : null;
}

/** Un evento oculto nunca debe poder abrirse desde una URL pública. */
export function findVisibleBySlug(slug: string): UgbEvent | null {
  const row = queryOne<EventRow>("SELECT * FROM events WHERE slug = ? AND visible = 1", slug);
  return row ? toEvent(row) : null;
}

export function slugTaken(slug: string, exceptId = -1): boolean {
  return queryOne("SELECT id FROM events WHERE slug = ? AND id != ?", slug, exceptId) !== undefined;
}

/** Solo un evento puede estar destacado a la vez. */
function clearOtherFeatured(exceptId: number) {
  execute("UPDATE events SET featured = 0 WHERE id != ?", exceptId);
}

export function create(input: EventInput): number {
  return inTransaction(() => {
    const id = execute(
      `INSERT INTO events (slug, title, type, modality, event_date, event_time, location, price, capacity,
                           registration_url, status, description, image, image_alt, visible, featured,
                           created_at, updated_at)
       VALUES (@slug, @title, @type, @modality, @event_date, @event_time, @location, @price, @capacity,
               @registration_url, @status, @description, @image, @image_alt, @visible, @featured,
               @now, @now)`,
      toRow(input),
    );
    if (input.featured) clearOtherFeatured(id);
    return id;
  });
}

export function update(id: number, input: EventInput): void {
  inTransaction(() => {
    execute(
      `UPDATE events SET
         slug = @slug, title = @title, type = @type, modality = @modality,
         event_date = @event_date, event_time = @event_time, location = @location,
         price = @price, capacity = @capacity, registration_url = @registration_url,
         status = @status, description = @description, image = @image, image_alt = @image_alt,
         visible = @visible, featured = @featured, updated_at = @now
       WHERE id = @id`,
      { ...toRow(input), id },
    );
    if (input.featured) clearOtherFeatured(id);
  });
}

export function toggleVisible(id: number): void {
  execute("UPDATE events SET visible = 1 - visible, updated_at = ? WHERE id = ?", new Date().toISOString(), id);
}

export function remove(id: number): void {
  execute("DELETE FROM events WHERE id = ?", id);
}

export function countAll(): { total: number; visibles: number } {
  return queryOne<{ total: number; visibles: number }>(
    "SELECT COUNT(*) AS total, COALESCE(SUM(visible), 0) AS visibles FROM events",
  )!;
}
