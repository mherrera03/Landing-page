import type { Metadata } from "next";
import { requireAdmin } from "@/server/auth/dal";
import { createUserAction } from "@/server/actions/users.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { UserForm } from "@/components/admin/users/UserForm";

export const metadata: Metadata = { title: "Nuevo usuario" };

export default async function NuevoUsuarioPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        title="Nuevo usuario"
        description="Crea la cuenta y entrégale la contraseña a la persona para que pueda entrar."
      />
      <UserForm action={createUserAction} />
    </>
  );
}
