import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Star } from "lucide-react";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import { toggleCourseVisibilityAction } from "@/server/actions/courses.actions";
import type { Course } from "@/types/course.types";
import { cn } from "@/lib/utils";

export function CourseTable({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 bg-surface px-6 py-14 text-center">
        <p className="font-semibold text-ink">Todavía no hay cursos</p>
        <p className="mt-1 text-sm text-muted">Crea el primero y aparecerá en la landing.</p>
        <Link href="/admin/cursos/nuevo" className="mt-4 inline-flex min-h-11 items-center px-3 font-bold text-violet-deep">
          Crear curso
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {courses.map((curso) => (
        <li
          key={curso.id}
          className={cn(
            "flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center",
            !curso.visible && "opacity-70",
          )}
        >
          <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-paper sm:h-16 sm:w-24">
            {curso.image && <Image src={curso.image} alt="" fill sizes="96px" className="object-cover" />}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-ink">{curso.title}</h2>
              {curso.featured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-soft px-2 py-0.5 text-xs font-semibold text-violet-deep">
                  <Star className="size-3" aria-hidden="true" />
                  Portada
                </span>
              )}
              {curso.status === "proximamente" && (
                <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Próximamente</span>
              )}
              {!curso.visible && <span className="rounded-full bg-paper px-2 py-0.5 text-xs font-semibold text-muted">Oculto</span>}
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {COURSE_CATEGORIES[curso.category].label} · {curso.level} · {curso.durationHours} h
              {curso.modality && ` · ${curso.modality}`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {/* Ocultar o mostrar sin entrar a editar */}
            <form action={toggleCourseVisibilityAction}>
              <input type="hidden" name="id" value={curso.id} />
              <button
                type="submit"
                title={curso.visible ? "Ocultar de la landing" : "Mostrar en la landing"}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
              >
                {curso.visible ? <Eye className="size-4" aria-hidden="true" /> : <EyeOff className="size-4" aria-hidden="true" />}
                <span className="sr-only sm:not-sr-only">{curso.visible ? "Visible" : "Oculto"}</span>
              </button>
            </form>

            <Link
              href={`/admin/cursos/${curso.id}/editar`}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
            >
              <Pencil className="size-4" aria-hidden="true" />
              Editar
              <span className="sr-only">{curso.title}</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
