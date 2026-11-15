import "server-only";
import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { runMigrations } from "./migrations";
import { transaction } from "./transaction";

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
  // Al compilar, Next abre la base desde varios procesos a la vez. Con esta
  // espera, el que llega segundo aguarda su turno en lugar de fallar con
  // "database is locked".
  database.exec("PRAGMA busy_timeout = 10000");
  database.exec("PRAGMA journal_mode = WAL");
  database.exec("PRAGMA foreign_keys = ON");
  runMigrations(database);
  return database;
}

export const db = globalForDb.ugbplusDb ?? createConnection();

if (process.env.NODE_ENV !== "production") globalForDb.ugbplusDb = db;

type Params = SQLInputValue[] | [Record<string, SQLInputValue>];

/**
 * Atajos tipados para los repositorios: evitan repetir en cada consulta
 * `db.prepare(...).all() as unknown as Fila[]`.
 *
 * Los parámetros van sueltos (`?`) o en un objeto (`@nombre`).
 */
export function queryAll<Row>(sql: string, ...params: Params): Row[] {
  return db.prepare(sql).all(...(params as SQLInputValue[])) as unknown as Row[];
}

export function queryOne<Row>(sql: string, ...params: Params): Row | undefined {
  return db.prepare(sql).get(...(params as SQLInputValue[])) as Row | undefined;
}

/** Para INSERT, UPDATE y DELETE. Devuelve el id de la fila insertada (si la hubo). */
export function execute(sql: string, ...params: Params): number {
  return Number(db.prepare(sql).run(...(params as SQLInputValue[])).lastInsertRowid);
}

/** Varias escrituras como una sola: si alguna falla, se deshacen todas. */
export function inTransaction<T>(fn: () => T): T {
  return transaction(db, fn);
}
