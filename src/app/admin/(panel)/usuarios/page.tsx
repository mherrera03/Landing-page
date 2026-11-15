import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/users.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { UserTable } from "@/components/admin/users/UserTable";
import { FlashFromParams } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Usuarios" };

const MENSAJES = {
  creado: "Usuario creado correctamente.",
  actualizado: "Usuario actualizado correctamente.",
  eliminado: "Usuario eliminado correctamente.",
};

export default async function UsuariosPage({ searchParams }: PageProps<"/admin/usuarios">) {
  const session = await requireAdmin();

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Quién puede entrar al panel y qué puede administrar."
        action={
          <Button href="/admin/usuarios/nuevo">
            <Plus className="size-4" aria-hidden="true" />
            Nuevo usuario
          </Button>
        }
      />

      <FlashFromParams params={await searchParams} messages={MENSAJES} />

      <UserTable users={repo.findAll()} currentUserId={session.userId} />
    </>
  );
}
