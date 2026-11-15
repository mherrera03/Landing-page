import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/dal";
import { findVisible } from "@/server/database/repositories/publications.repository";
import * as settings from "@/server/database/repositories/settings.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { AnnouncementSettingsForm } from "@/components/admin/settings/AnnouncementSettingsForm";
import { BrandSettingsForm } from "@/components/admin/settings/BrandSettingsForm";
import { LandingSettingsForm } from "@/components/admin/settings/LandingSettingsForm";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata: Metadata = { title: "Configuración" };

export default async function ConfiguracionPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="Configuración"
        description="Administra los datos de contacto y el contenido global del sitio público."
      />

      <div className="space-y-8">
        <SettingsForm settings={settings.getSettings()} />
        <LandingSettingsForm settings={settings.getLandingSettings()} />
        <BrandSettingsForm settings={settings.getBrandSettings()} />
        <AnnouncementSettingsForm announcements={findVisible("anuncio")} featuredId={settings.getFeaturedAnnouncementId()} />
      </div>
    </>
  );
}
