import type { Metadata } from "next";
import { requireSession } from "@/server/auth/dal";
import { createPublicationAction } from "@/server/actions/publications.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationForm } from "@/components/admin/publications/PublicationForm";

export const metadata: Metadata = { title: "Nueva noticia" };

export default async function NuevaNoticiaPage() {
  await requireSession();

  return (
    <>
      <PageHeader title="Nueva noticia" description="Redacta el contenido y publícalo cuando esté listo." />
      <PublicationForm kind="noticia" action={createPublicationAction.bind(null, "noticia")} />
    </>
  );
}
