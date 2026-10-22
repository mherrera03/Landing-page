import "server-only";
import { db } from "../connection";
import type { AdminUser, UserRole } from "@/types/user.types";

export type UserRow = {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  rol: UserRole;
  activo: number;
  creado_en: string;
};

function toUser(row: UserRow): AdminUser {
  return {
    id: row.id,
    name: row.nombre,
    email: row.correo,
    role: row.rol,
    active: row.activo === 1,
    createdAt: row.creado_en,
  };
}

export function findActiveByEmail(correo: string): UserRow | null {
  const row = db.prepare("SELECT * FROM usuarios WHERE correo = ? AND activo = 1").get(correo) as UserRow | undefined;
  return row ?? null;
}

export function findActiveById(id: number): UserRow | null {
  const row = db.prepare("SELECT * FROM usuarios WHERE id = ? AND activo = 1").get(id) as UserRow | undefined;
  return row ?? null;
}

/** Todos, incluidos los desactivados: solo para el panel. */
export function findAll(): AdminUser[] {
  const rows = db.prepare("SELECT * FROM usuarios ORDER BY activo DESC, nombre").all() as unknown as UserRow[];
  return rows.map(toUser);
}

export function findById(id: number): AdminUser | null {
  const row = db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id) as UserRow | undefined;
  return row ? toUser(row) : null;
}

/** ¿El correo ya lo usa otra cuenta? Da igual si está desactivada: la columna es única. */
export function emailTaken(correo: string, exceptId?: number): boolean {
  return db.prepare("SELECT id FROM usuarios WHERE correo = ? AND id != ?").get(correo, exceptId ?? -1) !== undefined;
}

export type UserInput = {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};

export function insert(input: UserInput, passwordHash: string): number {
  const result = db
    .prepare("INSERT INTO usuarios (nombre, correo, password_hash, rol, activo) VALUES (?, ?, ?, ?, ?)")
    .run(input.name, input.email, passwordHash, input.role, input.active ? 1 : 0);

  return Number(result.lastInsertRowid);
}

/** `passwordHash` solo viaja si se escribió una contraseña nueva. */
export function update(id: number, input: UserInput, passwordHash?: string): void {
  db.prepare("UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, activo = ? WHERE id = ?").run(
    input.name,
    input.email,
    input.role,
    input.active ? 1 : 0,
    id,
  );

  if (passwordHash) {
    db.prepare("UPDATE usuarios SET password_hash = ? WHERE id = ?").run(passwordHash, id);
  }
}

export function toggleActive(id: number): void {
  db.prepare("UPDATE usuarios SET activo = 1 - activo WHERE id = ?").run(id);
}

export function remove(id: number): void {
  db.prepare("DELETE FROM usuarios WHERE id = ?").run(id);
}

/**
 * Administradores activos que no son `exceptId`.
 *
 * Sirve para no quedarse sin ningún admin: si esto da 0, la cuenta que se está
 * tocando es la última con acceso a esta sección.
 */
export function countOtherActiveAdmins(exceptId: number): number {
  const { n } = db
    .prepare("SELECT COUNT(*) AS n FROM usuarios WHERE rol = 'admin' AND activo = 1 AND id != ?")
    .get(exceptId) as { n: number };

  return n;
}

export function countAll(): { total: number; activos: number } {
  return db
    .prepare("SELECT COUNT(*) AS total, COALESCE(SUM(activo), 0) AS activos FROM usuarios")
    .get() as { total: number; activos: number };
}
