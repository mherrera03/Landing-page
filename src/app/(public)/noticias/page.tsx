import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { list } from "@/server/database/repositories/publications.repository";
import { formatLongDate } from "@/lib/dates";

export const metadata: Metadata = { title: "Noticias", description: "Novedades de UGB Plus y su comunidad." };

export default function NewsPage() {
  const news = list("noticia", true);
  return <section className="container-page py-12 lg:py-18">
    <p className="text-sm font-bold tracking-widest text-violet-deep uppercase">UGB Plus</p>
    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Noticias</h1>
    <p className="mt-3 max-w-2xl text-muted">Conoce las novedades y experiencias de nuestra comunidad.</p>
    {news.length ? <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{news.map((item) => <li key={item.id}>
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
        {item.image && <div className="relative aspect-video"><Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div>}
        <div className="flex flex-1 flex-col p-6"><p className="text-xs font-semibold text-muted">{formatLongDate(item.createdAt.slice(0, 10))}</p><h2 className="mt-2 text-xl font-bold text-ink">{item.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{item.summary}</p><Link href={`/noticias/${item.slug}`} className="mt-auto inline-flex min-h-11 items-center pt-4 font-semibold text-violet-deep">Leer noticia →</Link></div>
      </article>
    </li>)}</ul> : <p className="mt-10 rounded-2xl bg-paper p-10 text-center text-muted">Pronto publicaremos noticias.</p>}
  </section>;
}
