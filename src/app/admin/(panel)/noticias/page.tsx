import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import { findAll } from "@/server/database/repositories/publications.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PublicationList } from "@/components/admin/publications/PublicationList";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Noticias" };

const MENSAJES = {
  creado: "Noticia creada.",
  actualizado: "Cambios guardados.",
  eliminado: "Noticia eliminada.",
};

export default async function NoticiasAdminPage({ searchParams }: PageProps<"/admin/noticias">) {
  await requireSession();

  return (
    <>
      <PageHeader
        title="Noticias"
        description="Publica novedades para la comunidad."
        action={
          <Button href="/admin/noticias/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nueva noticia
          </Button>
        }
      />

      <FlashFromParams params={await searchParams} messages={MENSAJES} />

      <PublicationList kind="noticia" items={await findAll("noticia")} />
    </>
  );
}
