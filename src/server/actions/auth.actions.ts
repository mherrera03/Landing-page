"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { loginSchema } from "@/schemas/auth.schema";
import { findActiveByEmail } from "@/server/database/repositories/users.repository";
import { verifyPassword } from "@/server/auth/password";
import { createSession, destroySession } from "@/server/auth/session";

export type LoginState = {
  error?: string;
  fields?: Partial<Record<"email" | "password", string>>;
  email?: string;
};

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const result = loginSchema.safeParse({ email, password: formData.get("password") });

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    return {
      email,
      fields: { email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] },
    };
  }

  const user = findActiveByEmail(result.data.email);

  // Mismo mensaje si el correo no existe o si la contraseña falla:
  // así nadie puede averiguar qué correos están registrados.
  if (!user || !verifyPassword(result.data.password, user.password_hash)) {
    return { email, error: "Correo o contraseña incorrectos." };
  }

  await createSession({ userId: user.id, name: user.nombre, role: user.rol });

  const siguiente = String(formData.get("siguiente") ?? "");
  // Solo rutas internas del admin: evita que un enlace manipulado
  // redirija a un sitio externo tras iniciar sesión.
  redirect(siguiente.startsWith("/admin/") ? siguiente : "/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
