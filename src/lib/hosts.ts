/**
 * Separación por dominio: la landing vive en el dominio principal y el panel
 * en un subdominio propio (admin.dominio.com). Es UN solo proyecto de Vercel
 * con los dos dominios apuntando a él; quién ve qué lo decide `proxy.ts`
 * según el encabezado Host.
 *
 *   ADMIN_HOST   admin.dominio.com   único host que sirve /admin
 *   PUBLIC_HOST  dominio.com         a dónde se manda lo público que se pida en el host del admin
 *
 * Sin ADMIN_HOST la separación queda apagada y todo responde en el mismo host
 * (/admin incluido): es lo que se usa en desarrollo y en los Preview de Vercel,
 * cuya URL cambia en cada despliegue.
 *
 * Este archivo no importa `server-only` porque lo usa `proxy.ts`. Las variables
 * no llevan NEXT_PUBLIC_, así que en el navegador siempre valen undefined:
 * úsalo solo desde el servidor.
 */

/** Acepta "admin.dominio.com" o "https://admin.dominio.com/" y deja solo el host. */
function normalizeHost(value: string | undefined | null): string | null {
  const host = value
    ?.trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
  return host || null;
}

export const ADMIN_HOST = normalizeHost(process.env.ADMIN_HOST);
export const PUBLIC_HOST = normalizeHost(process.env.PUBLIC_HOST);

/** ¿Esta petición puede ver el panel? Con la separación apagada, siempre. */
export function isAdminHost(host: string | null | undefined): boolean {
  if (!ADMIN_HOST) return true;
  return normalizeHost(host) === ADMIN_HOST;
}

function origin(host: string): string {
  const esLocal = /^(localhost|127\.0\.0\.1|.*\.localhost)(:\d+)?$/.test(host);
  return `${esLocal ? "http" : "https"}://${host}`;
}

/**
 * Enlace hacia el sitio público. Con PUBLIC_HOST devuelve la URL completa
 * (necesaria desde el subdominio del admin); sin él, la ruta relativa.
 */
export function publicSiteUrl(path = "/"): string {
  return PUBLIC_HOST ? `${origin(PUBLIC_HOST)}${path}` : path;
}
