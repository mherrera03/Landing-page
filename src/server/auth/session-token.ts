import { SignJWT, jwtVerify } from "jose";

/**
 * Firma y verificación del token de sesión.
 *
 * Este archivo NO importa `server-only` ni `next/headers` a propósito:
 * lo usa `proxy.ts`, que corre en el runtime Edge, donde esos módulos no existen.
 * El manejo de la cookie vive en session.ts (solo servidor).
 */
export const SESSION_COOKIE = "ugbplus_session";
export const DURACION_HORAS = 8;

export type SessionPayload = {
  userId: number;
  name: string;
  role: "admin" | "editor";
};

/**
 * El secreto vive en .env. Si falta, en desarrollo se usa uno fijo para no
 * bloquear el arranque; en producción se detiene, porque un secreto conocido
 * permitiría a cualquiera falsificar una sesión.
 */
function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Falta SESSION_SECRET en las variables de entorno.");
    }
    return new TextEncoder().encode("secreto-solo-para-desarrollo-no-usar-en-produccion");
  }
  return new TextEncoder().encode(secret);
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
    return { userId: payload.userId as number, name: payload.name as string, role: payload.role as SessionPayload["role"] };
  } catch {
    return null; // token inválido, manipulado o expirado
  }
}
