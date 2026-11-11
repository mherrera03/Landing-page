import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { findVisibleBySlug } from "@/server/database/repositories/courses.repository";
import { COURSE_CATEGORIES } from "@/constants/course-categories";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = findVisibleBySlug((await params).slug);
  return { title: course?.title ?? "Curso no encontrado", description: course?.description };
}

export default async function CoursePage({ params }: Props) {
  const course = findVisibleBySlug((await params).slug);
  if (!course) notFound();

  return (
    <article className="container-page py-10 lg:py-16">
      <Link href="/#programas" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-deep"><ArrowLeft className="size-4" />Volver a programas</Link>
      <div className="mt-5 grid overflow-hidden rounded-3xl border border-line bg-surface shadow-soft lg:grid-cols-2">
        <div className="relative min-h-64 bg-ink-soft lg:min-h-120">
          {course.image && <Image src={course.image} alt={course.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />}
        </div>
        <div className="p-6 sm:p-10">
          <p className="text-sm font-bold tracking-widest text-violet-deep uppercase">{COURSE_CATEGORIES[course.category].label}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{course.title}</h1>
          <p className="mt-5 whitespace-pre-line leading-relaxed text-muted">{course.description}</p>
          <dl className="mt-7 grid gap-3 border-t border-line pt-6 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2"><Clock className="size-5 text-violet-deep" /><dt className="font-semibold">Duración:</dt><dd>{course.durationHours} horas</dd></div>
            <div className="flex items-center gap-2"><Users className="size-5 text-violet-deep" /><dt className="font-semibold">Nivel:</dt><dd>{course.level}</dd></div>
            {course.modality && <div><dt className="font-semibold">Modalidad</dt><dd>{course.modality}</dd></div>}
            <div><dt className="font-semibold">Estado</dt><dd>{course.status === "proximamente" ? "Próximamente" : "Activo"}</dd></div>
          </dl>
          <Link href="/#contacto" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-semibold text-white hover:bg-ink-soft">Solicitar información</Link>
        </div>
      </div>
    </article>
  );
}
