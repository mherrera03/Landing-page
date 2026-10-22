import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/server/auth/dal";
import * as repo from "@/server/database/repositories/users.repository";
import { updateUserAction } from "@/server/actions/users.actions";
import { PageHeader } from "@/components/admin/layout/PageHeader";
import { UserForm } from "@/components/admin/users/UserForm";
import { DeleteUserButton } from "@/components/admin/users/DeleteUserButton";

export const metadata: Metadata = { title: "Editar usuario" };

export default async function EditarUsuarioPage({ params }: PageProps<"/admin/usuarios/[id]/editar">) {
  const session = await requireAdmin();
  const { id } = await params;

  const usuario = repo.findById(Number(id));
  if (!usuario) notFound();

  const esMiCuenta = usuario.id === session.userId;
  // Quedarse sin ningún administrador dejaría esta sección sin quien la use
  const esUltimoAdmin = usuario.role === "admin" && usuario.active && repo.countOtherActiveAdmins(usuario.id) === 0;

  // El id va fijo aquí: no viaja en el formulario, así nadie puede cambiarlo
  const action = updateUserAction.bind(null, usuario.id);

  return (
    <>
      <PageHeader
        title="Editar usuario"
        description={usuario.email}
        action={
          esMiCuenta || esUltimoAdmin ? undefined : <DeleteUserButton id={usuario.id} nombre={usuario.name} />
        }
      />
      <UserForm action={action} user={usuario} esMiCuenta={esMiCuenta} />
    </>
  );
}
