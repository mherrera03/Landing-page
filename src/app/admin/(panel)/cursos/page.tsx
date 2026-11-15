import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/courses.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CourseTable } from "@/components/admin/courses/CourseTable";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Cursos" };

const MENSAJES = {
  creado: "Curso creado. Ya aparece en la landing.",
  actualizado: "Cambios guardados.",
  eliminado: "Curso eliminado.",
};

export default async function CursosPage({ searchParams }: PageProps<"/admin/cursos">) {
  await requireSession();

  return (
    <>
      <PageHeader
        title="Cursos"
        description="Lo que publiques aquí es lo que se ve en la sección Programas de la landing."
        action={
          <Button href="/admin/cursos/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo curso
          </Button>
        }
      />

      <FlashFromParams params={await searchParams} messages={MENSAJES} />

      <CourseTable courses={repo.findAll()} />
    </>
  );
}
