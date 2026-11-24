import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/categories.repository";
import { updateCategoryAction } from "@/server/actions/categories.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { DeleteCategoryButton } from "@/components/admin/categories/DeleteCategoryButton";

export const metadata: Metadata = { title: "Editar categoría" };

export default async function EditarCategoriaPage({ params }: PageProps<"/admin/categorias/[id]/editar">) {
  await requireSession();

  const { id } = await params;
  const categoria = await repo.findById(Number(id));
  if (!categoria) notFound();

  // El id va fijo aquí: no viaja en el formulario, así nadie puede cambiarlo
  const action = updateCategoryAction.bind(null, categoria.id);
  const cursos = await repo.countCourses(categoria.key);

  return (
    <>
      <PageHeader
        title="Editar categoría"
        description={categoria.name}
        action={<DeleteCategoryButton id={categoria.id} name={categoria.name} courses={cursos} />}
      />
      <CategoryForm action={action} category={categoria} />
    </>
  );
}
