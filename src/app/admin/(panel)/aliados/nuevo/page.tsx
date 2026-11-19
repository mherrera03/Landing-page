import type { Metadata } from "next";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/partners.repository";
import { createPartnerAction } from "@/server/actions/partners.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { PartnerForm } from "@/components/admin/partners/PartnerForm";

export const metadata: Metadata = { title: "Nuevo aliado" };

export default async function NuevoAliadoPage() {
  await requireSession();

  return (
    <>
      <PageHeader title="Nuevo aliado" description="Al guardarlo, su logo aparecerá en la landing, salvo que lo dejes oculto." />
      <PartnerForm action={createPartnerAction} suggestedOrder={await repo.nextOrder()} />
    </>
  );
}
