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
  return <form action={action} className="max-w-2xl space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
    {state.saved && <p role="status" className="rounded-xl bg-success/10 p-4 text-sm text-success">Configuración guardada.</p>}
    <Input id="email" name="email" label="Correo público" type="email" required defaultValue={settings.email} error={state.fields?.email} />
    <Input id="whatsapp1" name="whatsapp1" label="WhatsApp principal" required inputMode="numeric" defaultValue={settings.whatsapp1} error={state.fields?.whatsapp1} />
    <Input id="whatsapp2" name="whatsapp2" label="Segundo WhatsApp" optional inputMode="numeric" defaultValue={settings.whatsapp2} error={state.fields?.whatsapp2} />
    <p className="text-sm text-muted">Escribe los números con código de país, sin +, espacios ni guiones. Ejemplo: 50326456571.</p>
    <Submit />
  </form>;
}
