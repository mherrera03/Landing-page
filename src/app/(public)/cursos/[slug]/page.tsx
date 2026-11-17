import { cache } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Signal } from "lucide-react";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import { findVisibleBySlug } from "@/server/database/repositories/courses.repository";
import { COURSE_STATUS_LABELS } from "@/types/course.types";
import { BackLink } from "@/components/public/layout/BackLink";

// Los metadatos y la página piden el mismo curso: con cache se consulta una sola vez por visita
const getCourse = cache(findVisibleBySlug);

export async function generateMetadata({ params }: PageProps<"/cursos/[slug]">): Promise<Metadata> {
  const course = await getCourse((await params).slug);
  return { title: course?.title ?? "Curso no encontrado", description: course?.description };
}

export default async function CoursePage({ params }: PageProps<"/cursos/[slug]">) {
  const course = await getCourse((await params).slug);
  if (!course) notFound();

  return (
    <article className="container-page py-10 lg:py-16">
      <BackLink href="/#programas">Volver a programas</BackLink>

      <div className="mt-5 grid overflow-hidden rounded-3xl border border-line bg-surface shadow-soft lg:grid-cols-2">
        <div className="relative min-h-64 bg-ink-soft lg:min-h-120">
          {course.image && (
            <Image src={course.image} alt={course.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          )}
        </div>

        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold tracking-widest text-violet-deep uppercase">{COURSE_CATEGORIES[course.category].label}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{course.title}</h1>
          <p className="mt-5 leading-relaxed whitespace-pre-line text-muted">{course.description}</p>

          <dl className="mt-7 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Clock className="size-5 text-violet-deep" aria-hidden="true" />
              <dt className="font-semibold">Duración:</dt>
              <dd>{course.durationHours} horas</dd>
            </div>
            <div className="flex items-center gap-2">
              <Signal className="size-5 text-violet-deep" aria-hidden="true" />
              <dt className="font-semibold">Nivel:</dt>
              <dd>{course.level}</dd>
            </div>
            {course.modality && (
              <div>
                <dt className="font-semibold">Modalidad</dt>
                <dd>{course.modality}</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold">Estado</dt>
              <dd>{COURSE_STATUS_LABELS[course.status]}</dd>
            </div>
          </dl>

          <Link
            href="/#contacto"
            className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-semibold text-white hover:bg-ink-soft"
          >
            Solicitar información
          </Link>
        </div>
      </div>
    </article>
  );
}
