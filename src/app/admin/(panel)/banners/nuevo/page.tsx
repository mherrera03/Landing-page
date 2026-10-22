import type { Metadata } from "next";
import { createBannerAction } from "@/server/actions/banners.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { BannerForm } from "@/components/admin/banners/BannerForm";

export const metadata: Metadata = { title: "Nueva imagen de banner" };

export default function NuevoBannerPage() {
  return (
    <>
      <PageHeader
        title="Nueva imagen de banner"
        description="Sube la imagen y agrega su descripción."
      />
      <BannerForm action={createBannerAction} />
    </>
  );
}
