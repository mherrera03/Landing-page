"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * `null` es "Todos", y es `null` a propósito: antes era la cadena `"all"`, y
 * desde que las categorías las crea el personal, una llamada "All" generaría
 * justo esa clave y su pastilla se comportaría como "ver todos".
 */
export type CourseFilter = string | null;

export type CourseFilterOption = {
  /** La clave de la categoría, que es lo que guarda cada curso. */
  key: string;
  label: string;
  count: number;
};

type CourseFiltersProps = {
  value: CourseFilter;
  /** Las categorías con cursos. Sin "Todos": esa la añade este componente. */
  options: CourseFilterOption[];
  /** Cuántos cursos hay en total, para el contador de "Todos". */
  total: number;
  onChange: (filter: CourseFilter) => void;
};

export function CourseFilters({ value, options, total, onChange }: CourseFiltersProps) {
  const pastillas: { key: CourseFilter; label: string; count: number }[] = [
    { key: null, label: "Todos", count: total },
    ...options,
  ];

  return (
    <div role="group" aria-label="Filtrar cursos por categoría" className="mb-8 flex flex-wrap gap-2.5">
      {pastillas.map(({ key, label, count }) => {
        const active = key === value;
        return (
          <button
            // `slugify` nunca produce guiones bajos, así que este identificador
            // no puede chocar con la clave de una categoría llamada "Todos".
            key={key ?? "__todos__"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={cn(
              "relative inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200",
              active ? "border-ink text-white" : "border-line bg-surface text-ink hover:border-ink/40",
            )}
          >
            {/* La pastilla oscura se desliza de un filtro a otro */}
            {active && (
              <motion.span
                layoutId="course-filter-pill"
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{label}</span>
            <span className={cn("relative text-xs tabular-nums", active ? "text-white/70" : "text-muted")}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
