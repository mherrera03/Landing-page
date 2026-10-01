import { AUDIENCES } from "@/constants/audiences";
import { cn } from "@/lib/utils";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function AudienceSection() {
  return (
    <section id="publico" aria-labelledby="publico-titulo" className="py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading id="publico-titulo" title="¿Quiénes se forman con nosotros?">
          Nuestra oferta está pensada para perfiles distintos, cada uno con sus propias metas.
        </SectionHeading>

        {/* 6 columnas y cada tarjeta ocupa 2: quedan 3 arriba y 2 centradas abajo */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {AUDIENCES.map(({ icon: Icon, title, description }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={0.06 * i}
              className={cn(
                "h-full lg:col-span-2",
                // La cuarta tarjeta arranca una columna más adentro para centrar la última fila
                i === 3 && "lg:col-start-2",
              )}
            >
              <article className="group h-full rounded-3xl border border-line bg-surface p-6 transition-[border-color,box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-1 hover:border-violet/40 hover:shadow-soft">
                <span className="grid size-12 place-items-center rounded-xl bg-violet-soft text-violet-deep transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg leading-snug font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
