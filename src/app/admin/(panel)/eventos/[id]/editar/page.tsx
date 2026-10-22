import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as repo from "@/server/database/repositories/events.repository";
import { updateEventAction } from "@/server/actions/events.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { EventForm } from "@/components/admin/events/EventForm";
import { DeleteEventButton } from "@/components/admin/events/DeleteEventButton";

export const metadata: Metadata = { title: "Editar evento" };

export default async function EditarEventoPage({ params }: PageProps<"/admin/eventos/[id]/editar">) {
  const { id } = await params;
  const evento = repo.findById(Number(id));
  if (!evento) notFound();

  // El id va fijo aquí: no viaja en el formulario, así nadie puede cambiarlo
  const action = updateEventAction.bind(null, evento.id);

  return (
    <>
      <PageHeader title="Editar evento" description={evento.title} action={<DeleteEventButton id={evento.id} title={evento.title} />} />
      <EventForm action={action} event={evento} />
    </>
  );
}
