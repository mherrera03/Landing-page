import "server-only";
import { execute, inTransaction, queryAll, queryOne } from "../connection";
import type { PublicSettings } from "@/schemas/settings.schema";
import { LANDING_DEFAULTS, type LandingSettings } from "@/schemas/landing.schema";
import { BRAND_DEFAULTS, type BrandSettings } from "@/schemas/brand.schema";

/**
 * La configuración vive en dos sitios por cómo fue creciendo:
 * - `configuracion_publica`: una sola fila con el correo y los WhatsApp.
 * - `configuracion_extra`: pares clave/valor para todo lo que se añadió después.
 *   Los ajustes de la portada y de la identidad llevan prefijo ("landing.", "brand.").
 */

/** Datos de contacto que se guardan en `configuracion_extra`, sin prefijo. */
const CONTACT_EXTRA_KEYS = [
  "address",
  "hours",
  "mapUrl",
  "facebookUrl",
  "instagramUrl",
  "linkedinUrl",
  "youtubeUrl",
] as const satisfies readonly (keyof PublicSettings)[];

const FEATURED_ANNOUNCEMENT_KEY = "featuredAnnouncementId";

/** Todos los pares de una vez: una consulta en lugar de una por clave. */
function readExtras(): Map<string, string> {
  const rows = queryAll<{ clave: string; valor: string }>("SELECT clave, valor FROM configuracion_extra");
  return new Map(rows.map((row) => [row.clave, row.valor]));
}

function writeExtras(values: Record<string, string>): void {
  for (const [key, value] of Object.entries(values)) {
    execute(
      "INSERT INTO configuracion_extra (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor",
      key,
      value,
    );
  }
}

/** Lee un grupo de ajustes con prefijo. Lo que aún no se ha guardado toma su valor por defecto. */
function readGroup<T extends Record<string, string | number>>(prefix: string, defaults: T): T {
  const extras = readExtras();
  const entries = Object.entries(defaults).map(([key, fallback]) => {
    const stored = extras.get(`${prefix}.${key}`);
    if (stored === undefined) return [key, fallback];
    return [key, typeof fallback === "number" ? Number(stored) : stored];
  });
  return Object.fromEntries(entries) as T;
}

function writeGroup(prefix: string, values: Record<string, string | number>): void {
  const entries = Object.entries(values).map(([key, value]) => [`${prefix}.${key}`, String(value)]);
  inTransaction(() => writeExtras(Object.fromEntries(entries)));
}

export function getSettings(): PublicSettings {
  const row = queryOne<{ correo: string; whatsapp_1: string; whatsapp_2: string }>(
    "SELECT correo, whatsapp_1, whatsapp_2 FROM configuracion_publica WHERE id = 1",
  )!;
  const extras = readExtras();
  const contact = Object.fromEntries(CONTACT_EXTRA_KEYS.map((key) => [key, extras.get(key) ?? ""])) as Pick<
    PublicSettings,
    (typeof CONTACT_EXTRA_KEYS)[number]
  >;

  return { email: row.correo, whatsapp1: row.whatsapp_1, whatsapp2: row.whatsapp_2, ...contact };
}

export function saveSettings(input: PublicSettings): void {
  inTransaction(() => {
    execute(
      "UPDATE configuracion_publica SET correo = ?, whatsapp_1 = ?, whatsapp_2 = ? WHERE id = 1",
      input.email,
      input.whatsapp1,
      input.whatsapp2,
    );
    writeExtras(Object.fromEntries(CONTACT_EXTRA_KEYS.map((key) => [key, input[key]])));
  });
}

export function getLandingSettings(): LandingSettings {
  return readGroup("landing", LANDING_DEFAULTS);
}

export function saveLandingSettings(input: LandingSettings): void {
  writeGroup("landing", input);
}

export function getBrandSettings(): BrandSettings {
  return readGroup("brand", BRAND_DEFAULTS);
}

export function saveBrandSettings(input: BrandSettings): void {
  writeGroup("brand", input);
}

/** Anuncio elegido para la franja superior. 0 = automático (el más reciente). */
export function getFeaturedAnnouncementId(): number {
  const id = Number(readExtras().get(FEATURED_ANNOUNCEMENT_KEY) ?? 0);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}

export function saveFeaturedAnnouncementId(id: number): void {
  writeExtras({ [FEATURED_ANNOUNCEMENT_KEY]: String(id) });
}
