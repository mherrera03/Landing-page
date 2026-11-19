import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/partners.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PartnerTable } from "@/components/admin/partners/PartnerTable";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Aliados" };

const MENSAJES = {
  creado: "Aliado agregado. Su logo ya aparece en la landing.",
  actualizado: "Cambios guardados.",
  eliminado: "Aliado eliminado.",
};

export default async function AliadosPage({ searchParams }: PageProps<"/admin/aliados">) {
  await requireSession();

  return (
    <>
      <PageHeader
        title="Aliados"
        description="Los logos de la sección Alianzas, al final de la landing."
        action={
          <Button href="/admin/aliados/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo aliado
          </Button>
        }
      />

      <FlashFromParams params={await searchParams} messages={MENSAJES} />

      <PartnerTable partners={await repo.findAll()} />
    </>
  );
}
