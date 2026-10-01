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
              Desde 2016, en UGB Plus Formación Continua trabajamos en el diseño y desarrollo de oportunidades de formación que responden a las necesidades de las personas, empresas y organizaciones. A través de una propuesta educativa flexible y actual, articulamos conocimiento, tecnología y experiencia docente para facilitar el aprendizaje y fortalecer competencias que contribuyan al desarrollo profesional y personal.</p>
            <p className="mt-3 leading-relaxed text-muted">Creamos experiencias de aprendizaje apoyadas en docentes y tutores altamente calificados, plataformas digitales, recursos educativos y metodologías que se adaptan a los nuevos retos de la educación y del mundo laboral. </p>
          </Reveal>
          <Reveal delay={0.08} className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:p-8">
            <div aria-hidden="true" className="absolute -top-16 -right-16 size-48 rounded-full bg-brand opacity-40 blur-3xl" />
            <h3 className="relative text-xl font-bold">Nuestro propósito</h3>
            <p className="relative mt-3 leading-relaxed text-white/80">
              Brindar oportunidades de formación continua que permitan a las personas mantenerse actualizadas, desarrollar nuevas competencias y responder a los desafíos de un entorno profesional y social en constante transformación. A través de experiencias de aprendizaje pertinentes, flexibles y de calidad, impulsamos el crecimiento personal y profesional, conectando el conocimiento con las necesidades reales de las personas, las organizaciones y la sociedad.
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
