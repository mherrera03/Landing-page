import { NextResponse, type NextRequest } from "next/server";
// Se importa session-token y no session: aquí la cookie se lee de la petición,
// sin pasar por next/headers.
import { decryptSession, SESSION_COOKIE } from "@/server/auth/session-token";
import { ADMIN_HOST, PUBLIC_HOST, isAdminHost, publicSiteUrl } from "@/lib/hosts";

/** Responde con la página 404 del sitio sin cambiar la URL del navegador. */
function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL("/_no-encontrado", request.url), { status: 404 });
}

/**
 * Hace dos cosas, en este orden:
 *
 * 1. Separa landing y panel por dominio (ver lib/hosts.ts). En el dominio
 *    público /admin no existe (404, no una redirección: así no delata que hay
 *    un panel). En el subdominio del admin solo existe /admin.
 *
 * 2. Primera barrera del admin: revisa la cookie antes de renderizar.
 *    Es una comprobación "optimista" (no toca la base de datos, porque el proxy
 *    corre en cada petición). La verificación real la hace requireSession().
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const esRutaAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (ADMIN_HOST) {
    const enHostAdmin = isAdminHost(request.headers.get("host"));

    if (!enHostAdmin && esRutaAdmin) return notFound(request);

    if (enHostAdmin && !esRutaAdmin) {
      if (pathname === "/") return NextResponse.redirect(new URL("/admin", request.url));
      // Una página pública pedida en el subdominio del admin (p. ej. "ver en
      // el sitio") se sirve desde el dominio público, nunca desde aquí.
      const destino = PUBLIC_HOST ? new URL(publicSiteUrl(pathname + search)) : null;
      // En local (`next dev` / `next start`) request.url lleva el host del
      // servidor y no el del encabezado Host, y Next vuelve relativa cualquier
      // redirección a ese mismo host: se quedaría en un bucle. En Vercel
      // request.url trae el dominio real y la redirección sale completa.
      if (!destino || destino.host === request.nextUrl.host) return notFound(request);
      return NextResponse.redirect(destino);
    }
  }

  if (!esRutaAdmin) return NextResponse.next();

  const esLogin = pathname === "/admin/login";
  const session = await decryptSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !esLogin) {
    const url = new URL("/admin/login", request.url);
    // Para volver a donde quería entrar después de iniciar sesión
    if (pathname !== "/admin") url.searchParams.set("siguiente", pathname);
    return NextResponse.redirect(url);
  }

  if (session && esLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Todo menos los archivos estáticos (los de /_next y cualquier ruta con
  // extensión, como las imágenes de /public): esos se sirven igual en ambos dominios.
  matcher: "/((?!_next/static|_next/image|.*\\..*).*)",
};
