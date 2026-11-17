"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/auth.schema";
import { findActiveWithPasswordByEmail } from "@/server/database/repositories/users.repository";
import { verifyPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";
import { assertAdminHost } from "@/server/auth/dal";
import { fieldErrors } from "@/server/forms";
import type { FormState } from "@/types/form.types";

export type LoginState = FormState<"email" | "password">;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  // No se puede iniciar sesión desde el dominio público
  await assertAdminHost();

  const email = String(formData.get("email") ?? "");
  // La contraseña nunca se devuelve al formulario: se vuelve a escribir
  const values = { email };

  const result = loginSchema.safeParse({ email, password: formData.get("password") });
  if (!result.success) return { values, fields: fieldErrors(result.error) };

  const user = await findActiveWithPasswordByEmail(result.data.email);

  // Mismo mensaje si el correo no existe o si la contraseña falla:
  // así nadie puede averiguar qué correos están registrados.
  if (!user || !verifyPassword(result.data.password, user.passwordHash)) {
    return { values, error: "Correo o contraseña incorrectos." };
  }

  await createSession({ userId: user.id, name: user.name, role: user.role });

  const siguiente = String(formData.get("siguiente") ?? "");
  // Solo rutas internas del admin: evita que un enlace manipulado
  // redirija a un sitio externo tras iniciar sesión.
  redirect(siguiente.startsWith("/admin/") ? siguiente : "/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
