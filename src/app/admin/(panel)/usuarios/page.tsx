import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/users.repository";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { UserTable } from "@/components/admin/users/UserTable";
import { FlashMessage } from "@/components/admin/ui/FlashMessage";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Usuarios",
};

const MENSAJES: Record<string, string> = {
  creado: "Usuario creado correctamente.",
  actualizado: "Usuario actualizado correctamente.",
  eliminado: "Usuario eliminado correctamente.",
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UsuariosPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = await searchParams;
  const usuarios = repo.findAll();

  const mensaje = Object.keys(MENSAJES).find((key) => params[key] === "1");

  return (
    <div className="space-y-6">
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

      {mensaje && <FlashMessage>{MENSAJES[mensaje]}</FlashMessage>}

      <UserTable users={usuarios} currentUserId={session.userId} />
    </div>
  );
}
