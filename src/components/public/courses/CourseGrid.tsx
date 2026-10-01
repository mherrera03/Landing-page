"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SearchX } from "lucide-react";
import { COURSE_CATEGORY_KEYS } from "@/constants/course-categories";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import type { Course } from "@/types/course.types";
import { Modal } from "@/components/ui/Modal";
import { CourseCard } from "./CourseCard";
import { CourseDetail } from "./CourseDetail";
import { CourseFilters, type CourseFilter } from "./CourseFilters";

/** Evento con el que la ficha del curso le avisa al formulario de contacto qué curso interesa. */
export const LEAD_INTEREST_EVENT = "ugb:lead-interest";

export function CourseGrid({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<CourseFilter>("all");
  const [selected, setSelected] = useState<Course | null>(null);
  // Se conserva el último curso para que la ficha no se vacíe durante la animación de cierre
  const [lastSelected, setLastSelected] = useState<Course | null>(null);
  const scrollToSection = useScrollToSection();

  const counts = useMemo(() => {
    const result = { all: courses.length } as Record<CourseFilter, number>;
    for (const key of COURSE_CATEGORY_KEYS) result[key] = courses.filter((c) => c.category === key).length;
    return result;
  }, [courses]);

  const visible = filter === "all" ? courses : courses.filter((c) => c.category === filter);

  const open = useCallback((course: Course) => {
    setSelected(course);
    setLastSelected(course);
  }, []);
  const close = useCallback(() => setSelected(null), []);

  const requestInfo = useCallback(
    (course: Course) => {
      setSelected(null);
      window.dispatchEvent(new CustomEvent<string>(LEAD_INTEREST_EVENT, { detail: course.title }));
      // Espera a que el modal libere el scroll antes de desplazarse
      window.setTimeout(() => scrollToSection("contacto"), 80);
    },
    [scrollToSection],
  );

  return (
    <>
      <CourseFilters value={filter} counts={counts} onChange={setFilter} />

      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "curso encontrado" : "cursos encontrados"}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/20 bg-surface px-6 py-14 text-center">
          <SearchX className="mx-auto size-10 text-muted" aria-hidden="true" />
          <p className="mt-3 font-semibold text-ink">Aún no hay cursos en esta categoría</p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-2 min-h-11 px-3 text-sm font-bold text-violet-deep underline-offset-4 hover:underline"
          >
            Ver todos los cursos
          </button>
        </div>
      ) : (
        <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((course, i) => (
              <motion.li
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18, ease: "easeIn" } }}
                transition={{ duration: 0.35, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1], layout: { type: "spring", stiffness: 300, damping: 32 } }}
              >
                <CourseCard course={course} index={i} onOpen={open} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <Modal open={selected !== null} onClose={close} title={lastSelected ? `Curso: ${lastSelected.title}` : "Curso"}>
        {lastSelected && <CourseDetail course={lastSelected} onRequestInfo={requestInfo} />}
      </Modal>
    </>
  );
}
