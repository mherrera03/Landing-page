"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Publication } from "@/types/publication.types";
import { saveFeaturedAnnouncementAction } from "@/server/actions/settings.actions";
import { Select } from "@/components/ui/Select";

function Submit() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : "Guardar aviso destacado"}</button>;
}

export function AnnouncementSettingsForm({ announcements, featuredId }: { announcements: Publication[]; featuredId: number }) {
  const [state, action] = useActionState(saveFeaturedAnnouncementAction, {});
  const published = announcements.filter((item) => item.visible);
  return <form action={action} className="max-w-3xl space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
    <div><h2 className="text-lg font-bold text-ink">Aviso destacado</h2><p className="mt-1 text-sm text-muted">Elige un anuncio publicado para la franja superior. Si no está dentro de su horario, se mostrará el más reciente que sí esté activo.</p></div>
    {state.saved && <p role="status" className="rounded-xl bg-success/10 p-4 text-sm text-success">Aviso destacado actualizado.</p>}
    <Select id="featuredAnnouncementId" name="featuredAnnouncementId" label="Anuncio de la franja" placeholder="Selecciona una opción" options={["Automático: el más reciente", ...published.map((item) => item.title)]} values={["0", ...published.map((item) => String(item.id))]} defaultValue={String(featuredId)} error={state.fields?.featuredAnnouncementId} />
    <Submit />
  </form>;
}
