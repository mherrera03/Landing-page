import "server-only";
import { nowForDatabase } from "@/lib/dates";
import { execute, queryAll } from "../connection";
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
export async function findAll(): Promise<Lead[]> {
  return (await queryAll<LeadRow>("SELECT * FROM solicitudes ORDER BY creado_en DESC, id DESC")).map(toLead);
}

export function create(input: LeadInput): Promise<number> {
  return execute(
    "INSERT INTO solicitudes (nombre, correo, pais, telefono, interes, mensaje, creado_en) VALUES (?, ?, ?, ?, ?, ?, ?)",
    input.name,
    input.email,
    input.country,
    input.phone,
    input.interest,
    input.message,
    nowForDatabase(),
  );
}

export async function toggleAttended(id: number): Promise<void> {
  await execute("UPDATE solicitudes SET atendida = 1 - atendida WHERE id = ?", id);
}

export async function remove(id: number): Promise<void> {
  await execute("DELETE FROM solicitudes WHERE id = ?", id);
}
