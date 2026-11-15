"use client";

import { useActionState } from "react";
import type { LandingSettings } from "@/schemas/landing.schema";
import { saveLandingAction } from "@/server/actions/settings.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { SettingsCard } from "./SettingsCard";

/** Textos, botones y cifras de la portada. */
export function LandingSettingsForm({ settings }: { settings: LandingSettings }) {
  const [state, formAction] = useActionState(saveLandingAction, {});
  // Tras un error se conserva lo escrito; si no, se muestra lo guardado
  const v = { ...settings, ...state.values };

  return (
    <SettingsCard
      formAction={formAction}
      title="Portada y cifras"
      description="Revisa las cifras con el cliente antes de publicar el sitio."
      saved={state.saved}
      savedMessage="Portada actualizada."
      submitLabel="Guardar portada"
    >
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="heroTitle1"
          name="heroTitle1"
          label="Primera línea del título"
          required
          defaultValue={v.heroTitle1}
          error={state.fields?.heroTitle1}
          wrapperClassName="sm:col-span-2"
        />
        <Input
          id="heroTitle2"
          name="heroTitle2"
          label="Segunda línea del título"
          required
          defaultValue={v.heroTitle2}
          error={state.fields?.heroTitle2}
          wrapperClassName="sm:col-span-2"
        />
        <Textarea
          id="heroDescription"
          name="heroDescription"
          label="Texto principal"
          required
          rows={4}
          defaultValue={v.heroDescription}
          error={state.fields?.heroDescription}
          wrapperClassName="sm:col-span-2"
        />
        <Input
          id="heroPrimaryLabel"
          name="heroPrimaryLabel"
          label="Botón principal"
          required
          defaultValue={v.heroPrimaryLabel}
          error={state.fields?.heroPrimaryLabel}
        />
        <Input
          id="heroPrimaryHref"
          name="heroPrimaryHref"
          label="Destino del botón principal"
          required
          defaultValue={v.heroPrimaryHref}
          error={state.fields?.heroPrimaryHref}
        />
        <Input
          id="heroSecondaryLabel"
          name="heroSecondaryLabel"
          label="Botón secundario"
          required
          defaultValue={v.heroSecondaryLabel}
          error={state.fields?.heroSecondaryLabel}
        />
        <Input
          id="heroSecondaryHref"
          name="heroSecondaryHref"
          label="Destino del botón secundario"
          required
          defaultValue={v.heroSecondaryHref}
          error={state.fields?.heroSecondaryHref}
        />
        <Input
          id="contactButtonLabel"
          name="contactButtonLabel"
          label="Botón de contacto del encabezado"
          required
          defaultValue={v.contactButtonLabel}
          error={state.fields?.contactButtonLabel}
        />
        <Input
          id="contactButtonHref"
          name="contactButtonHref"
          label="Destino del botón de contacto"
          required
          defaultValue={v.contactButtonHref}
          error={state.fields?.contactButtonHref}
        />
      </div>

      <div className="grid gap-x-5 border-t border-line pt-6 sm:grid-cols-2">
        <h3 className="mb-4 font-bold text-ink sm:col-span-2">Cifras del inicio</h3>
        <Input
          id="heroActivePrograms"
          name="heroActivePrograms"
          label="Programas activos (titular)"
          type="number"
          min={0}
          required
          defaultValue={v.heroActivePrograms}
          error={state.fields?.heroActivePrograms}
        />
        <Input
          id="heroPracticePercent"
          name="heroPracticePercent"
          label="Enfoque práctico (%)"
          type="number"
          min={0}
          max={100}
          required
          defaultValue={v.heroPracticePercent}
          error={state.fields?.heroPracticePercent}
        />
        <Input
          id="foundingYear"
          name="foundingYear"
          label="Año de fundación"
          type="number"
          min={1900}
          max={2100}
          required
          defaultValue={v.foundingYear}
          error={state.fields?.foundingYear}
        />
        <Input
          id="peopleTrained"
          name="peopleTrained"
          label="Personas formadas"
          type="number"
          min={0}
          required
          defaultValue={v.peopleTrained}
          error={state.fields?.peopleTrained}
        />
        <Input
          id="programsDelivered"
          name="programsDelivered"
          label="Programas impartidos"
          type="number"
          min={0}
          required
          defaultValue={v.programsDelivered}
          error={state.fields?.programsDelivered}
        />
        <Input
          id="satisfactionPercent"
          name="satisfactionPercent"
          label="Satisfacción (%)"
          type="number"
          min={0}
          max={100}
          required
          defaultValue={v.satisfactionPercent}
          error={state.fields?.satisfactionPercent}
        />
      </div>
    </SettingsCard>
  );
}
