"use client";

import { useActionState } from "react";
import type { PartnerFormState } from "@/server/actions/partners.actions";
import { PARTNER_GROUP_LABELS, PARTNER_GROUPS, type Partner } from "@/types/partner.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormActions } from "../ui/FormActions";
import { FormError } from "../ui/FormError";
import { ImageUpload } from "../ui/ImageUpload";
import { SubmitButton } from "../ui/SubmitButton";
import { Switch } from "../ui/Switch";

type PartnerFormProps = {
  action: (prev: PartnerFormState, formData: FormData) => Promise<PartnerFormState>;
  /** Aliado a editar. Si no viene, se crea uno nuevo. */
  partner?: Partner;
  /** Orden propuesto para un aliado nuevo: al final de la lista. */
  suggestedOrder?: number;
};

export function PartnerForm({ action, partner, suggestedOrder = 1 }: PartnerFormProps) {
  const [state, formAction] = useActionState<PartnerFormState, FormData>(action, {});
  // Tras un error, el formulario se repinta con lo que la persona había escrito
  const v = state.values ?? {};

  return (
    <form action={formAction} className="admin-card max-w-3xl p-5 sm:p-7">
      <FormError className="mb-5">{state.error}</FormError>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Nombre de la institución"
          required
          placeholder="Unión Europea"
          defaultValue={v.name ?? partner?.name}
          error={state.fields?.name}
          wrapperClassName="sm:col-span-2"
        />

        <ImageUpload
          label="Logo"
          fileField="logoFile"
          pathField="logo"
          allowSvg
          contain
          hint="Mejor PNG con fondo transparente o SVG, recortado sin bordes vacíos."
          defaultValue={v.logo ?? partner?.logo}
          error={state.fields?.logo}
        />

        <Input
          id="url"
          name="url"
          label="Página web"
          type="url"
          optional
          placeholder="https://..."
          defaultValue={v.url ?? partner?.url}
          error={state.fields?.url}
          wrapperClassName="sm:col-span-2"
        />

        <Select
          id="group"
          name="group"
          label="Grupo"
          required
          placeholder="Selecciona un grupo"
          options={PARTNER_GROUPS.map((group) => PARTNER_GROUP_LABELS[group])}
          values={PARTNER_GROUPS}
          defaultValue={v.group ?? partner?.group ?? "instituciones"}
          error={state.fields?.group}
        />

        <Input
          id="order"
          name="order"
          label="Posición (los números más bajos salen primero)"
          type="number"
          min={0}
          step={1}
          required
          defaultValue={v.order ?? partner?.order ?? suggestedOrder}
          error={state.fields?.order}
        />
      </div>

      <div className="mt-2 border-t border-line pt-5">
        <Switch
          name="visible"
          label="Visible en la landing"
          description="Si lo desactivas, el aliado se guarda, pero su logo no aparece públicamente."
          defaultChecked={partner ? partner.visible : true}
        />
      </div>

      <FormActions cancelHref="/admin/aliados">
        <SubmitButton>{partner ? "Guardar cambios" : "Agregar aliado"}</SubmitButton>
      </FormActions>
    </form>
  );
}
