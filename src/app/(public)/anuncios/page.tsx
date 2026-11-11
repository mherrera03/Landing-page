import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { list } from "@/server/database/repositories/publications.repository";

export const metadata: Metadata = { title: "Anuncios", description: "Avisos públicos de UGB Plus." };

export default function AnnouncementsPage() {
  const announcements = list("anuncio", true);
  return <section className="container-page max-w-4xl py-12 lg:py-18"><h1 className="text-3xl font-extrabold text-ink sm:text-4xl">Anuncios</h1><p className="mt-3 text-muted">Avisos importantes de UGB Plus.</p>
    {announcements.length ? <ul className="mt-8 space-y-4">{announcements.map((item) => <li key={item.id} className="overflow-hidden rounded-2xl border border-line bg-surface">{item.image && <div className="relative aspect-video max-h-80"><Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 1024px) 56rem, 100vw" className="object-cover" /></div>}<div className="p-6"><h2 className="text-xl font-bold text-ink">{item.title}</h2><p className="mt-2 text-muted">{item.summary}</p>{item.content && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{item.content}</p>}{item.link && <Link href={item.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center font-semibold text-violet-deep">Ver enlace →</Link>}</div></li>)}</ul> : <p className="mt-8 rounded-2xl bg-paper p-10 text-center text-muted">No hay anuncios en este momento.</p>}
  </section>;
}
