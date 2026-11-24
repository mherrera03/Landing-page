import "server-only";
import * as repo from "../database/repositories/categories.repository";
import type { Category } from "@/types/category.types";

/** Por qué no se puede borrar una categoría. `null` significa que sí se puede. */
export type DeleteBlocker = { kind: "last" } | { kind: "inUse"; courses: number } | null;

/**
 * Las dos reglas de borrado, en un solo sitio.
 *
 * Van en el servidor y no en una clave foránea porque `PRAGMA foreign_keys`
 * solo se activa cuando la base es un archivo local (ver connection.ts); en
 * Turso no se aplica, y la regla se comportaría distinto en producción que en
 * el equipo de quien desarrolla.
 */
export async function deleteBlocker(category: Category): Promise<DeleteBlocker> {
  // Sin ninguna categoría no habría forma de crear un curso desde el panel.
  if ((await repo.countAll()) <= 1) return { kind: "last" };

  // Cuenta los cursos ocultos también: si no, borrar dejaría huérfano un curso
  // que nadie ve en la landing pero que sigue en el panel.
  const courses = await repo.countCourses(category.key);
  if (courses > 0) return { kind: "inUse", courses };

  return null;
}
