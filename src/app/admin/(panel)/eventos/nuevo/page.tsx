import type { Metadata } from "next";
import { createEventAction } from "@/server/actions/events.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { EventForm } from "@/components/admin/events/EventForm";

export const metadata: Metadata = { title: "Nuevo evento" };

export default function NuevoEventoPage() {
  return (
    <>
      <PageHeader title="Nuevo evento" description="Al guardarlo aparecerá en la landing, salvo que lo dejes oculto." />
      <EventForm action={createEventAction} />
    </>
  );
}
