import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { findVisible } from "@/server/database/repositories/publications.repository";
import { NewsCard } from "../news/NewsCard";
import { Reveal } from "../motion/Reveal";
import { Section } from "./Section";
import { SectionHeading } from "./SectionHeading";

/** Cuántas noticias caben en la portada; el resto quedan en /noticias. */
const MAX_EN_PORTADA = 3;

export async function NewsSection() {
  const noticias = await findVisible("noticia");

  // Sin noticias publicadas, la sección no se muestra: mejor eso que un hueco
  // con un "pronto habrá novedades" que envejece mal.
  if (noticias.length === 0) return null;

  return (
    <Section id="noticias">
      <div className="container-page">
        <SectionHeading id="noticias-titulo" kicker="UGB Plus" title="Últimas noticias">
          Novedades y experiencias de nuestra comunidad.
        </SectionHeading>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {noticias.slice(0, MAX_EN_PORTADA).map((noticia, i) => (
            <Reveal as="li" key={noticia.id} delay={0.07 * i} className="h-full">
              <NewsCard noticia={noticia} />
            </Reveal>
          ))}
        </ul>

        {/* Siempre visible, igual que en Eventos: es la entrada al archivo completo */}
        <Reveal className="mt-8 flex justify-center">
          <Link
            href="/noticias"
            className="group/all inline-flex min-h-11 items-center gap-1.5 rounded-full border border-ink/20 px-6 font-semibold text-ink transition-colors duration-200 hover:bg-ink hover:text-white"
          >
            Ver todas las noticias
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/all:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}
