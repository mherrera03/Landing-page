// Base de datos SQLite (better-sqlite3)
// El archivo vive en backend/data/ugbplus.db y se crea solo la primera vez.
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'ugbplus.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ---------- Esquema ----------
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre        TEXT NOT NULL,
    correo        TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    rol           TEXT NOT NULL DEFAULT 'editor',   -- admin | editor
    activo        INTEGER NOT NULL DEFAULT 1,
    creado_en     TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS cursos (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    clave          TEXT NOT NULL UNIQUE,            -- identificador corto (ej. 'ia')
    titulo         TEXT NOT NULL,
    categoria      TEXT NOT NULL,                   -- tecnologia | negocios | habilidades
    descripcion    TEXT NOT NULL DEFAULT '',
    estudiantes    TEXT NOT NULL DEFAULT '',
    nivel          TEXT NOT NULL DEFAULT '',
    duracion_horas INTEGER,
    modalidad      TEXT NOT NULL DEFAULT '',
    imagen         TEXT NOT NULL DEFAULT '',
    estado         TEXT NOT NULL DEFAULT 'activo',  -- activo | proximamente
    orden          INTEGER NOT NULL DEFAULT 0,
    visible        INTEGER NOT NULL DEFAULT 1,
    creado_en      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    actualizado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS eventos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    etiqueta    TEXT NOT NULL DEFAULT '',           -- PRÓXIMAMENTE, NUEVA EDICIÓN...
    titulo      TEXT NOT NULL,
    descripcion TEXT NOT NULL DEFAULT '',
    fecha       TEXT,
    orden       INTEGER NOT NULL DEFAULT 0,
    visible     INTEGER NOT NULL DEFAULT 1,
    creado_en   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS solicitudes (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre    TEXT NOT NULL,
    correo    TEXT NOT NULL,
    telefono  TEXT,
    interes   TEXT,
    mensaje   TEXT,
    curso_id  INTEGER REFERENCES cursos(id),
    atendida  INTEGER NOT NULL DEFAULT 0,
    creado_en TEXT NOT NULL DEFAULT (datetime('now','localtime'))
  );

  CREATE TABLE IF NOT EXISTS configuracion (
    clave TEXT PRIMARY KEY,
    valor TEXT
  );
`);

// Migraciones no destructivas: agrega una columna solo si no existe
export function addColumnIfMissing(tabla, columna, definicion) {
  const existe = db.prepare(`PRAGMA table_info(${tabla})`).all().some(c => c.name === columna);
  if (!existe) db.exec(`ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion}`);
}

// ---------- Datos iniciales (solo si la tabla está vacía) ----------
function seed() {
  if (db.prepare('SELECT COUNT(*) AS n FROM cursos').get().n === 0) {
    const insert = db.prepare(`
      INSERT INTO cursos (clave, titulo, categoria, descripcion, estudiantes, nivel, duracion_horas, modalidad, imagen, estado, orden)
      VALUES (@clave, @titulo, @categoria, @descripcion, @estudiantes, @nivel, @duracion_horas, @modalidad, @imagen, @estado, @orden)
    `);
    [
      { clave:'ia', titulo:'Fundamentos de Inteligencia Artificial', categoria:'tecnologia', descripcion:'Introducción práctica al uso responsable de herramientas y conceptos de IA.', estudiantes:'98', nivel:'Básico', duracion_horas:30, modalidad:'Híbrida', imagen:'curso1.webp', estado:'activo', orden:1 },
      { clave:'marketing', titulo:'Marketing Digital Estratégico', categoria:'negocios', descripcion:'Diseña campañas, contenidos y métricas con enfoque en resultados.', estudiantes:'145', nivel:'Intermedio', duracion_horas:25, modalidad:'Virtual', imagen:'curso2.jpg', estado:'activo', orden:2 },
      { clave:'liderazgo', titulo:'Liderazgo y Gestión de Equipos', categoria:'habilidades', descripcion:'Fortalece comunicación, liderazgo y coordinación de equipos de trabajo.', estudiantes:'76', nivel:'Intermedio', duracion_horas:20, modalidad:'Presencial', imagen:'curso3.webp', estado:'activo', orden:3 },
      { clave:'ciber', titulo:'Ciberseguridad para Organizaciones', categoria:'tecnologia', descripcion:'Buenas prácticas para reducir riesgos y proteger información institucional.', estudiantes:'', nivel:'Avanzado', duracion_horas:35, modalidad:'', imagen:'curso4.webp', estado:'proximamente', orden:4 }
    ].forEach(c => insert.run(c));
  }

  if (db.prepare('SELECT COUNT(*) AS n FROM eventos').get().n === 0) {
    const insert = db.prepare('INSERT INTO eventos (etiqueta, titulo, descripcion, orden) VALUES (?, ?, ?, ?)');
    insert.run('PRÓXIMAMENTE', 'Masterclass abierta', 'Espacio para promocionar eventos, charlas o lanzamientos administrados desde el CMS.', 1);
    insert.run('NUEVA EDICIÓN', 'Nuevos programas 2026', 'Bloque editorial para novedades, aperturas de cohortes o noticias institucionales.', 2);
    insert.run('PARA EMPRESAS', 'Capacitación a medida', 'Promoción de programas corporativos y soluciones de formación para organizaciones.', 3);
  }

  const cfg = db.prepare('INSERT OR IGNORE INTO configuracion (clave, valor) VALUES (?, ?)');
  cfg.run('correo_contacto', 'ugbplus@ugb.edu.sv');
  cfg.run('hero_titulo', 'Actualiza tus habilidades.');
  cfg.run('hero_titulo_destacado', 'Expande tu futuro.');
}
seed();

export default db;
