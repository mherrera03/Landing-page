import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import * as repo from "@/server/database/repositories/events.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { EventTable } from "@/components/admin/events/EventTable";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";

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
          <Link
            href="/admin/eventos/nuevo"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-soft"
          >
            <Plus className="mr-2 size-4" />
            Nuevo evento
          </Link>
        }
      />

      {mensaje && (
        <FlashMessage>{MENSAJES[mensaje]}</FlashMessage>
      )}

      <EventTable events={events} />
    </div>
  );
}
