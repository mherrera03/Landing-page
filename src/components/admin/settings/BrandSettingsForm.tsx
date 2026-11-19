"use client";

import { useActionState } from "react";
import type { BrandSettings } from "@/schemas/brand.schema";
import { saveBrandAction } from "@/server/actions/settings.actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "../ui/ImageUpload";
import { SettingsCard } from "./SettingsCard";

/** Logo, descripción del sitio e imagen que se muestra al compartir un enlace. */
export function BrandSettingsForm({ settings }: { settings: BrandSettings }) {
  const [state, formAction] = useActionState(saveBrandAction, {});
  // Tras un error se conserva lo escrito; si no, se muestra lo guardado
  const v = { ...settings, ...state.values };

  return (
    <SettingsCard
      formAction={formAction}
      title="Identidad y difusión"
      description="El logo se muestra en el encabezado y pie; la imagen para compartir se usa cuando haya una URL pública."
      saved={state.saved}
      savedMessage="Identidad actualizada."
      submitLabel="Guardar identidad"
    >
      <Textarea
        id="siteDescription"
        name="siteDescription"
        label="Descripción del sitio"
        required
        rows={3}
        defaultValue={v.siteDescription}
        error={state.fields?.siteDescription}
      />
      <Input
        id="siteUrl"
        name="siteUrl"
        label="URL pública del sitio"
        type="url"
        optional
        placeholder="https://ugbplus.example"
        defaultValue={v.siteUrl}
        error={state.fields?.siteUrl}
      />
      <ImageUpload
        fileField="logoFile"
        pathField="logoImage"
        label="Logo"
        allowSvg
        hint="Se recomienda un logo horizontal, con fondo transparente."
        defaultValue={v.logoImage}
        error={state.fields?.logoImage}
      />
      <Input
        id="logoAlt"
        name="logoAlt"
        label="Descripción del logo"
        required
        defaultValue={v.logoAlt}
        error={state.fields?.logoAlt}
      />
      <ImageUpload
        fileField="shareFile"
        pathField="shareImage"
        label="Imagen al compartir enlaces"
        required={false}
        hint="Se recomienda una imagen horizontal de 1200 × 630 px."
        defaultValue={v.shareImage}
        error={state.fields?.shareImage}
      />
      <Input
        id="shareImageAlt"
        name="shareImageAlt"
        label="Descripción de la imagen para compartir"
        optional
        defaultValue={v.shareImageAlt}
        error={state.fields?.shareImageAlt}
      />
    </SettingsCard>
  );
}
