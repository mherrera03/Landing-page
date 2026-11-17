import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { isAdminHost } from "@/lib/hosts";
import { getSession } from "./session";
import type { SessionPayload } from "./session-token";
import { findActiveById } from "../database/repositories/users.repository";

/**
 * El panel solo existe en su subdominio (ver lib/hosts.ts). El proxy ya lo
 * filtra por URL, pero las Server Actions viajan como POST a cualquier ruta:
 * por eso se vuelve a comprobar aquí, que es por donde pasan todas.
 */
export async function assertAdminHost(): Promise<void> {
  const host = (await headers()).get("host");
  if (!isAdminHost(host)) notFound();
}

/**
 * Capa de acceso a datos: la ÚNICA puerta de entrada al admin.
 * Toda página o acción del admin debe empezar llamando a requireSession().
 * No basta con que lo haga el layout: Next no lo vuelve a ejecutar al navegar
 * entre páginas del panel.
 *
 * `cache` evita repetir la consulta cuando varios componentes la piden
 * dentro de la misma petición.
 */
export const requireSession = cache(async (): Promise<SessionPayload> => {
  await assertAdminHost();

  const session = await getSession();
  if (!session) redirect("/admin/login");

  // El proxy solo mira la cookie; aquí confirmamos contra la base de datos,
  // por si el usuario fue desactivado o eliminado después de iniciar sesión.
  const user = await findActiveById(session.userId);
  if (!user) redirect("/admin/login");

  return { userId: user.id, name: user.name, role: user.role };
});

/**
 * Como requireSession(), pero además exige rol de administrador.
 * La usan las páginas y acciones de /admin/usuarios y /admin/configuracion.
 *
 * Se manda al resumen y no al login: la persona sí tiene sesión, lo que no
 * tiene es permiso, y devolverla al login solo la dejaría dando vueltas.
 */
export const requireAdmin = cache(async (): Promise<SessionPayload> => {
  const session = await requireSession();
  if (session.role !== "admin") redirect("/admin");
  return session;
});
