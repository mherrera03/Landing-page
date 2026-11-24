import type { Metadata } from "next";
import { requireSession } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/categories.repository";
import { createCategoryAction } from "@/server/actions/categories.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";

export const metadata: Metadata = { title: "Nueva categoría" };

export default async function NuevaCategoriaPage() {
  await requireSession();

  return (
    <>
      <PageHeader title="Nueva categoría" description="Al guardarla podrás asignarla a cualquier curso." />
      <CategoryForm action={createCategoryAction} suggestedOrder={await repo.nextOrder()} />
    </>
  );
}
