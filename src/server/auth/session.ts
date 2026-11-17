import "server-only";
import { cookies } from "next/headers";
import { DURACION_HORAS, SESSION_COOKIE, decryptSession, encryptSession, type SessionPayload } from "./session-token";

/**
 * Sin `domain` a propósito: la cookie queda ligada al host que la creó (el
 * subdominio del admin) y el navegador nunca la envía al dominio público.
 */
const COOKIE_OPTIONS = {
  httpOnly: true, // el JavaScript de la página no puede leerla
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { ...COOKIE_OPTIONS, maxAge: DURACION_HORAS * 60 * 60 });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  // Se borra con las mismas opciones con que se creó: una cookie `__Host-`
  // sin Secure sería rechazada por el navegador y la sesión no se cerraría.
  cookieStore.set(SESSION_COOKIE, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

/** Sesión actual, o null si no hay. */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value);
}
