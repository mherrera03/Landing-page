import type { Metadata } from "next";
import { Plus } from "lucide-react";
import * as repo from "@/server/database/repositories/events.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { EventTable } from "@/components/admin/events/EventTable";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Eventos" };

const MENSAJES: Record<string, string> = {
  creado: "Evento creado. Ya aparece en la landing.",
  actualizado: "Cambios guardados.",
  eliminado: "Evento eliminado.",
};

export default async function EventosPage({ searchParams }: PageProps<"/admin/eventos">) {
  const params = await searchParams;
  const eventos = repo.findAll();
  const aviso = Object.keys(MENSAJES).find((k) => params[k] === "1");

  return (
    <>
      <PageHeader
        title="Eventos"
        description="Lo que publiques aquí se ve en la sección Noticias y próximos eventos de la landing."
        action={
          <Button href="/admin/eventos/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo evento
          </Button>
        }
      />

      {aviso && <FlashMessage>{MENSAJES[aviso]}</FlashMessage>}

      <EventTable events={eventos} />
    </>
  );
}
