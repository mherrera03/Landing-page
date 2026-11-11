import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { findVisibleBySlug } from "@/server/database/repositories/publications.repository";
import { formatLongDate } from "@/lib/dates";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = findVisibleBySlug("noticia", (await params).slug);
  return { title: article?.title ?? "Noticia no encontrada", description: article?.summary };
}

export default async function NewsDetailPage({ params }: Props) {
  const article = findVisibleBySlug("noticia", (await params).slug);
  if (!article) notFound();
  return <article className="container-page max-w-4xl py-10 lg:py-16">
    <Link href="/noticias" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-deep"><ArrowLeft className="size-4" />Todas las noticias</Link>
    <p className="mt-6 text-sm font-bold tracking-widest text-violet-deep uppercase">Noticias · <time dateTime={article.createdAt.slice(0, 10)}>{formatLongDate(article.createdAt.slice(0, 10))}</time></p>
    <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">{article.title}</h1>
    <p className="mt-5 text-lg leading-relaxed text-muted">{article.summary}</p>
    {article.image && <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl bg-paper"><Image src={article.image} alt={article.imageAlt} fill sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" /></div>}
    <div className="mt-10 whitespace-pre-line leading-8 text-ink">{article.content}</div>
  </article>;
}
