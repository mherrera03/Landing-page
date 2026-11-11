import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findById } from "@/server/database/repositories/publications.repository";
import { updatePublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Editar noticia" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const item = findById("noticia", Number((await params).id));
  if (!item) notFound();
  return <><PageHeader title="Editar noticia" description={item.title} /><PublicationForm kind="noticia" item={item} action={updatePublicationAction.bind(null, "noticia", item.id)} /></>;
}
