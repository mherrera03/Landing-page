"use client";

import { useActionState } from "react";
import type { Publication } from "@/types/publication.types";
import { saveFeaturedAnnouncementAction } from "@/server/actions/settings.actions";
import { Select } from "@/components/ui/Select";
import { SettingsCard } from "./SettingsCard";

type AnnouncementSettingsFormProps = {
  /** Anuncios publicados: solo esos pueden destacarse. */
  announcements: Publication[];
  /** 0 = automático, se muestra el más reciente. */
  featuredId: number;
};

/** Elige qué anuncio sale en la franja superior del sitio. */
export function AnnouncementSettingsForm({ announcements, featuredId }: AnnouncementSettingsFormProps) {
  const [state, formAction] = useActionState(saveFeaturedAnnouncementAction, {});

  return (
    <SettingsCard
      formAction={formAction}
      title="Aviso destacado"
      description="Elige un anuncio publicado para la franja superior. Si no está dentro de su horario, se mostrará el más reciente que sí esté activo."
      saved={state.saved}
      savedMessage="Aviso destacado actualizado."
      submitLabel="Guardar aviso destacado"
    >
      <Select
        id="featuredAnnouncementId"
        name="featuredAnnouncementId"
        label="Anuncio de la franja"
        placeholder="Selecciona una opción"
        options={["Automático: el más reciente", ...announcements.map((item) => item.title)]}
        values={["0", ...announcements.map((item) => String(item.id))]}
        defaultValue={String(featuredId)}
        error={state.fields?.featuredAnnouncementId}
      />
    </SettingsCard>
  );
}
