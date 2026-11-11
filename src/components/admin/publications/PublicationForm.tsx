"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { slugify } from "@/schemas/course.schema";
import type { PublicationState } from "@/server/actions/publications.actions";
import type { Publication, PublicationKind } from "@/types/publication.types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { Switch } from "@/components/admin/ui/Switch";

type Props = {
  kind: PublicationKind;
  item?: Publication;
  action: (previous: PublicationState, data: FormData) => Promise<PublicationState>;
};

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center rounded-full bg-ink px-6 font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : editing ? "Guardar cambios" : "Crear"}</button>;
}

export function PublicationForm({ kind, item, action }: Props) {
  const [state, formAction] = useActionState(action, {});
  const [slug, setSlug] = useState(state.values?.slug ?? item?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!item);
  const v = state.values ?? {};
  const path = kind === "noticia" ? "noticias" : "anuncios";

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      {state.error && <p role="alert" className="rounded-xl bg-danger/10 p-4 text-danger">{state.error}</p>}
      <Input id="title" name="title" label="Título" required defaultValue={v.title ?? item?.title ?? ""} error={state.fields?.title} onChange={(e) => { if (!slugTouched) setSlug(slugify(e.target.value)); }} />
      <Input id="slug" name="slug" label="Dirección en la web" required value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} error={state.fields?.slug} />
      <Textarea id="summary" name="summary" label="Resumen" required rows={3} defaultValue={v.summary ?? item?.summary ?? ""} error={state.fields?.summary} />
      <Textarea id="content" name="content" label={kind === "noticia" ? "Contenido de la noticia" : "Texto adicional"} required={kind === "noticia"} optional={kind === "anuncio"} rows={kind === "noticia" ? 12 : 4} defaultValue={v.content ?? item?.content ?? ""} error={state.fields?.content} />
      <ImageUpload key={v.image ?? item?.image ?? ""} defaultValue={v.image ?? item?.image ?? ""} label="Imagen" required={false} error={state.fields?.image} />
      <Input id="imageAlt" name="imageAlt" label="Descripción de la imagen" optional defaultValue={v.imageAlt ?? item?.imageAlt ?? ""} error={state.fields?.imageAlt} />
      {kind === "anuncio" && <Input id="link" name="link" label="Enlace del aviso" optional type="url" placeholder="https://..." defaultValue={v.link ?? item?.link ?? ""} error={state.fields?.link} />}
      {kind === "noticia" && <input type="hidden" name="link" value="" />}
      <Switch name="visible" label="Publicado" description="Si lo desactivas, solo se verá en el panel." defaultChecked={item?.visible ?? false} />
      <div className="flex flex-wrap gap-3 border-t border-line pt-5">
        <Submit editing={!!item} />
        <Link href={`/admin/${path}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-6 font-semibold text-ink">Cancelar</Link>
      </div>
    </form>
  );
}
