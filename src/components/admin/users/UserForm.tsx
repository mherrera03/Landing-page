"use client";

import { useActionState, useState } from "react";
import type { UserFormState } from "@/server/actions/users.actions";
import { USER_ROLES, USER_ROLE_HINTS, USER_ROLE_LABELS, type AdminUser, type UserRole } from "@/types/user.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormActions } from "../ui/FormActions";
import { FormError } from "../ui/FormError";
import { SubmitButton } from "../ui/SubmitButton";
import { Switch } from "../ui/Switch";

type UserFormProps = {
  action: (prev: UserFormState, formData: FormData) => Promise<UserFormState>;
  /** Cuenta a editar. Si no viene, se crea una nueva. */
  user?: AdminUser;
  /** Tu propia cuenta: no puedes quitarte el rol ni el acceso. */
  esMiCuenta?: boolean;
};

export function UserForm({ action, user, esMiCuenta = false }: UserFormProps) {
  const [state, formAction] = useActionState<UserFormState, FormData>(action, {});
  // Tras un error, el formulario se repinta con lo que la persona había escrito
  const v = state.values ?? {};
  const editando = Boolean(user);
  // El rol se guarda en estado para que la explicación de abajo cambie al elegir otro
  const [role, setRole] = useState<UserRole>(user?.role ?? "editor");

  return (
    <form action={formAction} className="admin-card p-5 sm:p-7">
      <FormError className="mb-5">{state.error}</FormError>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Nombre completo"
          required
          autoComplete="name"
          placeholder="Michelle Portillo"
          defaultValue={v.name ?? user?.name}
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
          defaultValue={v.email ?? user?.email}
          error={state.fields?.email}
        />

        <Select
          id="role"
          name="role"
          label="Rol"
          required
          placeholder="Selecciona un rol"
          options={USER_ROLES.map((rol) => USER_ROLE_LABELS[rol])}
          values={USER_ROLES}
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
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
        <>
          <p className="mt-2 rounded-xl bg-paper px-4 py-3 text-sm text-muted">
            Esta es tu cuenta: no puedes cambiarte el rol ni quitarte el acceso. Pídeselo a otro administrador.
          </p>
          {/* Los campos deshabilitados no se envían: así el rol y el acceso llegan igual */}
          <input type="hidden" name="role" value="admin" />
          <input type="hidden" name="active" value="on" />
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">{USER_ROLE_HINTS[role]}</p>

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

      <FormActions cancelHref="/admin/usuarios">
        <SubmitButton>{editando ? "Guardar cambios" : "Crear usuario"}</SubmitButton>
      </FormActions>
    </form>
  );
}
