import Link from "next/link";
import { externalLinkProps } from "@/lib/utils";
import type { Publication } from "@/types/publication.types";

/** Franja superior con un anuncio. Enlaza al aviso o, si no trae enlace propio, a la lista de anuncios. */
export function AnnouncementBar({ announcement }: { announcement: Publication }) {
  const href = announcement.link || "/anuncios";

  return (
    <div role="status" className="bg-ink px-5 py-2 text-center text-sm text-white">
      <span className="font-bold">{announcement.title}</span>
      {" · "}
      {announcement.summary}{" "}
      <Link href={href} {...externalLinkProps(href)} className="font-semibold underline underline-offset-4">
        Ver más
      </Link>
    </div>
  );
}
