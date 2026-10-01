import Image from "next/image";
import { ArrowRight, Clock, Signal, Users } from "lucide-react";
import { COURSE_CATEGORIES } from "@/constants/course-categories";
import type { Course } from "@/types/course.types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type CourseDetailProps = {
  course: Course;
  onRequestInfo: (course: Course) => void;
};

/** Ficha del curso que se muestra dentro del modal. */
export function CourseDetail({ course, onRequestInfo }: CourseDetailProps) {
  const stats = [
    { icon: Users, label: "Estudiantes", value: course.students === null ? "Próx. apertura" : String(course.students) },
    { icon: Signal, label: "Nivel", value: course.level },
    { icon: Clock, label: "Duración", value: `${course.durationHours} h` },
  ];

  return (
    <div>
      <div className="relative h-52">
        <Image src={course.image} alt={course.imageAlt} fill sizes="(min-width: 640px) 32rem, 100vw" className="object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/20 to-transparent" />
        <div className="absolute bottom-4 left-5 flex gap-2">
          <Badge variant="onImage">{COURSE_CATEGORIES[course.category].label}</Badge>
          {course.modality && <Badge variant="onImage">{course.modality}</Badge>}
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <p aria-hidden="true" className="text-2xl leading-tight font-extrabold tracking-tight text-ink">
          {course.title}
        </p>
        <p className="mt-2 leading-relaxed text-muted">{course.description}</p>

        <dl className="my-6 grid grid-cols-3 divide-x divide-line border-y border-line py-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-2 text-center">
              <Icon className="size-5 text-violet-deep" aria-hidden="true" />
              <dd className="text-sm font-bold text-ink">{value}</dd>
              <dt className="text-xs text-muted">{label}</dt>
            </div>
          ))}
        </dl>

        <Button size="lg" className="w-full" onClick={() => onRequestInfo(course)}>
          Solicitar información
          <ArrowRight className="size-5 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
        </Button>
        <p className="mt-3 text-center text-xs text-muted">Te llevamos al formulario de contacto con este curso ya seleccionado.</p>
      </div>
    </div>
  );
}
