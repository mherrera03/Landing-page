import "server-only";
import fs from "node:fs";
import path from "node:path";
import { createClient, type Client, type InValue, type Transaction } from "@libsql/client";
import { runMigrations } from "./migrations";

const DATA_DIR = path.join(process.cwd(), "database", "data");

/**
 * Una sola librería para los dos escenarios:
 *
 * - En tu equipo, sin configurar nada, escribe en `database/data/ugbplus.db`.
 *   Trae binarios ya compilados para Windows, macOS y Linux, así que basta
 *   `npm install`: nadie necesita herramientas de C++.
 * - En producción, `DATABASE_URL` apunta a Turso (`libsql://…`), que es el
 *   mismo SQLite alojado. Por eso las consultas y las migraciones son idénticas
 *   en ambos sitios.
 */
function localUrl(): string {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  // libsql espera una URL: en Windows las barras invertidas no sirven
  return `file:${path.join(DATA_DIR, "ugbplus.db").replace(/\\/g, "/")}`;
}

/**
 * En desarrollo Next recarga los módulos a cada rato; sin este caché se abriría
 * una conexión nueva (y se releerían las migraciones) en cada recarga.
 * Se guarda la promesa, no el cliente, para que dos llamadas simultáneas
 * durante el arranque esperen a la misma preparación en lugar de duplicarla.
 */
const globalForDb = globalThis as unknown as { ugbplusDb?: Promise<Client> };

async function connect(): Promise<Client> {
  const url = process.env.DATABASE_URL || localUrl();
  const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });

  // Solo tienen sentido sobre un archivo local; Turso ya gestiona lo suyo.
  if (url.startsWith("file:")) {
    await client.executeMultiple(
      "PRAGMA busy_timeout = 10000; PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;",
    );
  }

  await runMigrations(client);
  return client;
}

function getClient(): Promise<Client> {
  globalForDb.ugbplusDb ??= connect();
  return globalForDb.ugbplusDb;
}

/** Los parámetros van sueltos (`?`) o en un objeto (`@nombre`). */
export type Args = InValue[] | [Record<string, InValue>];

/** ¿Es la forma `@nombre`, es decir un único objeto con los valores? */
function toArgs(params: Args): InValue[] | Record<string, InValue> {
  const [primero] = params;
  const esObjetoDeNombres =
    params.length === 1 &&
    typeof primero === "object" &&
    primero !== null &&
    !Array.isArray(primero) &&
    !(primero instanceof Date) &&
    !ArrayBuffer.isView(primero);

  return esObjetoDeNombres ? (primero as Record<string, InValue>) : (params as InValue[]);
}

/** Lo que ejecuta las consultas: el cliente suelto o una transacción abierta. */
type Runner = Pick<Client, "execute">;

function queries(runner: Runner) {
  return {
    async queryAll<Row>(sql: string, ...params: Args): Promise<Row[]> {
      const { rows } = await runner.execute({ sql, args: toArgs(params) });
      return rows as unknown as Row[];
    },

    async queryOne<Row>(sql: string, ...params: Args): Promise<Row | undefined> {
      const { rows } = await runner.execute({ sql, args: toArgs(params) });
      return rows[0] as Row | undefined;
    },

    /** Para INSERT, UPDATE y DELETE. Devuelve el id de la fila insertada (si la hubo). */
    async execute(sql: string, ...params: Args): Promise<number> {
      const { lastInsertRowid } = await runner.execute({ sql, args: toArgs(params) });
      return Number(lastInsertRowid ?? 0);
    },
  };
}

/** Las mismas tres funciones, pero dentro de una transacción. */
export type Tx = ReturnType<typeof queries>;

export async function queryAll<Row>(sql: string, ...params: Args): Promise<Row[]> {
  return queries(await getClient()).queryAll<Row>(sql, ...params);
}

export async function queryOne<Row>(sql: string, ...params: Args): Promise<Row | undefined> {
  return queries(await getClient()).queryOne<Row>(sql, ...params);
}

export async function execute(sql: string, ...params: Args): Promise<number> {
  return queries(await getClient()).execute(sql, ...params);
}

/**
 * Varias escrituras como una sola: si alguna falla, se deshacen todas.
 *
 * Las consultas de dentro van por el `tx` que recibe la función, no por los
 * atajos sueltos de arriba: si no, quedarían fuera de la transacción.
 */
export async function inTransaction<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  const client = await getClient();
  // "write" pide el turno de escritura desde el principio: con dos procesos
  // leyendo a la vez, el choque al escribir fallaría con "database is locked".
  const tx: Transaction = await client.transaction("write");

  try {
    const result = await fn(queries(tx));
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback();
    throw error;
  }
}
