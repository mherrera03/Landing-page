import { CalendarClock, HeartHandshake, Target, type LucideIcon } from "lucide-react";
import { SITE } from "@/constants/site";
import { Reveal } from "../motion/Reveal";
import { SectionHeading } from "./SectionHeading";

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Target, title: "Enfoque práctico", text: "Aprendes haciendo, con casos y herramientas que aplicas desde el primer día." },
  { icon: CalendarClock, title: "Modalidades flexibles", text: "Opciones presenciales, virtuales e híbridas que se adaptan a tu horario." },
  { icon: HeartHandshake, title: "Acompañamiento cercano", text: "Un equipo que te orienta desde la inscripción hasta que terminas tu programa." },
];

export function AboutSection() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-titulo" className="py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading id="nosotros-titulo" kicker="UGB Plus" title="Formación continua, simple y cercana.">
          Reunimos en un solo lugar la oferta de actualización profesional de la universidad, para que encuentres rápido el
          programa que necesitas.
        </SectionHeading>

        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-line bg-surface p-7 sm:p-8">
            <h3 className="text-xl font-bold text-ink">¿Quiénes somos?</h3>
            <p className="mt-3 leading-relaxed text-muted">
              {SITE.name} es el espacio de formación continua de la {SITE.university}. Acercamos oportunidades de actualización
              profesional mediante programas, cursos, talleres y experiencias de aprendizaje pertinentes.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-8">
            <div aria-hidden="true" className="absolute -top-16 -right-16 size-48 rounded-full bg-brand opacity-40 blur-3xl" />
            <h3 className="relative text-xl font-bold">¿Para quién es?</h3>
            <p className="relative mt-3 leading-relaxed text-white/80">
              Para profesionales que quieren crecer, estudiantes que buscan complementar su carrera y organizaciones que
              necesitan capacitar a sus equipos.
            </p>
          </Reveal>
        </div>

        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} delay={0.06 * i} className="rounded-2xl border border-line bg-surface p-6">
              <span className="grid size-12 place-items-center rounded-xl bg-violet-soft text-violet-deep">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
