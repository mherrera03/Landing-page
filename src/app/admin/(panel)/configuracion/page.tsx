import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/dal";
import { getBrandSettings, getFeaturedAnnouncementId, getLandingSettings, getSettings } from "@/server/database/repositories/settings.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";
import { LandingSettingsForm } from "@/components/admin/settings/LandingSettingsForm";
import { BrandSettingsForm } from "@/components/admin/settings/BrandSettingsForm";
import { AnnouncementSettingsForm } from "@/components/admin/settings/AnnouncementSettingsForm";
import { list } from "@/server/database/repositories/publications.repository";

export const metadata: Metadata = { title: "Configuración" };

export default async function SettingsPage() {
  await requireAdmin();
  return <><PageHeader title="Configuración" description="Administra los datos de contacto y el contenido global del sitio público." /><div className="space-y-8"><SettingsForm settings={getSettings()} /><LandingSettingsForm settings={getLandingSettings()} /><BrandSettingsForm settings={getBrandSettings()} /><AnnouncementSettingsForm announcements={list("anuncio")} featuredId={getFeaturedAnnouncementId()} /></div></>;
}
