import "server-only";
import { db, transaction } from "../connection";
import type { PublicSettings } from "@/schemas/settings.schema";
import { LANDING_DEFAULTS, type LandingSettings } from "@/schemas/landing.schema";
import { BRAND_DEFAULTS, type BrandSettings } from "@/schemas/brand.schema";

export function getSettings(): PublicSettings {
  const row = db.prepare("SELECT correo, whatsapp_1, whatsapp_2 FROM configuracion_publica WHERE id = 1").get() as { correo: string; whatsapp_1: string; whatsapp_2: string };
  return {
    email: row.correo,
    whatsapp1: row.whatsapp_1,
    whatsapp2: row.whatsapp_2,
    address: getExtra("address"),
    hours: getExtra("hours"),
    mapUrl: getExtra("mapUrl"),
    facebookUrl: getExtra("facebookUrl"),
    instagramUrl: getExtra("instagramUrl"),
    linkedinUrl: getExtra("linkedinUrl"),
    youtubeUrl: getExtra("youtubeUrl"),
  };
}

export function saveSettings(input: PublicSettings): void {
  transaction(db, () => {
    db.prepare("UPDATE configuracion_publica SET correo = ?, whatsapp_1 = ?, whatsapp_2 = ? WHERE id = 1")
      .run(input.email, input.whatsapp1, input.whatsapp2);
    saveExtras({ address: input.address, hours: input.hours, mapUrl: input.mapUrl,
      facebookUrl: input.facebookUrl, instagramUrl: input.instagramUrl,
      linkedinUrl: input.linkedinUrl, youtubeUrl: input.youtubeUrl });
  });
}

export function getExtra(key: string, fallback = ""): string {
  const row = db.prepare("SELECT valor FROM configuracion_extra WHERE clave = ?").get(key) as { valor: string } | undefined;
  return row?.valor ?? fallback;
}

export function saveExtras(values: Record<string, string>): void {
  const statement = db.prepare("INSERT INTO configuracion_extra (clave, valor) VALUES (?, ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor");
  for (const [key, value] of Object.entries(values)) statement.run(key, value);
}

export function getLandingSettings(): LandingSettings {
  const result = { ...LANDING_DEFAULTS };
  for (const key of Object.keys(result) as (keyof LandingSettings)[]) {
    const value = getExtra(`landing.${key}`, String(result[key]));
    if (typeof result[key] === "number") {
      (result as Record<string, string | number>)[key] = Number(value);
    } else {
      (result as Record<string, string | number>)[key] = value;
    }
  }
  return result;
}

export function saveLandingSettings(input: LandingSettings): void {
  saveExtras(Object.fromEntries(Object.entries(input).map(([key, value]) => [`landing.${key}`, String(value)])));
}

export function getBrandSettings(): BrandSettings {
  return Object.fromEntries(
    Object.entries(BRAND_DEFAULTS).map(([key, value]) => [key, getExtra(`brand.${key}`, value)]),
  ) as BrandSettings;
}

export function saveBrandSettings(input: BrandSettings): void {
  saveExtras(Object.fromEntries(Object.entries(input).map(([key, value]) => [`brand.${key}`, value])));
}

export function getFeaturedAnnouncementId(): number {
  const id = Number(getExtra("featuredAnnouncementId", "0"));
  return Number.isSafeInteger(id) && id > 0 ? id : 0;
}

export function saveFeaturedAnnouncementId(id: number): void {
  saveExtras({ featuredAnnouncementId: String(id) });
}
