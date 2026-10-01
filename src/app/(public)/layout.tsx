import type { ReactNode } from "react";
import { AnnouncementBanner } from "@/components/public/announcements/AnnouncementBanner";
import { Header } from "@/components/public/layout/Header";
import { Footer } from "@/components/public/layout/Footer";
import { SmoothScroll } from "@/components/public/motion/SmoothScroll";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-xl focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>
      <AnnouncementBanner />
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
    </SmoothScroll>
  );
}
