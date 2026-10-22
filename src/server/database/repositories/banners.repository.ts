import "server-only";

import { db as conexion } from "../connection";
import type { BannerInput } from "@/schemas/banner.schema";
import type { Banner } from "@/types/banner.types";

type BannerRow = {
  id: number;
  image: string;
  image_alt: string;
  visible: number;
  created_at: string;
  updated_at: string;
};

let initialized = false;

function db() {
  const conn = conexion;

  if (!initialized) {
    conn.exec(`
      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT NOT NULL,
        image_alt TEXT NOT NULL,
        visible INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    initialized = true;
  }

  return conn;
}

function toBanner(row: BannerRow): Banner {
  return {
    id: row.id,
    image: row.image,
    imageAlt: row.image_alt,
    visible: row.visible === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listBanners(): Banner[] {
  const rows = db()
    .prepare("SELECT * FROM banners ORDER BY created_at DESC, id DESC")
    .all() as unknown as BannerRow[];

  return rows.map(toBanner);
}

export function listVisibleBanners(): Banner[] {
  const rows = db()
    .prepare("SELECT * FROM banners WHERE visible = 1 ORDER BY created_at DESC, id DESC")
    .all() as unknown as BannerRow[];

  return rows.map(toBanner);
}

export function getBannerById(id: number): Banner | undefined {
  const row = db()
    .prepare("SELECT * FROM banners WHERE id = ?")
    .get(id) as BannerRow | undefined;

  return row ? toBanner(row) : undefined;
}

export function insertBanner(input: BannerInput): number {
  const now = new Date().toISOString();

  const result = db()
    .prepare(`
      INSERT INTO banners (image, image_alt, visible, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(input.image, input.imageAlt, input.visible ? 1 : 0, now, now);

  return Number(result.lastInsertRowid);
}

export function saveBanner(id: number, input: BannerInput): void {
  db()
    .prepare(`
      UPDATE banners
      SET image = ?, image_alt = ?, visible = ?, updated_at = ?
      WHERE id = ?
    `)
    .run(input.image, input.imageAlt, input.visible ? 1 : 0, new Date().toISOString(), id);
}

export function toggleBannerVisibility(id: number): void {
  db()
    .prepare("UPDATE banners SET visible = 1 - visible, updated_at = ? WHERE id = ?")
    .run(new Date().toISOString(), id);
}

export function removeBanner(id: number): void {
  db().prepare("DELETE FROM banners WHERE id = ?").run(id);
}

export function countAll(): { total: number; visibles: number } {
  return db()
    .prepare(`
      SELECT
        COUNT(*) AS total,
        COALESCE(SUM(CASE WHEN visible = 1 THEN 1 ELSE 0 END), 0) AS visibles
      FROM banners
    `)
    .get() as { total: number; visibles: number };
}
