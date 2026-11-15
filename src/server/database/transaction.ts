import "server-only";
import type { DatabaseSync } from "node:sqlite";

/**
 * Ejecuta varias operaciones como una sola: si alguna falla, se deshacen todas.
 * (node:sqlite no trae el ayudante `transaction()` de better-sqlite3.)
 *
 * BEGIN IMMEDIATE pide el turno de escritura desde el principio. Con un BEGIN
 * normal, dos procesos podrían leer a la vez y chocar al escribir, y ese choque
 * SQLite no lo reintenta: falla con "database is locked".
 *
 * Vive aparte de connection.ts porque también lo usan las migraciones, que
 * corren mientras la conexión todavía se está creando.
 */
export function transaction<T>(database: DatabaseSync, fn: () => T): T {
  database.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}
