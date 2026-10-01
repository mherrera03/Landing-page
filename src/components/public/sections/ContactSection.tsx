import { Mail } from "lucide-react";
import { SITE } from "@/constants/site";
import { SPECIALISTS } from "@/constants/team";
import { ContactForm } from "../contact/ContactForm";
import { SpecialistCard } from "../contact/SpecialistCard";
import { Reveal } from "../motion/Reveal";

export function ContactSection() {
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="py-16 lg:py-24">
      <div className="container-page grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="relative overflow-hidden rounded-3xl bg-brand p-8 sm:p-10">
          <span aria-hidden="true" className="absolute -right-6 -bottom-28 text-[16rem] leading-none font-extrabold text-white/20">
            +
          </span>
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.18em] text-ink/70 uppercase">Conversemos</p>
            <h2 id="contacto-titulo" className="mt-3 text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.08] font-extrabold tracking-[-0.035em] text-ink">
              Tu próxima formación puede empezar aquí.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              Déjanos tus datos y el equipo de {SITE.name} te contactará para brindarte más información sobre el programa que te interesa.
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Mail className="size-4" aria-hidden="true" />
              {SITE.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>

      <div className="container-page mt-14 lg:mt-20">
        <Reveal className="mb-8 text-center">
          <h3 id="especialistas-titulo" className="text-[clamp(1.5rem,3vw,2rem)] leading-tight font-extrabold tracking-[-0.03em] text-ink">
            Habla con uno de nuestros especialistas
          </h3>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted">
            Escríbeles directamente por WhatsApp o correo y resuelve tus dudas sobre cualquier programa.
          </p>
        </Reveal>

        <ul aria-labelledby="especialistas-titulo" className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SPECIALISTS.map((specialist, i) => (
            <Reveal as="li" key={specialist.email} delay={0.07 * i} className="h-full">
              <SpecialistCard specialist={specialist} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
