import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { list } from "@/server/database/repositories/publications.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationList } from "@/components/admin/publications/PublicationList";

export const metadata: Metadata = { title: "Anuncios" };

export default function AnnouncementsAdminPage() {
  return <><PageHeader title="Anuncios" description="Administra los avisos que aparecen en el sitio público." action={<Link href="/admin/anuncios/nuevo" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 font-semibold text-white"><Plus className="size-4" />Nuevo anuncio</Link>} /><PublicationList kind="anuncio" items={list("anuncio")} /></>;
}
