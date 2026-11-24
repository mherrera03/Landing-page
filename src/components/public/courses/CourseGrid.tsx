"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { SearchX } from "lucide-react";
import { useScrollToSection } from "@/hooks/useScrollToSection";
import { announceLeadInterest } from "@/lib/lead-interest";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course.types";
import { Modal } from "@/components/ui/Modal";
import { CourseCard } from "./CourseCard";
import { CourseDetail } from "./CourseDetail";
import { CourseFilters, type CourseFilter, type CourseFilterOption } from "./CourseFilters";

export function CourseGrid({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<CourseFilter>(null);
  const [selected, setSelected] = useState<Course | null>(null);
  // Se conserva el último curso para que la ficha no se vacíe durante la animación de cierre
  const [lastSelected, setLastSelected] = useState<Course | null>(null);
  const scrollToSection = useScrollToSection();
  // Carrusel del celular: qué curso está al centro (para los puntos de abajo)
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);

  // Una pastilla por categoría que realmente tenga cursos aquí. Con categorías
  // ilimitadas, pintar una por cada categoría existente llenaría la barra de
  // filtros vacíos.
  const options = useMemo(() => {
    const porClave = new Map<string, CourseFilterOption & { order: number }>();

    for (const course of courses) {
      // Un curso cuya categoría se borró no tiene nombre que poner en la pastilla.
      if (!course.categoryName) continue;

      const yaEsta = porClave.get(course.category);
      if (yaEsta) {
        yaEsta.count++;
        continue;
      }
      porClave.set(course.category, {
        key: course.category,
        label: course.categoryName,
        count: 1,
        order: course.categoryOrder,
      });
    }

    // El orden que se configura en el panel manda; a igualdad, alfabético.
    return [...porClave.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label, "es"));
  }, [courses]);

  const visible = filter === null ? courses : courses.filter((c) => c.category === filter);

  /** El curso cuyo centro queda más cerca del centro de la fila. */
  function onTrackScroll() {
    const track = trackRef.current;
    if (!track) return;
    const middle = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const box = child.getBoundingClientRect();
      const distance = Math.abs(box.left + box.width / 2 - middle);
      if (distance < bestDistance) [best, bestDistance] = [i, distance];
    });
    setCurrent(best);
  }

  function goTo(i: number) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    trackRef.current?.children[i]?.scrollIntoView({ inline: "center", block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }

  function changeFilter(next: CourseFilter) {
    setFilter(next);
    setCurrent(0);
    trackRef.current?.scrollTo({ left: 0 });
  }

  const open = useCallback((course: Course) => {
    setSelected(course);
    setLastSelected(course);
  }, []);
  const close = useCallback(() => setSelected(null), []);

  const requestInfo = useCallback(
    (course: Course) => {
      setSelected(null);
      // El formulario de contacto precarga el mensaje con este curso
      announceLeadInterest(course.title);
      // Espera a que el modal libere el scroll antes de desplazarse
      window.setTimeout(() => scrollToSection("contacto"), 80);
    },
    [scrollToSection],
  );

  return (
    <>
      <CourseFilters value={filter} options={options} total={courses.length} onChange={changeFilter} />

      <p className="sr-only" role="status">
        {visible.length} {visible.length === 1 ? "curso encontrado" : "cursos encontrados"}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/20 bg-surface px-6 py-14 text-center">
          <SearchX className="mx-auto size-10 text-muted" aria-hidden="true" />
          <p className="mt-3 font-semibold text-ink">Aún no hay cursos en esta categoría</p>
          <button
            type="button"
            onClick={() => changeFilter(null)}
            className="mt-2 min-h-11 px-3 text-sm font-bold text-violet-deep underline-offset-4 hover:underline"
          >
            Ver todos los cursos
          </button>
        </div>
      ) : (
        <ul
          ref={trackRef}
          onScroll={onTrackScroll}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pt-1 pb-7 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-6 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pt-0 sm:pb-0 lg:grid-cols-3"
        >
          {/*
          La fila deslizable en celular es de "Cambios Mobile"; la rejilla en
          pantallas grandes, la de siempre.

          Va sin AnimatePresence a propósito. Con él, esta rejilla no quitaba
          del DOM las tarjetas filtradas: al elegir una categoría el aviso
          decía "1 curso encontrado" pero seguían viéndose las cuatro, o sea
          que el filtro no filtraba nada. Quitando una cosa cada vez se
          descartó que fuera `mode="popLayout"` o la prop `layout`: fallaba
          igual sin las dos, y dejaba de fallar al quitar AnimatePresence. Ojo,
          no es que AnimatePresence esté roto en general — en `ui/Modal.tsx`
          funciona bien, con un único hijo condicional; lo que falla aquí es
          con una lista de hijos por clave (motion 13.5 + React 19.2 + Next 16).
          Se pierde el fundido de salida; se gana un filtro que funciona.
          */}
          {visible.map((course, i) => (
            <motion.li
              key={course.id}
              className="w-[82%] shrink-0 snap-center sm:w-auto sm:shrink"
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.04 * i, ease: [0.16, 1, 0.3, 1], layout: { type: "spring", stiffness: 300, damping: 32 } }}
            >
              <CourseCard course={course} index={i} onOpen={open} />
            </motion.li>
          ))}
        </ul>
      )}

      {/* Solo en el celular: avisa que hay más cursos al deslizar y deja saltar a uno */}
      {visible.length > 1 && (
        <div className="-mt-3 flex justify-center gap-1 sm:hidden" role="group" aria-label="Elegir curso">
          {visible.map((course, i) => (
            <button
              key={course.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al curso ${i + 1} de ${visible.length}: ${course.title}`}
              aria-current={i === current ? "true" : undefined}
              className="grid h-11 place-items-center px-1"
            >
              <span className={cn("block h-2 rounded-full transition-all duration-300", i === current ? "w-7 bg-violet-deep" : "w-2 bg-ink/20")} />
            </button>
          ))}
        </div>
      )}

      <Modal open={selected !== null} onClose={close} title={lastSelected ? `Curso: ${lastSelected.title}` : "Curso"}>
        {lastSelected && <CourseDetail course={lastSelected} onRequestInfo={requestInfo} />}
      </Modal>
    </>
  );
}
