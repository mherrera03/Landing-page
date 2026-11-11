import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findById } from "@/server/database/repositories/publications.repository";
import { updatePublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Editar anuncio" };

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const item = findById("anuncio", Number((await params).id));
  if (!item) notFound();
  return <><PageHeader title="Editar anuncio" description={item.title} /><PublicationForm kind="anuncio" item={item} action={updatePublicationAction.bind(null, "anuncio", item.id)} /></>;
}
