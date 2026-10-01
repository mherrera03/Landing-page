"use client";

import { motion } from "motion/react";
import { COURSE_CATEGORIES, COURSE_CATEGORY_KEYS } from "@/constants/course-categories";
import type { CourseCategory } from "@/types/course.types";
import { cn } from "@/lib/utils";

export type CourseFilter = CourseCategory | "all";

type CourseFiltersProps = {
  value: CourseFilter;
  counts: Record<CourseFilter, number>;
  onChange: (filter: CourseFilter) => void;
};

export function CourseFilters({ value, counts, onChange }: CourseFiltersProps) {
  const options: { key: CourseFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    ...COURSE_CATEGORY_KEYS.map((key) => ({ key, label: COURSE_CATEGORIES[key].label })),
  ];

  return (
    <div role="group" aria-label="Filtrar cursos por categoría" className="mb-8 flex flex-wrap gap-2.5">
      {options.map(({ key, label }) => {
        const active = key === value;
        return (
          <button
            key={key}
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
            <span className={cn("relative text-xs tabular-nums", active ? "text-white/70" : "text-muted")}>{counts[key]}</span>
          </button>
        );
      })}
    </div>
  );
}
