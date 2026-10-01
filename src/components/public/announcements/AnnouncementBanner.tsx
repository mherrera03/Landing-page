import { Mail } from "lucide-react";
import { SITE } from "@/constants/site";

/** Franja superior con el dato de contacto. Más adelante mostrará anuncios del admin. */
export function AnnouncementBanner() {
  return (
    <div className="bg-ink text-white">
      <div className="container-page flex min-h-10 items-center justify-between gap-4 text-xs sm:text-sm">
        <p className="hidden text-white/80 sm:block">
          {SITE.name} · {SITE.tagline}
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="inline-flex min-h-10 items-center gap-2 font-medium underline-offset-4 hover:underline max-sm:mx-auto"
        >
          <Mail className="size-4" aria-hidden="true" />
          {SITE.email}
        </a>
      </div>
    </div>
  );
}
