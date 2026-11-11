"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { PublicSettings } from "@/schemas/settings.schema";
import { saveSettingsAction } from "@/server/actions/settings.actions";
import { Input } from "@/components/ui/Input";

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : "Guardar configuración"}</button>;
}

export function SettingsForm({ settings }: { settings: PublicSettings }) {
  const [state, action] = useActionState(saveSettingsAction, {});
  return (
    <form action={action} className="max-w-3xl space-y-7 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      {state.saved && <p role="status" className="rounded-xl bg-success/10 p-4 text-sm text-success">Contacto actualizado.</p>}
      <div className="grid gap-x-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><h2 className="mb-4 text-lg font-bold text-ink">Contacto general</h2></div>
        <Input id="email" name="email" label="Correo público" type="email" required defaultValue={settings.email} error={state.fields?.email} wrapperClassName="sm:col-span-2" />
        <Input id="whatsapp1" name="whatsapp1" label="WhatsApp principal" required inputMode="numeric" defaultValue={settings.whatsapp1} error={state.fields?.whatsapp1} />
        <Input id="whatsapp2" name="whatsapp2" label="Segundo WhatsApp" optional inputMode="numeric" defaultValue={settings.whatsapp2} error={state.fields?.whatsapp2} />
        <p className="mb-5 text-sm text-muted sm:col-span-2">Escribe los números con código de país, sin +, espacios ni guiones. Ejemplo: 50326456571.</p>
        <Input id="address" name="address" label="Dirección" optional defaultValue={settings.address} error={state.fields?.address} wrapperClassName="sm:col-span-2" />
        <Input id="hours" name="hours" label="Horario de atención" optional placeholder="Lunes a viernes, 8:00 a. m. a 5:00 p. m." defaultValue={settings.hours} error={state.fields?.hours} wrapperClassName="sm:col-span-2" />
        <Input id="mapUrl" name="mapUrl" label="Enlace del mapa" optional type="url" placeholder="https://maps.google.com/..." defaultValue={settings.mapUrl} error={state.fields?.mapUrl} wrapperClassName="sm:col-span-2" />
      </div>
      <div className="grid gap-x-5 border-t border-line pt-6 sm:grid-cols-2">
        <div className="sm:col-span-2"><h2 className="mb-4 text-lg font-bold text-ink">Redes sociales</h2></div>
        <Input id="facebookUrl" name="facebookUrl" label="Facebook" optional type="url" defaultValue={settings.facebookUrl} error={state.fields?.facebookUrl} />
        <Input id="instagramUrl" name="instagramUrl" label="Instagram" optional type="url" defaultValue={settings.instagramUrl} error={state.fields?.instagramUrl} />
        <Input id="linkedinUrl" name="linkedinUrl" label="LinkedIn" optional type="url" defaultValue={settings.linkedinUrl} error={state.fields?.linkedinUrl} />
        <Input id="youtubeUrl" name="youtubeUrl" label="YouTube" optional type="url" defaultValue={settings.youtubeUrl} error={state.fields?.youtubeUrl} />
      </div>
      <Submit />
    </form>
  );
}
