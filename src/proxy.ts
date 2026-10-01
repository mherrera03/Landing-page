import { NextResponse, type NextRequest } from "next/server";
import { decryptSession, SESSION_COOKIE } from "@/server/auth/session";

/**
 * Primera barrera del admin: revisa la cookie antes de renderizar.
 * Es una comprobación "optimista" (no toca la base de datos, porque el proxy
 * corre en cada petición). La verificación real la hace requireSession().
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
  matcher: "/admin/:path*",
};
