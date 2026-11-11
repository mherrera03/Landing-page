import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/dal";
import { getSettings } from "@/server/database/repositories/settings.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = { title: "Configuración" };

export default async function SettingsPage() {
  await requireAdmin();
  return <><PageHeader title="Configuración" description="Actualiza los datos de contacto que aparecen en el sitio público." /><SettingsForm settings={getSettings()} /></>;
}
