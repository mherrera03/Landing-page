import "server-only";
import { nowForDatabase } from "@/lib/dates";
import { execute, queryAll, queryOne } from "../connection";
import type { PartnerInput } from "@/schemas/partner.schema";
import type { Partner } from "@/types/partner.types";

type PartnerRow = {
  id: number;
  nombre: string;
  logo: string;
  enlace: string;
  grupo: Partner["group"];
  orden: number;
  visible: number;
  actualizado_en: string;
};

function toPartner(row: PartnerRow): Partner {
  return {
    id: row.id,
    name: row.nombre,
    logo: row.logo,
    url: row.enlace,
    group: row.grupo,
    order: row.orden,
    visible: row.visible === 1,
    updatedAt: row.actualizado_en,
  };
}

function toRow(input: PartnerInput) {
  return {
    nombre: input.name,
    logo: input.logo,
    enlace: input.url,
    grupo: input.group,
    orden: input.order,
    visible: input.visible ? 1 : 0,
    now: nowForDatabase(),
  };
}

/** Mismo orden en el panel y en la landing: por grupo y, dentro de él, por `orden`. */
const ORDER_BY = "ORDER BY grupo, orden, nombre";

/** Todos, incluidos los ocultos: solo para el admin. */
export async function findAll(): Promise<Partner[]> {
  return (await queryAll<PartnerRow>(`SELECT * FROM aliados ${ORDER_BY}`)).map(toPartner);
}

/** Solo los visibles, para la landing. */
export async function findVisible(): Promise<Partner[]> {
  return (await queryAll<PartnerRow>(`SELECT * FROM aliados WHERE visible = 1 ${ORDER_BY}`)).map(toPartner);
}

export async function findById(id: number): Promise<Partner | null> {
  const row = await queryOne<PartnerRow>("SELECT * FROM aliados WHERE id = ?", id);
  return row ? toPartner(row) : null;
}

/** Siguiente número de orden libre: así un aliado nuevo sale al final sin pensar en ello. */
export async function nextOrder(): Promise<number> {
  const row = await queryOne<{ siguiente: number }>("SELECT COALESCE(MAX(orden), 0) + 1 AS siguiente FROM aliados");
  return row?.siguiente ?? 1;
}

export function create(input: PartnerInput): Promise<number> {
  return execute(
    `INSERT INTO aliados (nombre, logo, enlace, grupo, orden, visible, creado_en, actualizado_en)
     VALUES (@nombre, @logo, @enlace, @grupo, @orden, @visible, @now, @now)`,
    toRow(input),
  );
}

export async function update(id: number, input: PartnerInput): Promise<void> {
  await execute(
    `UPDATE aliados SET
       nombre = @nombre, logo = @logo, enlace = @enlace, grupo = @grupo,
       orden = @orden, visible = @visible, actualizado_en = @now
     WHERE id = @id`,
    { ...toRow(input), id },
  );
}

export async function toggleVisible(id: number): Promise<void> {
  await execute("UPDATE aliados SET visible = 1 - visible, actualizado_en = ? WHERE id = ?", nowForDatabase(), id);
}

export async function remove(id: number): Promise<void> {
  await execute("DELETE FROM aliados WHERE id = ?", id);
}
