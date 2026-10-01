import "server-only";
import type { Course } from "@/types/course.types";
import * as repo from "@/server/database/repositories/courses.repository";

/** Cursos visibles, para la landing. Se administran desde /admin/cursos. */
export async function getCourses(): Promise<Course[]> {
  return repo.findVisible();
}

/** Curso destacado de la portada. */
export async function getFeaturedCourse(): Promise<Course | null> {
  return repo.findFeatured();
}
