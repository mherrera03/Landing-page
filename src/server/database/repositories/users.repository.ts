import "server-only";
import { execute, queryAll, queryOne } from "../connection";
import type { UserInput } from "@/schemas/user.schema";
import type { AdminUser, UserRole } from "@/types/user.types";

type UserRow = {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  rol: UserRole;
  activo: number;
  creado_en: string;
};

/** Lo que guarda el formulario, sin la contraseña: esa viaja aparte y ya cifrada. */
type UserData = Omit<UserInput, "password">;

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

/**
 * Para iniciar sesión: la cuenta junto con el hash de su contraseña.
 * Es la única consulta que lo devuelve; el resto del panel nunca lo ve.
 */
export function findActiveWithPasswordByEmail(email: string): (AdminUser & { passwordHash: string }) | null {
  const row = queryOne<UserRow>("SELECT * FROM usuarios WHERE correo = ? AND activo = 1", email);
  return row ? { ...toUser(row), passwordHash: row.password_hash } : null;
}

export function findActiveById(id: number): AdminUser | null {
  const row = queryOne<UserRow>("SELECT * FROM usuarios WHERE id = ? AND activo = 1", id);
  return row ? toUser(row) : null;
}

/** Todos, incluidos los desactivados: solo para el panel. */
export function findAll(): AdminUser[] {
  return queryAll<UserRow>("SELECT * FROM usuarios ORDER BY activo DESC, nombre").map(toUser);
}

export function findById(id: number): AdminUser | null {
  const row = queryOne<UserRow>("SELECT * FROM usuarios WHERE id = ?", id);
  return row ? toUser(row) : null;
}

/** ¿El correo ya lo usa otra cuenta? Da igual si está desactivada: la columna es única. */
export function emailTaken(email: string, exceptId = -1): boolean {
  return queryOne("SELECT id FROM usuarios WHERE correo = ? AND id != ?", email, exceptId) !== undefined;
}

export function create(input: UserData, passwordHash: string): number {
  return execute(
    "INSERT INTO usuarios (nombre, correo, password_hash, rol, activo) VALUES (?, ?, ?, ?, ?)",
    input.name,
    input.email,
    passwordHash,
    input.role,
    input.active ? 1 : 0,
  );
}

/** `passwordHash` solo viaja si se escribió una contraseña nueva; si no, se conserva la actual. */
export function update(id: number, input: UserData, passwordHash?: string): void {
  execute(
    `UPDATE usuarios
     SET nombre = ?, correo = ?, rol = ?, activo = ?, password_hash = COALESCE(?, password_hash)
     WHERE id = ?`,
    input.name,
    input.email,
    input.role,
    input.active ? 1 : 0,
    passwordHash ?? null,
    id,
  );
}

export function toggleActive(id: number): void {
  execute("UPDATE usuarios SET activo = 1 - activo WHERE id = ?", id);
}

export function remove(id: number): void {
  execute("DELETE FROM usuarios WHERE id = ?", id);
}

/**
 * Administradores activos que no son `exceptId`.
 *
 * Sirve para no quedarse sin ningún admin: si esto da 0, la cuenta que se está
 * tocando es la última con acceso a esta sección.
 */
export function countOtherActiveAdmins(exceptId: number): number {
  return queryOne<{ n: number }>(
    "SELECT COUNT(*) AS n FROM usuarios WHERE rol = 'admin' AND activo = 1 AND id != ?",
    exceptId,
  )!.n;
}
