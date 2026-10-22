import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as repo from "@/server/database/repositories/banners.repository";
import { updateBannerAction } from "@/server/actions/banners.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { BannerForm } from "@/components/admin/banners/BannerForm";
import { DeleteBannerButton } from "@/components/admin/banners/DeleteBannerButton";

export const metadata: Metadata = { title: "Editar banner" };

export default async function EditarBannerPage({ params }: PageProps<"/admin/banners/[id]/editar">) {
  const { id } = await params;
  const banner = repo.getBannerById(Number(id));
  if (!banner) notFound();

  // El id va fijo aquí: no viaja en el formulario, así nadie puede cambiarlo
  const action = updateBannerAction.bind(null, banner.id);

  return (
    <>
      <PageHeader
        title="Editar banner"
        description={banner.imageAlt}
        action={<DeleteBannerButton id={banner.id} />}
      />
      <BannerForm action={action} banner={banner} />
    </>
  );
}
