import { Star } from "lucide-react";
import { toggleCourseVisibilityAction } from "@/server/actions/courses.actions";
import { COURSE_STATUS_LABELS, type Course } from "@/types/course.types";
import { EditLink, EmptyState, ListRow, Pill, RowThumbnail, VisibilityToggle } from "../ui/ListItems";

export function CourseTable({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <EmptyState title="Todavía no hay cursos" action={{ href: "/admin/cursos/nuevo", label: "Crear curso" }}>
        Crea el primero y aparecerá en la landing.
      </EmptyState>
    );
  }

  return (
    <ul className="grid gap-3">
      {courses.map((curso) => (
        <ListRow key={curso.id} dimmed={!curso.visible}>
          <RowThumbnail src={curso.image} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-ink">{curso.title}</h2>
              {curso.featured && (
                <Pill icon={Star} accent>
                  Portada
                </Pill>
              )}
              {curso.status === "proximamente" && <Pill>{COURSE_STATUS_LABELS.proximamente}</Pill>}
              {!curso.visible && <Pill>Oculto</Pill>}
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {curso.categoryName && `${curso.categoryName} · `}
              {curso.level} · {curso.durationHours} h
              {curso.modality && ` · ${curso.modality}`}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <VisibilityToggle action={toggleCourseVisibilityAction} id={curso.id} visible={curso.visible} title={curso.title} />
            <EditLink href={`/admin/cursos/${curso.id}/editar`} title={curso.title} />
          </div>
        </ListRow>
      ))}
    </ul>
  );
}
