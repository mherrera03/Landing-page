import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { transaction } from "../connection";
import { seed } from "./seed";

/**
 * Migraciones en orden. Cada una corre una sola vez y queda registrada
 * en la tabla `migraciones`, así agregar una nueva nunca rompe los datos existentes.
 * Para cambiar algo, AGREGA una migración nueva al final; no edites las anteriores.
 */
const MIGRATIONS: { name: string; up: (db: DatabaseSync) => void }[] = [
  {
    name: "001_esquema_inicial",
    up: (db) => {
      db.exec(`
        CREATE TABLE usuarios (
          id             INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre         TEXT NOT NULL,
          correo         TEXT NOT NULL UNIQUE,
          password_hash  TEXT NOT NULL,
          rol            TEXT NOT NULL DEFAULT 'editor' CHECK (rol IN ('admin','editor')),
          activo         INTEGER NOT NULL DEFAULT 1,
          creado_en      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE TABLE cursos (
          id             INTEGER PRIMARY KEY AUTOINCREMENT,
          slug           TEXT NOT NULL UNIQUE,
          titulo         TEXT NOT NULL,
          categoria      TEXT NOT NULL CHECK (categoria IN ('tecnologia','negocios','habilidades')),
          descripcion    TEXT NOT NULL DEFAULT '',
          estudiantes    INTEGER,
          nivel          TEXT NOT NULL CHECK (nivel IN ('Básico','Intermedio','Avanzado')),
          duracion_horas INTEGER NOT NULL DEFAULT 0,
          modalidad      TEXT CHECK (modalidad IN ('Híbrida','Virtual','Presencial')),
          imagen         TEXT NOT NULL DEFAULT '',
          imagen_alt     TEXT NOT NULL DEFAULT '',
          estado         TEXT NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo','proximamente')),
          destacado      INTEGER NOT NULL DEFAULT 0,
          visible        INTEGER NOT NULL DEFAULT 1,
          orden          INTEGER NOT NULL DEFAULT 0,
          creado_en      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          actualizado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE INDEX idx_cursos_visible ON cursos (visible, orden);

        CREATE TABLE solicitudes (
          id        INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre    TEXT NOT NULL,
          correo    TEXT NOT NULL,
          pais      TEXT NOT NULL DEFAULT '',
          telefono  TEXT NOT NULL DEFAULT '',
          interes   TEXT NOT NULL DEFAULT '',
          mensaje   TEXT NOT NULL DEFAULT '',
          atendida  INTEGER NOT NULL DEFAULT 0,
          creado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );
      `);
    },
  },
];

export function runMigrations(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migraciones (
      name        TEXT PRIMARY KEY,
      aplicada_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `);

  const yaAplicada = db.prepare("SELECT 1 FROM migraciones WHERE name = ?");
  const registrar = db.prepare("INSERT INTO migraciones (name) VALUES (?)");

  for (const migration of MIGRATIONS) {
    if (yaAplicada.get(migration.name)) continue;
    // Cada migración es atómica: si falla a medias, no deja la base inconsistente
    transaction(db, () => {
      migration.up(db);
      registrar.run(migration.name);
    });
    console.log(`[db] migración aplicada: ${migration.name}`);
  }

  seed(db);
}
