import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatLongDate } from "@/lib/dates";
import { findVisibleBySlug } from "@/server/database/repositories/publications.repository";
import { BackLink } from "@/components/public/layout/BackLink";

// Los metadatos y la página piden la misma noticia: con cache se consulta una sola vez por visita
const getArticle = cache((slug: string) => findVisibleBySlug("noticia", slug));

export async function generateMetadata({ params }: PageProps<"/noticias/[slug]">): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return { title: article?.title ?? "Noticia no encontrada", description: article?.summary };
}

export default async function NoticiaPage({ params }: PageProps<"/noticias/[slug]">) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const fecha = article.createdAt.slice(0, 10);

  return (
    <article className="container-page max-w-4xl py-10 lg:py-16">
      <BackLink href="/noticias">Todas las noticias</BackLink>

      <p className="mt-6 text-sm font-bold tracking-widest text-violet-deep uppercase">
        Noticias · <time dateTime={fecha}>{formatLongDate(fecha)}</time>
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">{article.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">{article.summary}</p>

      {article.image && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl bg-paper">
          <Image src={article.image} alt={article.imageAlt} fill sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" />
        </div>
      )}

      <div className="mt-10 leading-8 whitespace-pre-line text-ink">{article.content}</div>
    </article>
  );
}
