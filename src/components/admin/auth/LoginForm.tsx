"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleAlert, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/server/actions/auth.actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending} className="mt-2 w-full">
      {pending ? "Ingresando…" : "Ingresar"}
      {!pending && <LogIn className="size-4" aria-hidden="true" />}
    </Button>
  );
}

export function LoginForm({ siguiente }: { siguiente?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-6">
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
        defaultValue={state.email}
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

      {state.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
