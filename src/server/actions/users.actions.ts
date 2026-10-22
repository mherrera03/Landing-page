"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createUserSchema, updateUserSchema, type UserFormField } from "@/schemas/user.schema";
import { requireAdmin } from "@/server/auth/dal";
import { hashPassword } from "@/server/auth/password";
import * as repo from "@/server/database/repositories/users.repository";

export type UserFormState = {
  error?: string;
  fields?: Partial<Record<UserFormField, string>>;
  /** Lo que se había escrito, para no perderlo si hay un error. */
  values?: Record<string, string>;
};

function refreshPages() {
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin");
}

/** La contraseña nunca se devuelve al formulario: se vuelve a escribir. */
function toFormValues(values: Record<string, string>): Record<string, string> {
  const { password: _password, ...resto } = values;
  return resto;
}

function parseForm(formData: FormData, modo: "crear" | "editar") {
  const values = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string").map(([k, v]) => [k, String(v)]),
  ) as Record<string, string>;

  const schema = modo === "crear" ? createUserSchema : updateUserSchema;
  const result = schema.safeParse({ ...values, active: formData.get("active") === "on" });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    const fields: UserFormState["fields"] = {};
    for (const key of Object.keys(fieldErrors) as UserFormField[]) fields[key] = fieldErrors[key]?.[0];
    return { ok: false as const, state: { values: toFormValues(values), fields } };
  }

  return { ok: true as const, data: result.data, values };
}

export async function createUserAction(_prev: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireAdmin();

  const parsed = parseForm(formData, "crear");
  if (!parsed.ok) return parsed.state;

  const { password, ...datos } = parsed.data;

  if (repo.emailTaken(datos.email)) {
    return { values: toFormValues(parsed.values), fields: { email: "Ya existe una cuenta con este correo." } };
  }

  repo.insert(datos, hashPassword(password));
  refreshPages();

  redirect("/admin/usuarios?creado=1");
}

export async function updateUserAction(id: number, _prev: UserFormState, formData: FormData): Promise<UserFormState> {
  const session = await requireAdmin();

  const actual = repo.findById(id);
  if (!actual) return { error: "Esta cuenta ya no existe." };

  const parsed = parseForm(formData, "editar");
  if (!parsed.ok) return parsed.state;

  const { password, ...datos } = parsed.data;
  const values = toFormValues(parsed.values);

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
  refreshPages();

  redirect("/admin/usuarios?actualizado=1");
}

export async function toggleUserActiveAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0 || id === session.userId) return;

  const usuario = repo.findById(id);
  if (!usuario) return;

  // Desactivar al último admin dejaría el panel sin quien gestione usuarios
  if (usuario.active && usuario.role === "admin" && repo.countOtherActiveAdmins(id) === 0) return;

  repo.toggleActive(id);
  refreshPages();
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();

  const id = Number(formData.get("id"));

  if (Number.isSafeInteger(id) && id > 0 && id !== session.userId) {
    const usuario = repo.findById(id);
    const ultimoAdmin = usuario?.role === "admin" && usuario.active && repo.countOtherActiveAdmins(id) === 0;

    if (usuario && !ultimoAdmin) {
      repo.remove(id);
      refreshPages();
    }
  }

  redirect("/admin/usuarios?eliminado=1");
}
