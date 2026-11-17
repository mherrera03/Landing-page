import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/events.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { EventTable } from "@/components/admin/events/EventTable";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Eventos" };

const MENSAJES = {
  creado: "Evento creado correctamente.",
  actualizado: "Evento actualizado correctamente.",
  eliminado: "Evento eliminado correctamente.",
};

export default async function EventosPage({ searchParams }: PageProps<"/admin/eventos">) {
  await requireSession();

  return (
    <>
      <PageHeader
        title="Eventos"
        description="Administra las actividades, talleres y conferencias de UGB."
        action={
          <Button href="/admin/eventos/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo evento
          </Button>
        }
      />

      <FlashFromParams params={await searchParams} messages={MENSAJES} />

      <EventTable events={await repo.findAll()} />
    </>
  );
}
