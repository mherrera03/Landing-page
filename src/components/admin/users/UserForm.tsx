"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CircleAlert, Save } from "lucide-react";
import type { UserFormState } from "@/server/actions/users.actions";
import { USER_ROLES, USER_ROLE_HINTS, USER_ROLE_LABELS, type AdminUser } from "@/types/user.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Switch } from "../ui/Switch";

type UserFormProps = {
  action: (prev: UserFormState, formData: FormData) => Promise<UserFormState>;
  /** Cuenta a editar. Si no viene, se crea una nueva. */
  user?: AdminUser;
  /** Tu propia cuenta: no puedes quitarte el rol ni el acceso. */
  esMiCuenta?: boolean;
};

const ROLE_LABELS = USER_ROLES.map((rol) => USER_ROLE_LABELS[rol]);

export function UserForm({ action, user, esMiCuenta = false }: UserFormProps) {
  const [state, formAction] = useActionState<UserFormState, FormData>(action, {});
  const v = state.values ?? {};
  const editando = Boolean(user);

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      {state.error && (
        <p role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Nombre completo"
          required
          autoComplete="name"
          placeholder="Michelle Portillo"
          defaultValue={v.name ?? user?.name ?? ""}
          error={state.fields?.name}
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Correo"
          required
          autoComplete="email"
          placeholder="nombre@ugb.edu.sv"
          defaultValue={v.email ?? user?.email ?? ""}
          error={state.fields?.email}
        />

        <Select
          id="role"
          name="role"
          label="Rol"
          required
          placeholder="Selecciona un rol"
          options={ROLE_LABELS}
          values={USER_ROLES}
          defaultValue={v.role ?? user?.role ?? "editor"}
          error={state.fields?.role}
          disabled={esMiCuenta}
        />

        <Input
          id="password"
          name="password"
          type="password"
          label={editando ? "Contraseña nueva" : "Contraseña"}
          required={!editando}
          optional={editando}
          autoComplete="new-password"
          placeholder={editando ? "Déjala vacía para no cambiarla" : "Mínimo 8 caracteres"}
          error={state.fields?.password}
        />
      </div>

      {esMiCuenta ? (
        <p className="mt-2 rounded-xl bg-paper px-4 py-3 text-sm text-muted">
          Esta es tu cuenta: no puedes cambiarte el rol ni quitarte el acceso. Pídeselo a otro administrador.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">{USER_ROLE_HINTS[(v.role ?? user?.role ?? "editor") as "admin" | "editor"]}</p>

          <div className="mt-4 border-t border-line pt-5">
            <Switch
              name="active"
              label="Puede entrar al panel"
              description="Si lo apagas, la cuenta se conserva pero no podrá iniciar sesión."
              defaultChecked={user ? user.active : true}
            />
            {state.fields?.active && (
              <p role="alert" className="mt-2 text-sm text-danger">
                {state.fields.active}
              </p>
            )}
          </div>
        </>
      )}

      {/* Los campos deshabilitados no se envían: así el rol y el acceso llegan igual */}
      {esMiCuenta && (
        <>
          <input type="hidden" name="role" value="admin" />
          <input type="hidden" name="active" value="on" />
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
        <SubmitButton isEdit={editando} />

        <Link
          href="/admin/usuarios"
          className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" loading={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear usuario"}
      {!pending && <Save className="size-4" aria-hidden="true" />}
    </Button>
  );
}
