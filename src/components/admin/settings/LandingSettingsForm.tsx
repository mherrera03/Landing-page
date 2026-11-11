"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { LandingSettings } from "@/schemas/landing.schema";
import { saveLandingAction } from "@/server/actions/settings.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : "Guardar portada"}</button>;
}

export function LandingSettingsForm({ settings }: { settings: LandingSettings }) {
  const [state, action] = useActionState(saveLandingAction, {});
  return <form action={action} className="max-w-3xl space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-7">
    <div><h2 className="text-lg font-bold text-ink">Portada y cifras</h2><p className="mt-1 text-sm text-muted">Revisa las cifras con el cliente antes de publicar el sitio.</p></div>
    {state.saved && <p role="status" className="rounded-xl bg-success/10 p-4 text-sm text-success">Portada actualizada.</p>}
    <div className="grid gap-x-5 sm:grid-cols-2">
      <Input id="heroTitle1" name="heroTitle1" label="Primera línea del título" required defaultValue={settings.heroTitle1} error={state.fields?.heroTitle1} wrapperClassName="sm:col-span-2" />
      <Input id="heroTitle2" name="heroTitle2" label="Segunda línea del título" required defaultValue={settings.heroTitle2} error={state.fields?.heroTitle2} wrapperClassName="sm:col-span-2" />
      <Textarea id="heroDescription" name="heroDescription" label="Texto principal" required rows={4} defaultValue={settings.heroDescription} error={state.fields?.heroDescription} wrapperClassName="sm:col-span-2" />
      <Input id="heroPrimaryLabel" name="heroPrimaryLabel" label="Botón principal" required defaultValue={settings.heroPrimaryLabel} error={state.fields?.heroPrimaryLabel} />
      <Input id="heroPrimaryHref" name="heroPrimaryHref" label="Destino del botón principal" required defaultValue={settings.heroPrimaryHref} error={state.fields?.heroPrimaryHref} />
      <Input id="heroSecondaryLabel" name="heroSecondaryLabel" label="Botón secundario" required defaultValue={settings.heroSecondaryLabel} error={state.fields?.heroSecondaryLabel} />
      <Input id="heroSecondaryHref" name="heroSecondaryHref" label="Destino del botón secundario" required defaultValue={settings.heroSecondaryHref} error={state.fields?.heroSecondaryHref} />
      <Input id="contactButtonLabel" name="contactButtonLabel" label="Botón de contacto del encabezado" required defaultValue={settings.contactButtonLabel} error={state.fields?.contactButtonLabel} />
      <Input id="contactButtonHref" name="contactButtonHref" label="Destino del botón de contacto" required defaultValue={settings.contactButtonHref} error={state.fields?.contactButtonHref} />
    </div>
    <div className="grid gap-x-5 border-t border-line pt-6 sm:grid-cols-2">
      <div className="sm:col-span-2"><h3 className="mb-4 font-bold text-ink">Cifras del inicio</h3></div>
      <Input id="heroActivePrograms" name="heroActivePrograms" label="Programas activos (titular)" type="number" min={0} required defaultValue={settings.heroActivePrograms} error={state.fields?.heroActivePrograms} />
      <Input id="heroPracticePercent" name="heroPracticePercent" label="Enfoque práctico (%)" type="number" min={0} max={100} required defaultValue={settings.heroPracticePercent} error={state.fields?.heroPracticePercent} />
      <Input id="foundingYear" name="foundingYear" label="Año de fundación" type="number" min={1900} max={2100} required defaultValue={settings.foundingYear} error={state.fields?.foundingYear} />
      <Input id="peopleTrained" name="peopleTrained" label="Personas formadas" type="number" min={0} required defaultValue={settings.peopleTrained} error={state.fields?.peopleTrained} />
      <Input id="programsDelivered" name="programsDelivered" label="Programas impartidos" type="number" min={0} required defaultValue={settings.programsDelivered} error={state.fields?.programsDelivered} />
      <Input id="satisfactionPercent" name="satisfactionPercent" label="Satisfacción (%)" type="number" min={0} max={100} required defaultValue={settings.satisfactionPercent} error={state.fields?.satisfactionPercent} />
    </div>
    <Submit />
  </form>;
}
