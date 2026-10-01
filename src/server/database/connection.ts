import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { runMigrations } from "./migrations";

const DATA_DIR = path.join(process.cwd(), "database", "data");
const DB_FILE = path.join(DATA_DIR, "ugbplus.db");

/**
 * Usamos el SQLite que viene incluido en Node (node:sqlite) en lugar de una
 * librería externa: así nadie necesita compilar nada ni instalar herramientas
 * de C++ para levantar el proyecto. Requiere Node 22.5 o superior.
 *
 * En desarrollo Next recarga los módulos a cada rato; sin este caché global
 * se abriría una conexión nueva en cada recarga hasta agotar los descriptores.
 */
const globalForDb = globalThis as unknown as { ugbplusDb?: DatabaseSync };

function createConnection() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const database = new DatabaseSync(DB_FILE);
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA foreign_keys = ON");
  runMigrations(database);
  return database;
}

export const db = globalForDb.ugbplusDb ?? createConnection();

if (process.env.NODE_ENV !== "production") globalForDb.ugbplusDb = db;

/**
 * Ejecuta varias operaciones como una sola: si alguna falla, se deshacen todas.
 * (node:sqlite no trae el ayudante `transaction()` de better-sqlite3.)
 */
export function transaction<T>(database: DatabaseSync, fn: () => T): T {
  database.exec("BEGIN");
  try {
    const result = fn();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
