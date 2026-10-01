"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, Sparkles, Users } from "lucide-react";
import type { Course } from "@/types/course.types";
import { Badge } from "@/components/ui/Badge";

const float = (delay: number) => ({
  animate: { y: [0, -10, 0] },
  transition: { duration: 5.5, delay, repeat: Infinity, ease: "easeInOut" as const },
});

/** Tarjeta del curso destacado sobre la mancha de color del hero. */
export function HeroFeaturedCourse({ course }: { course: Course }) {
  return (
    <div className="relative grid min-h-[25rem] place-items-center sm:min-h-[30rem] lg:min-h-[33rem]">
      <div
        data-hero-blob
        aria-hidden="true"
        className="absolute size-[18.5rem] animate-blob bg-brand opacity-95 shadow-soft sm:size-[25rem] lg:size-[27rem]"
      />

      <motion.div
        {...float(0)}
        aria-hidden="true"
        className="absolute top-10 left-0 z-10 hidden items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft sm:flex"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-violet-soft text-violet-deep">
          <Sparkles className="size-5" />
        </span>
        <span className="text-xs font-semibold text-ink">
          <span className="block text-lg leading-tight font-extrabold text-violet-deep">UGB+</span>
          Aprende · Aplica · Avanza
        </span>
      </motion.div>

      <article className="relative w-[min(24rem,88%)] rotate-2 rounded-[1.9rem] border border-white/70 bg-white/90 p-4 shadow-lift backdrop-blur-md transition-transform duration-500 ease-out-expo hover:rotate-0 sm:p-5">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[1.4rem]">
          <Image
            src={course.image}
            alt={course.imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 24rem, 88vw"
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

      <motion.div
        {...float(1.2)}
        aria-hidden="true"
        className="absolute right-0 bottom-12 z-10 hidden items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-soft sm:flex"
      >
        <span className="grid size-10 place-items-center rounded-xl bg-violet-soft text-violet-deep">
          <Users className="size-5" />
        </span>
        <span className="text-xs font-semibold text-ink">
          <span className="block text-lg leading-tight font-extrabold text-violet-deep">Nuevo</span>
          Cupos limitados
        </span>
      </motion.div>
    </div>
  );
}
