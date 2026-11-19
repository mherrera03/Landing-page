import "server-only";
import type { Client } from "@libsql/client";
import { seed } from "./seed";
import { nowForDatabase } from "@/lib/dates";

/**
 * Migraciones en orden. Cada una corre una sola vez y queda registrada
 * en la tabla `migraciones`, así agregar una nueva nunca rompe los datos existentes.
 * Para cambiar algo, AGREGA una migración nueva al final; no edites las anteriores.
 */
const MIGRATIONS: { name: string; sql: string }[] = [
  {
    name: "001_esquema_inicial",
    sql: `
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
    `,
  },
  {
    name: "002_eventos",
    sql: `
        CREATE TABLE eventos (
          id             INTEGER PRIMARY KEY AUTOINCREMENT,
          slug           TEXT NOT NULL UNIQUE,
          titulo         TEXT NOT NULL,
          tipo           TEXT NOT NULL CHECK (tipo IN ('masterclass','novedad','empresas')),
          etiqueta       TEXT NOT NULL DEFAULT '',
          descripcion    TEXT NOT NULL DEFAULT '',
          -- Fecha en formato AAAA-MM-DD. Vacía en las noticias, que no tienen día concreto.
          fecha          TEXT,
          lugar          TEXT NOT NULL DEFAULT '',
          enlace         TEXT NOT NULL DEFAULT '',
          enlace_texto   TEXT NOT NULL DEFAULT '',
          visible        INTEGER NOT NULL DEFAULT 1,
          orden          INTEGER NOT NULL DEFAULT 0,
          creado_en      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          actualizado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );

        CREATE INDEX idx_eventos_visible ON eventos (visible, orden);
    `,
  },
  {
    name: "003_eventos_destacados",
    sql: `
        ALTER TABLE eventos ADD COLUMN imagen     TEXT NOT NULL DEFAULT '';
        ALTER TABLE eventos ADD COLUMN imagen_alt TEXT NOT NULL DEFAULT '';
        -- Hora en formato HH:MM (24 h). Vacía si el evento no tiene hora concreta.
        ALTER TABLE eventos ADD COLUMN hora       TEXT;
        -- El evento destacado se muestra en grande, arriba del resto.
        ALTER TABLE eventos ADD COLUMN destacado  INTEGER NOT NULL DEFAULT 0;
    `,
  },
  {
    name: "004_eventos_costo",
    // Costo del evento: "Gratis", "$25"… Vacío si no aplica.
    sql: `ALTER TABLE eventos ADD COLUMN costo TEXT NOT NULL DEFAULT '';`,
  },
  {
    name: "005_contenido_y_configuracion",
    sql: `
        CREATE TABLE publicaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tipo TEXT NOT NULL CHECK (tipo IN ('noticia', 'anuncio')),
          slug TEXT NOT NULL,
          titulo TEXT NOT NULL,
          resumen TEXT NOT NULL DEFAULT '',
          contenido TEXT NOT NULL DEFAULT '',
          imagen TEXT NOT NULL DEFAULT '',
          imagen_alt TEXT NOT NULL DEFAULT '',
          enlace TEXT NOT NULL DEFAULT '',
          visible INTEGER NOT NULL DEFAULT 0,
          creado_en TEXT NOT NULL DEFAULT (datetime('now')),
          actualizado_en TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(tipo, slug)
        );
        CREATE INDEX idx_publicaciones_tipo_visible ON publicaciones (tipo, visible, creado_en DESC);

        CREATE TABLE configuracion_publica (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          correo TEXT NOT NULL,
          whatsapp_1 TEXT NOT NULL,
          whatsapp_2 TEXT NOT NULL
        );
        INSERT INTO configuracion_publica (id, correo, whatsapp_1, whatsapp_2)
        VALUES (1, 'ugbplus@ugb.edu.sv', '50326456571', '50326456572');
    `,
  },
  {
    name: "006_configuracion_ampliada",
    sql: `
        CREATE TABLE configuracion_extra (
          clave TEXT PRIMARY KEY,
          valor TEXT NOT NULL DEFAULT ''
        );
    `,
  },
  {
    name: "007_programacion_anuncios",
    sql: `
        ALTER TABLE publicaciones ADD COLUMN inicio TEXT NOT NULL DEFAULT '';
        ALTER TABLE publicaciones ADD COLUMN fin TEXT NOT NULL DEFAULT '';
    `,
  },
  {
    // El módulo de eventos se rehízo en la 0.7.0 sobre la tabla `events`, que
    // hasta ahora creaba el repositorio la primera vez que se usaba. Aquí queda
    // registrada con el resto del esquema. IF NOT EXISTS: las bases que ya la
    // tienen no cambian. La tabla antigua `eventos` (002 a 004) ya no se usa.
    name: "008_eventos_unificados",
    sql: `
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
    `,
  },
  {
    name: "009_fechas_en_hora_local",
    // Los eventos guardaban la fecha en ISO y en UTC ("2026-11-11T14:34:44.001Z"),
    // mientras el resto de tablas usa "AAAA-MM-DD HH:MM:SS" en hora de El Salvador.
    // Se pasan al mismo formato (UTC−6, sin horario de verano) para que se
    // ordenen y se muestren igual que las demás.
    sql: `
        UPDATE events
        SET created_at = datetime(created_at, '-6 hours'),
            updated_at = datetime(updated_at, '-6 hours')
        WHERE created_at LIKE '%T%';
    `,
  },
  {
    // Logos de la sección "Alianzas" de la landing. Arranca con los cinco que
    // estaban fijos en el código; desde aquí se administran en el panel.
    name: "010_aliados",
    sql: `
        CREATE TABLE aliados (
          id             INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre         TEXT NOT NULL,
          logo           TEXT NOT NULL,
          enlace         TEXT NOT NULL DEFAULT '',
          grupo          TEXT NOT NULL DEFAULT 'instituciones' CHECK (grupo IN ('instituciones','empresas')),
          orden          INTEGER NOT NULL DEFAULT 0,
          visible        INTEGER NOT NULL DEFAULT 1,
          creado_en      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
          actualizado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
        );
        CREATE INDEX idx_aliados_visible ON aliados (visible, grupo, orden);

        INSERT INTO aliados (nombre, logo, grupo, orden) VALUES
          ('Unión Europea', '/images/aliados/union-europea.webp', 'instituciones', 1),
          ('Expertise France, Groupe AFD', '/images/aliados/expertise-france.webp', 'instituciones', 2),
          ('INCAF, Instituto Nacional de Capacitación y Formación', '/images/aliados/incaf.webp', 'instituciones', 3),
          ('Fundemas', '/images/aliados/fundemas.webp', 'instituciones', 4),
          ('Xertify', '/images/aliados/xertify.webp', 'instituciones', 5);
    `,
  },
  {
    // RECLA se había agregado desde el panel en una base local, que no viaja con
    // el repositorio. Aquí queda para todos. Si ya existe (la base donde se
    // creó), solo se cambia su logo por el que sí está en el repositorio.
    name: "011_aliado_recla",
    sql: `
        UPDATE aliados SET logo = '/images/aliados/recla.webp', nombre = 'RECLA, Red de Educación Continua de Latinoamérica y Europa'
        WHERE nombre = 'RECLA' AND logo LIKE '/images/partners/%';

        INSERT INTO aliados (nombre, logo, grupo, orden)
        SELECT 'RECLA, Red de Educación Continua de Latinoamérica y Europa', '/images/aliados/recla.webp', 'instituciones',
               (SELECT COALESCE(MAX(orden), 0) + 1 FROM aliados)
        WHERE NOT EXISTS (SELECT 1 FROM aliados WHERE nombre LIKE 'RECLA%');
    `,
  },
];

export async function runMigrations(db: Client) {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS migraciones (
      name        TEXT PRIMARY KEY,
      aplicada_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );
  `);

  const aplicada = async (name: string) =>
    (await db.execute({ sql: "SELECT 1 FROM migraciones WHERE name = ?", args: [name] })).rows.length > 0;

  for (const migration of MIGRATIONS) {
    if (await aplicada(migration.name)) continue;

    // Cada migración es atómica: si falla a medias, no deja la base inconsistente
    const tx = await db.transaction("write");
    try {
      // Al compilar, varios procesos abren la base a la vez: otro pudo aplicar
      // esta migración mientras este esperaba su turno de escritura.
      if ((await tx.execute({ sql: "SELECT 1 FROM migraciones WHERE name = ?", args: [migration.name] })).rows.length) {
        await tx.rollback();
        continue;
      }

      // executeMultiple admite varias sentencias separadas por ";", que es
      // justo como están escritas las migraciones
      await tx.executeMultiple(migration.sql);
      await tx.execute({ sql: "INSERT INTO migraciones (name, aplicada_en) VALUES (?, ?)", args: [migration.name, nowForDatabase()] });
      await tx.commit();
      console.log(`[db] migración aplicada: ${migration.name}`);
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  await seed(db);
}
