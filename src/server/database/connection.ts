import "server-only";
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { runMigrations } from "./migrations";

const DATA_DIR = path.join(process.cwd(), "database", "data");
const DB_FILE = path.join(DATA_DIR, "ugbplus.db");

/**
 * En desarrollo Next recarga los módulos a cada rato; sin este caché global
 * se abriría una conexión nueva en cada recarga hasta agotar los descriptores.
 */
const globalForDb = globalThis as unknown as { ugbplusDb?: Database.Database };

function createConnection() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const db = new Database(DB_FILE);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

export const db = globalForDb.ugbplusDb ?? createConnection();

if (process.env.NODE_ENV !== "production") globalForDb.ugbplusDb = db;
