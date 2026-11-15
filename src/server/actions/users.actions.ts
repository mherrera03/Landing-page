"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUserSchema, updateUserSchema, type UserFormField } from "@/schemas/user.schema";
import { requireAdmin } from "@/server/auth/dal";
import { hashPassword } from "@/server/auth/password";
import * as repo from "@/server/database/repositories/users.repository";
import { parseForm, readId } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type UserFormState = FormState<UserFormField>;

/** La contraseña nunca se devuelve al formulario: se vuelve a escribir. */
const FORM_OPTIONS = { switches: ["active"], secrets: ["password"] };

export async function createUserAction(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireAdmin();

  const parsed = await parseForm(formData, createUserSchema, FORM_OPTIONS);
  if (!parsed.ok) return parsed.state;

  const { password, ...datos } = parsed.data;

  if (repo.emailTaken(datos.email)) {
    return { values: parsed.values, fields: { email: "Ya existe una cuenta con este correo." } };
  }

  repo.create(datos, hashPassword(password));
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?creado=1");
}

export async function updateUserAction(id: number, _prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const session = await requireAdmin();

  const actual = repo.findById(id);
  if (!actual) return { error: "Esta cuenta ya no existe." };

  const parsed = await parseForm(formData, updateUserSchema, FORM_OPTIONS);
  if (!parsed.ok) return parsed.state;

  const { password, ...datos } = parsed.data;
  const { values } = parsed;

  if (repo.emailTaken(datos.email, id)) {
    return { values, fields: { email: "Ya existe otra cuenta con este correo." } };
  }

  // Nadie debe poder quitarse a sí mismo el acceso: quedaría encerrado fuera
  // de esta sección y sin forma de volver a entrar desde el panel.
  const esMiCuenta = id === session.userId;
  if (esMiCuenta && datos.role !== "admin") {
    return { values, fields: { role: "No puedes quitarte el rol de administrador a ti mismo." } };
  }
  if (esMiCuenta && !datos.active) {
    return { values, fields: { active: "No puedes desactivar tu propia cuenta." } };
  }

  // Y siempre tiene que quedar alguien que pueda administrar usuarios.
  const dejaDeSerAdmin = actual.role === "admin" && actual.active && (datos.role !== "admin" || !datos.active);
  if (dejaDeSerAdmin && repo.countOtherActiveAdmins(id) === 0) {
    return { values, error: "Es el único administrador activo. Nombra a otro antes de cambiar esta cuenta." };
  }

  repo.update(id, datos, password === "" ? undefined : hashPassword(password));
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios?actualizado=1");
}

export async function toggleUserActiveAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = readId(formData);
  if (id === null || id === session.userId) return;

  const usuario = repo.findById(id);
  if (!usuario) return;

  // Desactivar al último admin dejaría el panel sin quien gestione usuarios
  if (usuario.active && usuario.role === "admin" && repo.countOtherActiveAdmins(id) === 0) return;

  repo.toggleActive(id);
  revalidatePath("/admin/usuarios");
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = readId(formData);

  if (id !== null && id !== session.userId) {
    const usuario = repo.findById(id);
    const ultimoAdmin = usuario?.role === "admin" && usuario.active && repo.countOtherActiveAdmins(id) === 0;

    if (usuario && !ultimoAdmin) {
      repo.remove(id);
      revalidatePath("/admin/usuarios");
    }
  }

  redirect("/admin/usuarios?eliminado=1");
}
