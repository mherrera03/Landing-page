import Image from "next/image";
import { ArrowRight, Clock, Signal, Users } from "lucide-react";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import type { Course } from "@/types/course.types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Leve inclinación alterna en escritorio: le da personalidad a la grilla
const TILT = ["", "lg:-rotate-1", "lg:rotate-1", "lg:-rotate-[0.6deg]"];

type CourseCardProps = {
  course: Course;
  index: number;
  onOpen: (course: Course) => void;
};

export function CourseCard({ course, index, onOpen }: CourseCardProps) {
  const upcoming = course.status === "proximamente";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border-[1.5px] border-ink bg-surface shadow-hard",
        "transition-[translate,rotate,box-shadow] duration-300 ease-out-expo",
        "hover:-translate-y-1.5 hover:rotate-0 hover:shadow-hard-accent focus-within:-translate-y-1.5 focus-within:rotate-0 focus-within:shadow-hard-accent",
        TILT[index % TILT.length],
      )}
    >
      <div className="relative h-44 shrink-0 overflow-hidden">
        <Image
          src={course.image}
          alt={course.imageAlt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
          <Badge variant="onImage">{COURSE_CATEGORIES[course.category].label}</Badge>
          {upcoming && <Badge variant="onImage">Próximamente</Badge>}
        </div>
        <h3 className="absolute inset-x-0 bottom-0 p-4 text-xl leading-tight font-bold text-white">{course.title}</h3>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm leading-relaxed text-muted">{course.description}</p>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4 text-xs font-medium text-muted">
          <li className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden="true" />
            {course.students === null ? "Próxima apertura" : `${course.students} estudiantes`}
          </li>
          <li className="flex items-center gap-1.5">
            <Signal className="size-4" aria-hidden="true" />
            {course.level}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {course.durationHours} horas
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="text-sm text-muted">{course.modality ? `Modalidad ${course.modality.toLowerCase()}` : "Modalidad por definir"}</span>
          {/* El ::after extiende el área de clic a toda la tarjeta */}
          <button
            type="button"
            onClick={() => onOpen(course)}
            aria-haspopup="dialog"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-violet-deep after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-violet-deep"
          >
            Ver curso
            <span className="sr-only">: {course.title}</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
