import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { nowInElSalvador } from "@/lib/dates";
import { externalLinkProps } from "@/lib/utils";
import { findActiveAnnouncements } from "@/server/database/repositories/publications.repository";

export const metadata: Metadata = { title: "Anuncios", description: "Avisos públicos de UGB Plus." };

export default async function AnunciosPage() {
  const anuncios = await findActiveAnnouncements(nowInElSalvador());

  return (
    <section className="container-page max-w-4xl py-12 lg:py-18">
      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Anuncios</h1>
      <p className="mt-3 text-muted">Avisos importantes de UGB Plus.</p>

      {anuncios.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-paper p-10 text-center text-muted">No hay anuncios en este momento.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {anuncios.map((anuncio) => (
            <li key={anuncio.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              {anuncio.image && (
                <div className="relative aspect-video max-h-80">
                  <Image
                    src={anuncio.image}
                    alt={anuncio.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 56rem, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-ink">{anuncio.title}</h2>
                <p className="mt-2 text-muted">{anuncio.summary}</p>
                {anuncio.content && (
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted">{anuncio.content}</p>
                )}
                {anuncio.link && (
                  <Link
                    href={anuncio.link}
                    {...externalLinkProps(anuncio.link)}
                    className="mt-4 inline-flex min-h-11 items-center font-semibold text-violet-deep"
                  >
                    Ver enlace →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
