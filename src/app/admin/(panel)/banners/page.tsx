import type { Metadata } from "next";
import { Plus } from "lucide-react";

import * as repo from "@/server/database/repositories/banners.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { BannerTable } from "@/components/admin/banners/BannerTable";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Banners",
};

const MENSAJES: Record<string, string> = {
  creado: "Imagen agregada correctamente.",
  actualizado: "Banner actualizado correctamente.",
  eliminado: "Banner eliminado correctamente.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BannersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const banners = repo.listBanners();

  const mensaje = Object.keys(MENSAJES).find((key) => params[key] === "1");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        description="Administra las imágenes del banner que se muestran en la landing."
        action={
          <Button href="/admin/banners/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nueva imagen
          </Button>
        }
      />

      {mensaje && <FlashMessage>{MENSAJES[mensaje]}</FlashMessage>}

      <BannerTable banners={banners} />
    </div>
  );
}
