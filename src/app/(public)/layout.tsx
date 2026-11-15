import type { ReactNode } from "react";
import { connection } from "next/server";
import { nowInElSalvador } from "@/lib/dates";
import { findActiveAnnouncements } from "@/server/database/repositories/publications.repository";
import * as settings from "@/server/database/repositories/settings.repository";
import { AnnouncementBar } from "@/components/public/layout/AnnouncementBar";
import { Footer } from "@/components/public/layout/Footer";
import { Header } from "@/components/public/layout/Header";
import { SmoothScroll } from "@/components/public/motion/SmoothScroll";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // Se genera en cada visita: el anuncio activo depende de la hora, y los datos
  // del encabezado y el pie se editan desde el panel.
  await connection();

  // En la franja va el anuncio elegido en Configuración; si no está activo, el más reciente que sí lo esté
  const activos = findActiveAnnouncements(nowInElSalvador());
  const destacadoId = settings.getFeaturedAnnouncementId();
  const anuncio = activos.find((item) => item.id === destacadoId) ?? activos[0];

  const brand = settings.getBrandSettings();
  const landing = settings.getLandingSettings();

  return (
    <SmoothScroll>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-xl focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      {anuncio && <AnnouncementBar announcement={anuncio} />}
      <Header
        logoImage={brand.logoImage}
        logoAlt={brand.logoAlt}
        contactButtonLabel={landing.contactButtonLabel}
        contactButtonHref={landing.contactButtonHref}
      />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer settings={settings.getSettings()} brand={brand} />
    </SmoothScroll>
  );
}
