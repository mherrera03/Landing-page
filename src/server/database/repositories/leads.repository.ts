import "server-only";
import { db } from "../connection";
import type { LeadInput } from "@/schemas/lead.schema";
import type { Lead } from "@/types/lead.types";

type LeadRow = {
  id: number;
  nombre: string;
  correo: string;
  pais: string;
  telefono: string;
  interes: string;
  mensaje: string;
  atendida: number;
  creado_en: string;
};

function toLead(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.nombre,
    email: row.correo,
    country: row.pais,
    phone: row.telefono,
    interest: row.interes,
    message: row.mensaje,
    attended: row.atendida === 1,
    createdAt: row.creado_en,
  };
}

/** Las más recientes primero: es el orden en que se atienden. */
export function findAll(): Lead[] {
  const rows = db.prepare("SELECT * FROM solicitudes ORDER BY creado_en DESC, id DESC").all() as unknown as LeadRow[];
  return rows.map(toLead);
}

export function findById(id: number): Lead | null {
  const row = db.prepare("SELECT * FROM solicitudes WHERE id = ?").get(id) as LeadRow | undefined;
  return row ? toLead(row) : null;
}

export function insert(input: LeadInput): number {
  const result = db
    .prepare(
      `INSERT INTO solicitudes (nombre, correo, pais, telefono, interes, mensaje)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(input.name, input.email, input.country, input.phone, input.interest, input.message);

  return Number(result.lastInsertRowid);
}

export function toggleAttended(id: number): void {
  db.prepare("UPDATE solicitudes SET atendida = 1 - atendida WHERE id = ?").run(id);
}

export function remove(id: number): void {
  db.prepare("DELETE FROM solicitudes WHERE id = ?").run(id);
}

export function countAll(): { total: number; pendientes: number } {
  return db
    .prepare(
      `SELECT COUNT(*) AS total,
              COALESCE(SUM(CASE WHEN atendida = 0 THEN 1 ELSE 0 END), 0) AS pendientes
       FROM solicitudes`,
    )
    .get() as { total: number; pendientes: number };
}
