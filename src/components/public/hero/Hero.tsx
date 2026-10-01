"use client";

import { useRef } from "react";
import { motion, type Variants } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";
import type { Course } from "@/types/course.types";
import { Button } from "@/components/ui/Button";
import { HeroFeaturedCourse } from "./HeroFeaturedCourse";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const line: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.9, ease: EASE } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const STATS = [
  { prefix: "+", value: 20, suffix: "", label: "programas activos" },
  { prefix: "", value: 100, suffix: "%", label: "enfoque práctico" },
] as const;

export function Hero({ course }: { course: Course }) {
  const root = useRef<HTMLElement>(null);

  // GSAP: contadores de las cifras + parallax de la mancha de color al hacer scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-count]", {
          textContent: 0,
          duration: 1.6,
          delay: 0.7,
          ease: "power2.out",
          snap: { textContent: 1 },
        });
        gsap.to("[data-hero-blob]", {
          yPercent: 16,
          rotate: 14,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="inicio" className="relative overflow-hidden">
      {/* Fondo: resplandores suaves de marca */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 size-[30rem] rounded-full bg-cyan/15 blur-3xl" />
        <div className="absolute top-1/3 -right-40 size-[34rem] rounded-full bg-violet/15 blur-3xl" />
      </div>

      <div className="container-page grid items-center gap-10 pt-10 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pt-16 lg:pb-24">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={fade}
            className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-surface px-3.5 py-1.5 text-xs font-semibold text-violet-deep"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
            ¡Únete a quienes nunca dejan de aprender! 
          </motion.p>

          <h1 className="mt-5 text-[clamp(2.6rem,6.2vw,4.75rem)] leading-[1.02] font-extrabold tracking-[-0.045em] text-ink">
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <motion.span variants={line} className="block">
                Actualiza tus habilidades.
              </motion.span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
              <motion.span variants={line} className="block text-gradient">
                Expande tu futuro.
              </motion.span>
            </span>
          </h1>

          <motion.p variants={fade} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Programas, cursos y experiencias de formación continua pensadas para profesionales, estudiantes y organizaciones que
            buscan mantenerse relevantes en un entorno que cambia.
          </motion.p>

          <motion.div variants={fade} className="mt-8 flex flex-wrap gap-3">
            <Button href="/#programas" size="lg">
              Explorar programas
              <ArrowRight className="size-5 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
            </Button>
            <Button href="/#nosotros" size="lg" variant="ghost">
              Conocer UGB Plus
            </Button>
          </motion.div>

          <motion.dl variants={fade} className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse">
                <dt className="text-sm text-muted">{stat.label}</dt>
                <dd className="text-2xl font-extrabold text-ink tabular-nums">
                  {stat.prefix}
                  <span data-count>{stat.value}</span>
                  {stat.suffix}
                </dd>
              </div>
            ))}
            <div className="flex flex-col-reverse">
              <dt className="text-sm text-muted">modalidades y horarios</dt>
              <dd className="text-2xl font-extrabold text-ink">Flexible</dd>
            </div>
          </motion.dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: EASE }}
        >
          <HeroFeaturedCourse course={course} />
        </motion.div>
      </div>
    </section>
  );
}
