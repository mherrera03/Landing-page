import type { Metadata } from "next";
import { requireSession } from "@/server/auth/dal";
import { createCourseAction } from "@/server/actions/courses.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CourseForm } from "@/components/admin/courses/CourseForm";

export const metadata: Metadata = { title: "Nuevo curso" };

export default async function NuevoCursoPage() {
  await requireSession();

  return (
    <>
      <PageHeader title="Nuevo curso" description="Al guardarlo aparecerá en la landing, salvo que lo dejes oculto." />
      <CourseForm action={createCourseAction} />
    </>
  );
}
