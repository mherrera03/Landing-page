"use client";

import { useActionState } from "react";
import type { PublicSettings } from "@/schemas/settings.schema";
import { saveSettingsAction } from "@/server/actions/settings.actions";
import { Input } from "@/components/ui/Input";
import { SettingsCard } from "./SettingsCard";

/** Datos de contacto que se muestran en la sección de contacto y en el pie del sitio. */
export function SettingsForm({ settings }: { settings: PublicSettings }) {
  const [state, formAction] = useActionState(saveSettingsAction, {});
  // Tras un error se conserva lo escrito; si no, se muestra lo guardado
  const v = { ...settings, ...state.values };

  return (
    <SettingsCard
      formAction={formAction}
      title="Contacto general"
      saved={state.saved}
      savedMessage="Contacto actualizado."
      submitLabel="Guardar configuración"
    >
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="email"
          name="email"
          label="Correo público"
          type="email"
          required
          defaultValue={v.email}
          error={state.fields?.email}
          wrapperClassName="sm:col-span-2"
        />
        <Input
          id="whatsapp1"
          name="whatsapp1"
          label="WhatsApp principal"
          required
          inputMode="numeric"
          defaultValue={v.whatsapp1}
          error={state.fields?.whatsapp1}
        />
        <Input
          id="whatsapp2"
          name="whatsapp2"
          label="Segundo WhatsApp"
          optional
          inputMode="numeric"
          defaultValue={v.whatsapp2}
          error={state.fields?.whatsapp2}
        />
        <p className="mb-5 text-sm text-muted sm:col-span-2">
          Escribe los números con código de país, sin +, espacios ni guiones. Ejemplo: 50326456571.
        </p>
        <Input
          id="address"
          name="address"
          label="Dirección"
          optional
          defaultValue={v.address}
          error={state.fields?.address}
          wrapperClassName="sm:col-span-2"
        />
        <Input
          id="hours"
          name="hours"
          label="Horario de atención"
          optional
          placeholder="Lunes a viernes, 8:00 a. m. a 5:00 p. m."
          defaultValue={v.hours}
          error={state.fields?.hours}
          wrapperClassName="sm:col-span-2"
        />
        <Input
          id="mapUrl"
          name="mapUrl"
          label="Enlace del mapa"
          type="url"
          optional
          placeholder="https://maps.google.com/..."
          defaultValue={v.mapUrl}
          error={state.fields?.mapUrl}
          wrapperClassName="sm:col-span-2"
        />
      </div>

      <div className="grid gap-x-5 border-t border-line pt-6 sm:grid-cols-2">
        <h3 className="mb-4 font-bold text-ink sm:col-span-2">Redes sociales</h3>
        <Input
          id="facebookUrl"
          name="facebookUrl"
          label="Facebook"
          type="url"
          optional
          defaultValue={v.facebookUrl}
          error={state.fields?.facebookUrl}
        />
        <Input
          id="instagramUrl"
          name="instagramUrl"
          label="Instagram"
          type="url"
          optional
          defaultValue={v.instagramUrl}
          error={state.fields?.instagramUrl}
        />
        <Input
          id="linkedinUrl"
          name="linkedinUrl"
          label="LinkedIn"
          type="url"
          optional
          defaultValue={v.linkedinUrl}
          error={state.fields?.linkedinUrl}
        />
        <Input
          id="youtubeUrl"
          name="youtubeUrl"
          label="YouTube"
          type="url"
          optional
          defaultValue={v.youtubeUrl}
          error={state.fields?.youtubeUrl}
        />
      </div>
    </SettingsCard>
  );
}
