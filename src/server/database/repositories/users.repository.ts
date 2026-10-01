import "server-only";
import { db } from "../connection";

export type UserRow = {
  id: number;
  nombre: string;
  correo: string;
  password_hash: string;
  rol: "admin" | "editor";
  activo: number;
};

export function findActiveByEmail(correo: string): UserRow | null {
  const row = db.prepare("SELECT * FROM usuarios WHERE correo = ? AND activo = 1").get(correo) as UserRow | undefined;
  return row ?? null;
}

export function findActiveById(id: number): UserRow | null {
  const row = db.prepare("SELECT * FROM usuarios WHERE id = ? AND activo = 1").get(id) as UserRow | undefined;
  return row ?? null;
}
