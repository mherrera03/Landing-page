import type { Metadata } from "next";
import { Plus, TriangleAlert } from "lucide-react";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/categories.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CategoryTable } from "@/components/admin/categories/CategoryTable";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Categorías" };

const MENSAJES = {
  creado: "Categoría creada. Ya puedes asignarla a un curso.",
  actualizado: "Cambios guardados.",
  eliminado: "Categoría eliminada.",
};

/**
 * Los dos avisos de borrado bloqueado no pasan por `FlashFromParams`: ese solo
 * reconoce `?param=1` —no admite el número de `?enUso=3`— y pinta en verde de
 * éxito, que es el tono equivocado para algo que no se hizo.
 */
function AvisoBloqueo({ texto }: { texto: string }) {
  return (
    <p
      role="status"
      className="mb-5 flex items-center gap-2.5 rounded-xl border border-danger/20 bg-danger/8 px-4 py-3 text-sm font-medium text-danger"
    >
      <TriangleAlert className="size-4.5 shrink-0" aria-hidden="true" />
      {texto}
    </p>
  );
}

function textoDelBloqueo(params: Record<string, string | string[] | undefined>): string | null {
  if (params.ultima === "1") {
    return "No puedes eliminar la última categoría: sin ninguna no se podrían crear cursos.";
  }

  const enUso = Number(params.enUso);
  if (Number.isSafeInteger(enUso) && enUso > 0) {
    const cursos = enUso === 1 ? "1 curso usa" : `${enUso} cursos usan`;
    return `No se eliminó: ${cursos} esta categoría. Cámbiales la categoría primero.`;
  }

  return null;
}

export default async function CategoriasPage({ searchParams }: PageProps<"/admin/categorias">) {
  await requireSession();

  const params = await searchParams;
  const bloqueo = textoDelBloqueo(params);

  const [categorias, courseCounts] = await Promise.all([repo.findAll(), repo.courseCountsByKey()]);

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Con las que se clasifican los cursos en la landing."
        action={
          <Button href="/admin/categorias/nueva">
            <Plus className="size-4" aria-hidden="true" />
            Nueva categoría
          </Button>
        }
      />

      <FlashFromParams params={params} messages={MENSAJES} />
      {bloqueo && <AvisoBloqueo texto={bloqueo} />}

      <CategoryTable categories={categorias} courseCounts={courseCounts} />
    </>
  );
}
