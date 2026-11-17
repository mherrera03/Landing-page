import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types/user.types";

/**
 * Firma y verificación del token de sesión.
 *
 * Este archivo NO importa `server-only` ni `next/headers` a propósito: lo usa
 * `proxy.ts`, que lee la cookie directamente de la petición. El manejo de la
 * cookie desde páginas y acciones vive en session.ts.
 */
/**
 * En producción la cookie lleva el prefijo `__Host-`: el navegador solo la
 * acepta si es Secure, con Path=/ y SIN atributo Domain. Eso la ata al host
 * exacto que la creó (admin.dominio.com): nunca viaja al dominio público ni
 * puede ser sobrescrita desde otro subdominio.
 */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-ugbplus_session" : "ugbplus_session";
export const DURACION_HORAS = 8;

export type SessionPayload = {
  userId: number;
  name: string;
  role: UserRole;
};

/**
 * El secreto vive en .env. Si falta, en desarrollo se usa uno fijo para no
 * bloquear el arranque; en producción se detiene, porque un secreto conocido
 * permitiría a cualquiera falsificar una sesión.
 */
function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (process.env.NODE_ENV === "production" && (!secret || secret.length < 32)) {
    throw new Error("Falta SESSION_SECRET en las variables de entorno (mínimo 32 caracteres).");
  }
  return new TextEncoder().encode(secret || "secreto-solo-para-desarrollo-no-usar-en-produccion");
}

export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION_HORAS}h`)
    .sign(getKey());
}

export async function decryptSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    return { userId: payload.userId as number, name: payload.name as string, role: payload.role as UserRole };
  } catch {
    return null; // token inválido, manipulado o expirado
  }
}
