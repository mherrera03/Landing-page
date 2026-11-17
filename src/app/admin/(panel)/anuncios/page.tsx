import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import { findAll } from "@/server/database/repositories/publications.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationList } from "@/components/admin/publications/PublicationList";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Anuncios" };

const MENSAJES = {
  creado: "Anuncio creado.",
  actualizado: "Cambios guardados.",
  eliminado: "Anuncio eliminado.",
};

export default async function AnunciosAdminPage({ searchParams }: PageProps<"/admin/anuncios">) {
  await requireSession();

  return (
    <>
      <PageHeader
        title="Anuncios"
        description="Administra los avisos que aparecen en el sitio público."
        action={
          <Button href="/admin/anuncios/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo anuncio
          </Button>
        }
      />

      <FlashFromParams params={await searchParams} messages={MENSAJES} />

      <PublicationList kind="anuncio" items={await findAll("anuncio")} />
    </>
  );
}
