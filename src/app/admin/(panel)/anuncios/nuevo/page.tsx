import type { Metadata } from "next";
import { requireSession } from "@/server/auth/dal";
import { createPublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Nuevo anuncio" };

export default async function NuevoAnuncioPage() {
  await requireSession();

  return (
    <>
      <PageHeader title="Nuevo anuncio" description="Un aviso publicado aparecerá en la parte superior de la web." />
      <PublicationForm kind="anuncio" action={createPublicationAction.bind(null, "anuncio")} />
    </>
  );
}
