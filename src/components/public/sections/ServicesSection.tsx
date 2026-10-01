import { SERVICE_GROUPS } from "@/constants/services";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function ServicesSection() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="py-16 lg:py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-ink px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          {/* Resplandores de marca sobre el fondo oscuro */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 size-96 rounded-full bg-cyan opacity-20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -bottom-32 size-96 rounded-full bg-violet opacity-20 blur-3xl" />

          <div className="relative">
            <SectionHeading id="servicios-titulo" kicker="Qué ofrecemos" title="Nuestros servicios" onDark>
              Formatos, áreas de conocimiento y modalidades disponibles en UGB Plus.
            </SectionHeading>

            <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
              {SERVICE_GROUPS.map((group, g) => (
                <Reveal key={group.title} delay={0.08 * g}>
                  <h3 className="border-b border-white/15 pb-3 text-lg font-bold text-white">{group.title}</h3>
                  <ul className="mt-5 space-y-4">
                    {group.items.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/10 text-violet">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="text-sm leading-relaxed text-white/80">{label}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
