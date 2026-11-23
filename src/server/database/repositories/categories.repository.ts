import "server-only";
import { nowForDatabase } from "@/lib/dates";
import { slugify } from "@/lib/text";
import { execute, queryAll, queryOne } from "../connection";
import type { CategoryInput } from "@/schemas/category.schema";
import type { Category } from "@/types/category.types";

type CategoriaRow = {
  id: number;
  clave: string;
  nombre: string;
  orden: number;
  actualizado_en: string;
};

function toCategory(row: CategoriaRow): Category {
  return {
    id: row.id,
    key: row.clave,
    name: row.nombre,
    order: row.orden,
    updatedAt: row.actualizado_en,
  };
}

function toRow(input: CategoryInput) {
  return {
    nombre: input.name,
    orden: input.order,
    now: nowForDatabase(),
  };
}

/** Mismo orden en el panel que en la barra de filtros de la landing. */
const ORDER_BY = "ORDER BY orden, nombre";

export async function findAll(): Promise<Category[]> {
  return (await queryAll<CategoriaRow>(`SELECT * FROM categorias ${ORDER_BY}`)).map(toCategory);
}

export async function findById(id: number): Promise<Category | null> {
  const row = await queryOne<CategoriaRow>("SELECT * FROM categorias WHERE id = ?", id);
  return row ? toCategory(row) : null;
}

/** Siguiente número de orden libre: una categoría nueva sale al final. */
export async function nextOrder(): Promise<number> {
  const row = await queryOne<{ siguiente: number }>("SELECT COALESCE(MAX(orden), 0) + 1 AS siguiente FROM categorias");
  return row?.siguiente ?? 1;
}

export async function countAll(): Promise<number> {
  const row = await queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM categorias");
  return row?.total ?? 0;
}

export async function exists(key: string): Promise<boolean> {
  return (await queryOne("SELECT id FROM categorias WHERE clave = ?", key)) !== undefined;
}

/**
 * Una clave libre a partir de la que se generó del nombre. "Diseño" y "Diseno"
 * producen la misma base, así que la segunda se queda con `diseno-2`: sin esto
 * chocaría contra el UNIQUE y la persona vería un error de SQLite.
 *
 * Se consultan de una vez todas las claves de esa familia en lugar de
 * preguntar una por una.
 */
export async function freeKey(base: string): Promise<string> {
  const tomadas = new Set(
    (await queryAll<{ clave: string }>("SELECT clave FROM categorias WHERE clave = ? OR clave LIKE ?", base, `${base}-%`)).map(
      (row) => row.clave,
    ),
  );

  if (!tomadas.has(base)) return base;

  let n = 2;
  while (tomadas.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/**
 * Cuántos cursos usan esta categoría, **visibles y ocultos**. Contar solo los
 * visibles dejaría huérfano a un curso oculto al borrarla.
 */
export async function countCourses(key: string): Promise<number> {
  const row = await queryOne<{ total: number }>("SELECT COUNT(*) AS total FROM cursos WHERE categoria = ?", key);
  return row?.total ?? 0;
}

/**
 * ¿Ya hay otra categoría que se llame así? Se compara por el nombre
 * "aplanado" con `slugify`, no por el texto tal cual: así "Tecnología",
 * "tecnologia" y "TECNOLOGÍA" cuentan como el mismo nombre. Dos categorías
 * que se ven casi iguales en el desplegable de un curso o en los filtros de
 * la landing no le sirven a nadie, y además repartirían los cursos entre las
 * dos sin que se note.
 *
 * Se compara en JavaScript y no con LOWER() de SQLite porque LOWER() no
 * toca las vocales acentuadas: dejaría pasar "TECNOLOGÍA".
 */
export async function nameTaken(name: string, exceptId = -1): Promise<boolean> {
  const buscado = slugify(name);
  if (!buscado) return false;

  const filas = await queryAll<{ id: number; nombre: string }>("SELECT id, nombre FROM categorias");
  return filas.some((fila) => fila.id !== exceptId && slugify(fila.nombre) === buscado);
}

/**
 * Cuántos cursos tiene cada categoría, en una sola consulta. El listado del
 * panel lo necesita para todas las filas a la vez; pedirlo categoría por
 * categoría serían tantas consultas como filas.
 */
export async function courseCountsByKey(): Promise<Record<string, number>> {
  const filas = await queryAll<{ categoria: string; total: number }>(
    "SELECT categoria, COUNT(*) AS total FROM cursos GROUP BY categoria",
  );
  return Object.fromEntries(filas.map((fila) => [fila.categoria, fila.total]));
}

/** La clave llega ya resuelta con `freeKey`, no se deduce aquí. */
export function create(input: CategoryInput, key: string): Promise<number> {
  return execute(
    `INSERT INTO categorias (clave, nombre, orden, creado_en, actualizado_en)
     VALUES (@clave, @nombre, @orden, @now, @now)`,
    { ...toRow(input), clave: key },
  );
}

/** Renombra y reordena. No toca `clave`: los cursos la siguen apuntando. */
export async function update(id: number, input: CategoryInput): Promise<void> {
  await execute("UPDATE categorias SET nombre = @nombre, orden = @orden, actualizado_en = @now WHERE id = @id", {
    ...toRow(input),
    id,
  });
}

export async function remove(id: number): Promise<void> {
  await execute("DELETE FROM categorias WHERE id = ?", id);
}
