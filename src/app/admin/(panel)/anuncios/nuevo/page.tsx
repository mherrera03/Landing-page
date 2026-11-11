import type { Metadata } from "next";
import { createPublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Nuevo anuncio" };

export default function NewAnnouncementPage() {
  return <><PageHeader title="Nuevo anuncio" description="Un aviso publicado aparecerá en la parte superior de la web." /><PublicationForm kind="anuncio" action={createPublicationAction.bind(null, "anuncio")} /></>;
}
