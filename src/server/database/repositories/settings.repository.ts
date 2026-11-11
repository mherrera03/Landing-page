import "server-only";
import { db } from "../connection";
import type { PublicSettings } from "@/schemas/settings.schema";

export function getSettings(): PublicSettings {
  const row = db.prepare("SELECT correo, whatsapp_1, whatsapp_2 FROM configuracion_publica WHERE id = 1").get() as { correo: string; whatsapp_1: string; whatsapp_2: string };
  return { email: row.correo, whatsapp1: row.whatsapp_1, whatsapp2: row.whatsapp_2 };
}

export function saveSettings(input: PublicSettings): void {
  db.prepare("UPDATE configuracion_publica SET correo = ?, whatsapp_1 = ?, whatsapp_2 = ? WHERE id = 1")
    .run(input.email, input.whatsapp1, input.whatsapp2);
}
