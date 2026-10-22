import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession, type SessionPayload } from "./session";
import { findActiveById } from "../database/repositories/users.repository";

/**
 * Capa de acceso a datos: la ÚNICA puerta de entrada al admin.
 * Toda página o acción del admin debe empezar llamando a requireSession().
 *
 * `cache` evita repetir la consulta cuando varios componentes la piden
 * dentro de la misma petición.
 */
export const requireSession = cache(async (): Promise<SessionPayload> => {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  // El proxy solo mira la cookie; aquí confirmamos contra la base de datos,
  // por si el usuario fue desactivado o eliminado después de iniciar sesión.
  const user = findActiveById(session.userId);
  if (!user) redirect("/admin/login");

  return { userId: user.id, name: user.nombre, role: user.rol };
});

/**
 * Como requireSession(), pero además exige rol de administrador.
 * La usan las páginas y acciones de /admin/usuarios.
 *
 * Se manda al resumen y no al login: la persona sí tiene sesión, lo que no
 * tiene es permiso, y devolverla al login solo la dejaría dando vueltas.
 */
export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await requireSession();
  if (session.role !== "admin") redirect("/admin");
  return session;
});
