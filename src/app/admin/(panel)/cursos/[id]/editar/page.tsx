import type { Metadata } from "next";
import { notFound } from "next/navigation";
import * as repo from "@/server/database/repositories/courses.repository";
import { updateCourseAction } from "@/server/actions/courses.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CourseForm } from "@/components/admin/courses/CourseForm";
import { DeleteCourseButton } from "@/components/admin/courses/DeleteCourseButton";

export const metadata: Metadata = { title: "Editar curso" };

export default async function EditarCursoPage({ params }: PageProps<"/admin/cursos/[id]/editar">) {
  const { id } = await params;
  const curso = repo.findById(Number(id));
  if (!curso) notFound();

  // El id va fijo aquí: no viaja en el formulario, así nadie puede cambiarlo
  const action = updateCourseAction.bind(null, curso.id);

  return (
    <>
      <PageHeader title="Editar curso" description={curso.title} action={<DeleteCourseButton id={curso.id} title={curso.title} />} />
      <CourseForm action={action} course={curso} />
    </>
  );
}
