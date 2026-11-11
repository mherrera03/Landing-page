"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { BrandSettings } from "@/schemas/brand.schema";
import { saveBrandAction } from "@/server/actions/settings.actions";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : "Guardar identidad"}</button>;
}

export function BrandSettingsForm({ settings }: { settings: BrandSettings }) {
  const [state, action] = useActionState(saveBrandAction, {});
  return <form action={action} className="max-w-3xl space-y-6 rounded-2xl border border-line bg-surface p-5 sm:p-7">
    <div><h2 className="text-lg font-bold text-ink">Identidad y difusión</h2><p className="mt-1 text-sm text-muted">El logo se muestra en el encabezado y pie; la imagen para compartir se usa cuando haya una URL pública.</p></div>
    {state.saved && <p role="status" className="rounded-xl bg-success/10 p-4 text-sm text-success">Identidad actualizada.</p>}
    <Textarea id="siteDescription" name="siteDescription" label="Descripción del sitio" required rows={3} defaultValue={settings.siteDescription} error={state.fields?.siteDescription} />
    <Input id="siteUrl" name="siteUrl" label="URL pública del sitio" optional type="url" placeholder="https://ugbplus.example" defaultValue={settings.siteUrl} error={state.fields?.siteUrl} />
    <ImageUpload inputName="logoFile" pathName="logoImage" label="Logo" defaultValue={settings.logoImage} error={state.fields?.logoImage} folderHint="Se recomienda un logo horizontal, con fondo transparente." />
    <Input id="logoAlt" name="logoAlt" label="Descripción del logo" required defaultValue={settings.logoAlt} error={state.fields?.logoAlt} />
    <ImageUpload inputName="shareFile" pathName="shareImage" label="Imagen al compartir enlaces" required={false} defaultValue={settings.shareImage} error={state.fields?.shareImage} folderHint="Se recomienda una imagen horizontal de 1200 × 630 px." />
    <Input id="shareImageAlt" name="shareImageAlt" label="Descripción de la imagen para compartir" optional defaultValue={settings.shareImageAlt} error={state.fields?.shareImageAlt} />
    <Submit />
  </form>;
}
