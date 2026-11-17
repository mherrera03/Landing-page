import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatLongDate } from "@/lib/dates";
import type { Publication } from "@/types/publication.types";

type NewsCardProps = {
  noticia: Publication;
  /** Para que next/image pida el tamaño adecuado según dónde se use la tarjeta. */
  sizes?: string;
};

/** Tarjeta de noticia. La comparten la portada y el listado de /noticias. */
export function NewsCard({ noticia, sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" }: NewsCardProps) {
  const fecha = noticia.createdAt.slice(0, 10);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-[border-color,box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-1 hover:border-violet/40">
      {/* La imagen es opcional, pero el hueco no: sin él, las tarjetas de una
          misma fila empezarían a distinta altura y la rejilla se vería rota. */}
      <div className="relative aspect-video overflow-hidden bg-paper">
        {noticia.image ? (
          <Image
            src={noticia.image}
            alt={noticia.imageAlt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div aria-hidden="true" className="size-full bg-brand opacity-15" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-muted">
          <time dateTime={fecha}>{formatLongDate(fecha)}</time>
        </p>

        <h3 className="mt-2 text-xl leading-snug font-bold text-ink">{noticia.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{noticia.summary}</p>

        <Link
          href={`/noticias/${noticia.slug}`}
          className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-semibold text-violet-deep"
        >
          Leer noticia
          <span className="sr-only">: {noticia.title}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
