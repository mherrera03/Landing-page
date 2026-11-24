"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import type { Course } from "@/types/course.types";
import { Badge } from "@/components/ui/Badge";

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" as const },
});

/**
 * Fotos reales de la actividad de UGB Plus que rodean la tarjeta. Antes aquí
 * había dos pastillas inventadas ("UGB+", "Nuevo · Cupos limitados"): decían
 * poco y eran lo único que se veía además del curso.
 *
 * Son decorativas —lo que cuentan ya lo dice el texto del hero— así que van con
 * alt vacío. La posición de cada una está pensada para que asomen alrededor de
 * la tarjeta sin taparla.
 */
const MOSAICO = [
  { src: "/images/hero/ceremonia.webp", clase: "top-0 right-0 w-[52%] rotate-[-3deg]", retraso: 0 },
  { src: "/images/hero/trabajo-de-campo.webp", clase: "bottom-4 left-0 w-[41%] rotate-[4deg]", retraso: 1.2 },
  { src: "/images/hero/stand.webp", clase: "right-2 bottom-14 w-[36%] rotate-[2deg]", retraso: 2.4 },
];

/** Tarjeta del curso destacado, rodeada de fotos reales sobre la mancha de color. */
export function HeroFeaturedCourse({ course }: { course: Course }) {
  return (
    <div className="relative grid min-h-[25rem] place-items-center sm:min-h-[30rem] lg:min-h-[33rem]">
      {/* La mancha de marca pasa a ser el resplandor del fondo: ahora el peso
          visual lo llevan las fotos, no ella. */}
      <div
        data-hero-blob
        aria-hidden="true"
        className="absolute size-[18.5rem] animate-blob bg-brand opacity-60 blur-2xl sm:size-[25rem] lg:size-[27rem]"
      />

      {/* Por debajo de sm no caben: la columna es estrecha y taparían la tarjeta. */}
      {MOSAICO.map((foto) => (
        <motion.div
          key={foto.src}
          {...float(foto.retraso)}
          aria-hidden="true"
          className={`absolute hidden overflow-hidden rounded-2xl border-2 border-white/80 shadow-lift sm:block ${foto.clase}`}
        >
          <Image
            src={foto.src}
            alt=""
            width={560}
            height={420}
            sizes="(min-width: 1024px) 14rem, 20vw"
            className="h-auto w-full object-cover"
          />
        </motion.div>
      ))}

      <article className="material material-card relative z-10 w-[min(21rem,86%)] rotate-2 rounded-[1.9rem] border border-white/70 bg-white/90 p-4 shadow-lift backdrop-blur-md transition-transform duration-500 ease-out-expo hover:rotate-0 sm:p-5">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[1.4rem]">
          <Image
            src={course.image}
            alt={course.imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 21rem, 86vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <p className="text-xs font-medium text-white/85">Programa destacado</p>
            <h2 className="mt-1 text-xl leading-tight font-bold sm:text-2xl">{course.title}</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-4">
          <div className="flex flex-wrap gap-2">
            <Badge>
              <Clock className="size-3.5" aria-hidden="true" />
              {course.durationHours} horas
            </Badge>
            {course.modality && <Badge>{course.modality}</Badge>}
          </div>
          <Link
            href="/#programas"
            className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-violet-deep"
          >
            Ver cursos
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </div>
  );
}
