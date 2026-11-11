import type { ReactNode } from "react";
import { Header } from "@/components/public/layout/Header";
import { Footer } from "@/components/public/layout/Footer";
import { SmoothScroll } from "@/components/public/motion/SmoothScroll";
import { listActiveAnnouncements } from "@/server/database/repositories/publications.repository";
import { getBrandSettings, getFeaturedAnnouncementId, getLandingSettings, getSettings } from "@/server/database/repositories/settings.repository";
import { nowInElSalvador } from "@/lib/dates";
import Link from "next/link";
import { connection } from "next/server";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  await connection();
  const activeAnnouncements = listActiveAnnouncements(nowInElSalvador());
  const featuredId = getFeaturedAnnouncementId();
  const announcement = activeAnnouncements.find((item) => item.id === featuredId) ?? activeAnnouncements[0];
  const settings = getSettings();
  const brand = getBrandSettings();
  const landing = getLandingSettings();
  return (
    <SmoothScroll>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-xl focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      {announcement && <div role="status" className="bg-ink px-5 py-2 text-center text-sm text-white">
        <span className="font-bold">{announcement.title}</span>{" · "}{announcement.summary}{" "}
        <Link href={announcement.link || "/anuncios"} {...(announcement.link ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-semibold underline underline-offset-4">Ver más</Link>
      </div>}
      <Header logoImage={brand.logoImage} logoAlt={brand.logoAlt} contactButtonLabel={landing.contactButtonLabel} contactButtonHref={landing.contactButtonHref} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} brand={brand} />
    </SmoothScroll>
  );
}
