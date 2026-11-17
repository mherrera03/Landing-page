import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSession } from "@/server/auth/dal";
import { findById } from "@/server/database/repositories/publications.repository";
import { updatePublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Editar anuncio" };

export default async function EditarAnuncioPage({ params }: PageProps<"/admin/anuncios/[id]/editar">) {
  await requireSession();

  const { id } = await params;
  const anuncio = await findById("anuncio", Number(id));
  if (!anuncio) notFound();

  // El tipo y el id van fijos aquí: no viajan en el formulario, así nadie puede cambiarlos
  const action = updatePublicationAction.bind(null, "anuncio", anuncio.id);

  return (
    <>
      <PageHeader title="Editar anuncio" description={anuncio.title} />
      <PublicationForm kind="anuncio" action={action} item={anuncio} />
    </>
  );
}
