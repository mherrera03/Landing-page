import type { Metadata } from "next";
import { findVisible } from "@/server/database/repositories/publications.repository";
import { NewsCard } from "@/components/public/news/NewsCard";

export const metadata: Metadata = { title: "Noticias", description: "Novedades de UGB Plus y su comunidad." };

export default async function NoticiasPage() {
  const noticias = await findVisible("noticia");

  return (
    <section className="container-page py-12 lg:py-18">
      <p className="text-sm font-bold tracking-widest text-violet-deep uppercase">UGB Plus</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Noticias</h1>
      <p className="mt-3 max-w-2xl text-muted">Conoce las novedades y experiencias de nuestra comunidad.</p>

      {noticias.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-paper p-10 text-center text-muted">Pronto publicaremos noticias.</p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <li key={noticia.id}>
              <NewsCard noticia={noticia} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
