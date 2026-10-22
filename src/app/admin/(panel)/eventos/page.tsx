
import type { Metadata } from "next";
import { Plus } from "lucide-react";

import * as repo from "@/server/database/repositories/events.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { EventTable } from "@/components/admin/events/EventTable";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Eventos",
};

const MENSAJES: Record<string, string> = {
  creado: "Evento creado correctamente.",
  actualizado: "Evento actualizado correctamente.",
  eliminado: "Evento eliminado correctamente.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function EventosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const events = repo.listEvents();

  const mensaje = Object.keys(MENSAJES).find(
    (key) => params[key] === "1",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eventos"
        description="Administra las actividades, talleres y conferencias de UGB."
        action={
          <Button asChild>
            <a href="/admin/eventos/nuevo">
              <Plus className="mr-2 size-4" />
              Nuevo evento
            </a>
          </Button>
        }
      />

      {mensaje && <FlashMessage message={MENSAJES[mensaje]} />}

      <EventTable events={events} />
    </div>
  );
}
