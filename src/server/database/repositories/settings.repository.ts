import "server-only";
import { inTransaction, queryAll, queryOne, type Tx } from "../connection";
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
async function readExtras(): Promise<Map<string, string>> {
  const rows = await queryAll<{ clave: string; valor: string }>("SELECT clave, valor FROM configuracion_extra");
  return new Map(rows.map((row) => [row.clave, row.valor]));
}

async function writeExtras(run: Pick<Tx, "execute">, values: Record<string, string>): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    await run.execute(
      "INSERT INTO configuracion_extra (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor",
      key,
      value,
    );
  }
}

/** Lee un grupo de ajustes con prefijo. Lo que aún no se ha guardado toma su valor por defecto. */
async function readGroup<T extends Record<string, string | number>>(prefix: string, defaults: T): Promise<T> {
  const extras = await readExtras();
  const entries = Object.entries(defaults).map(([key, fallback]) => {
    const stored = extras.get(`${prefix}.${key}`);
    if (stored === undefined) return [key, fallback];
    return [key, typeof fallback === "number" ? Number(stored) : stored];
  });
  return Object.fromEntries(entries) as T;
}

async function writeGroup(prefix: string, values: Record<string, string | number>): Promise<void> {
  const entries = Object.entries(values).map(([key, value]) => [`${prefix}.${key}`, String(value)]);
  await inTransaction((tx) => writeExtras(tx, Object.fromEntries(entries)));
}

export async function getSettings(): Promise<PublicSettings> {
  const row = (await queryOne<{ correo: string; whatsapp_1: string; whatsapp_2: string }>(
    "SELECT correo, whatsapp_1, whatsapp_2 FROM configuracion_publica WHERE id = 1",
  ))!;
  const extras = await readExtras();
  const contact = Object.fromEntries(CONTACT_EXTRA_KEYS.map((key) => [key, extras.get(key) ?? ""])) as Pick<
    PublicSettings,
    (typeof CONTACT_EXTRA_KEYS)[number]
  >;

  return { email: row.correo, whatsapp1: row.whatsapp_1, whatsapp2: row.whatsapp_2, ...contact };
}

export async function saveSettings(input: PublicSettings): Promise<void> {
  await inTransaction(async (tx) => {
    await tx.execute(
      "UPDATE configuracion_publica SET correo = ?, whatsapp_1 = ?, whatsapp_2 = ? WHERE id = 1",
      input.email,
      input.whatsapp1,
      input.whatsapp2,
    );
    await writeExtras(tx, Object.fromEntries(CONTACT_EXTRA_KEYS.map((key) => [key, input[key]])));
  });
}

export function getLandingSettings(): Promise<LandingSettings> {
  return readGroup("landing", LANDING_DEFAULTS);
}

export function saveLandingSettings(input: LandingSettings): Promise<void> {
  return writeGroup("landing", input);
}

export function getBrandSettings(): Promise<BrandSettings> {
  return readGroup("brand", BRAND_DEFAULTS);
}

export function saveBrandSettings(input: BrandSettings): Promise<void> {
  return writeGroup("brand", input);
}

/** Anuncio elegido para la franja superior. 0 = automático (el más reciente). */
export async function getFeaturedAnnouncementId(): Promise<number> {
  const id = Number((await readExtras()).get(FEATURED_ANNOUNCEMENT_KEY) ?? 0);
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}

export async function saveFeaturedAnnouncementId(id: number): Promise<void> {
  await inTransaction((tx) => writeExtras(tx, { [FEATURED_ANNOUNCEMENT_KEY]: String(id) }));
}
