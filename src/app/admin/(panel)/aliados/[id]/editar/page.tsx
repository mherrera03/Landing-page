import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/partners.repository";
import { updatePartnerAction } from "@/server/actions/partners.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PartnerForm } from "@/components/admin/partners/PartnerForm";
import { DeletePartnerButton } from "@/components/admin/partners/DeletePartnerButton";

export const metadata: Metadata = { title: "Editar aliado" };

export default async function EditarAliadoPage({ params }: PageProps<"/admin/aliados/[id]/editar">) {
  await requireSession();

  const { id } = await params;
  const aliado = await repo.findById(Number(id));
  if (!aliado) notFound();

  // El id va fijo aquí: no viaja en el formulario, así nadie puede cambiarlo
  const action = updatePartnerAction.bind(null, aliado.id);

  return (
    <>
      <PageHeader title="Editar aliado" description={aliado.name} action={<DeletePartnerButton id={aliado.id} name={aliado.name} />} />
      <PartnerForm action={action} partner={aliado} />
    </>
  );
}
