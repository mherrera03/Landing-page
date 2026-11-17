import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSession } from "@/server/auth/dal";
import { findById } from "@/server/database/repositories/publications.repository";
import { updatePublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Editar noticia" };

export default async function EditarNoticiaPage({ params }: PageProps<"/admin/noticias/[id]/editar">) {
  await requireSession();

  const { id } = await params;
  const noticia = await findById("noticia", Number(id));
  if (!noticia) notFound();

  // El tipo y el id van fijos aquí: no viajan en el formulario, así nadie puede cambiarlos
  const action = updatePublicationAction.bind(null, "noticia", noticia.id);

  return (
    <>
      <PageHeader title="Editar noticia" description={noticia.title} />
      <PublicationForm kind="noticia" action={action} item={noticia} />
    </>
  );
}
