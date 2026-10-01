import type { Metadata } from "next";
import { Plus } from "lucide-react";
import * as repo from "@/server/database/repositories/courses.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CourseTable } from "@/components/admin/courses/CourseTable";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Cursos" };

const MENSAJES: Record<string, string> = {
  creado: "Curso creado. Ya aparece en la landing.",
  actualizado: "Cambios guardados.",
  eliminado: "Curso eliminado.",
};

export default async function CursosPage({ searchParams }: PageProps<"/admin/cursos">) {
  const params = await searchParams;
  const cursos = repo.findAll();

  const aviso = Object.keys(MENSAJES).find((k) => params[k] === "1");

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

      {aviso && <FlashMessage>{MENSAJES[aviso]}</FlashMessage>}

      <CourseTable courses={cursos} />
    </>
  );
}
