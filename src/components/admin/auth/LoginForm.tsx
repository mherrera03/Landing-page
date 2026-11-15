"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/server/actions/auth.actions";
import { Input } from "@/components/ui/Input";
import { FormError } from "../ui/FormError";
import { SubmitButton } from "../ui/SubmitButton";

export function LoginForm({ siguiente }: { siguiente?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-6">
      {/* A dónde volver después de entrar */}
      {siguiente && <input type="hidden" name="siguiente" value={siguiente} />}

      <Input
        id="email"
        name="email"
        label="Correo"
        type="email"
        required
        autoComplete="username"
        autoFocus
        placeholder="nombre@ugb.edu.sv"
        defaultValue={state.values?.email}
        error={state.fields?.email}
      />

      <Input
        id="password"
        name="password"
        label="Contraseña"
        type="password"
        required
        autoComplete="current-password"
        placeholder="••••••••"
        error={state.fields?.password}
      />

      <FormError>{state.error}</FormError>

      <SubmitButton icon={LogIn} pendingLabel="Ingresando…" className="mt-2 w-full">
        Ingresar
      </SubmitButton>
    </form>
  );
}
