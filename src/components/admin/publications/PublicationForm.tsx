"use client";

import { useActionState } from "react";
import { useSlugField } from "@/hooks/useSlugField";
import type { PublicationFormState } from "@/server/actions/publications.actions";
import { PUBLICATION_PATHS, type Publication, type PublicationKind } from "@/types/publication.types";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormActions } from "../ui/FormActions";
import { FormError } from "../ui/FormError";
import { ImageUpload } from "../ui/ImageUpload";
import { SubmitButton } from "../ui/SubmitButton";
import { Switch } from "../ui/Switch";

type PublicationFormProps = {
  kind: PublicationKind;
  action: (prev: PublicationFormState, formData: FormData) => Promise<PublicationFormState>;
  /** Publicación a editar. Si no viene, se crea una nueva. */
  item?: Publication;
};

/** Formulario de noticias y anuncios: comparten casi todos los campos. */
export function PublicationForm({ kind, action, item }: PublicationFormProps) {
  const [state, formAction] = useActionState<PublicationFormState, FormData>(action, {});
  // Tras un error, el formulario se repinta con lo que la persona había escrito
  const v = state.values ?? {};
  const slugField = useSlugField(item?.slug ?? "", Boolean(item));
  const isNews = kind === "noticia";

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <FormError>{state.error}</FormError>

      <Input
        id="title"
        name="title"
        label="Título"
        required
        defaultValue={v.title ?? item?.title}
        error={state.fields?.title}
        onChange={slugField.onTitleChange}
      />

      <Input
        id="slug"
        name="slug"
        label="Dirección en la web"
        required
        value={slugField.slug}
        error={state.fields?.slug}
        onChange={slugField.onSlugChange}
      />

      <Textarea
        id="summary"
        name="summary"
        label="Resumen"
        required
        rows={3}
        defaultValue={v.summary ?? item?.summary}
        error={state.fields?.summary}
      />

      <Textarea
        id="content"
        name="content"
        label={isNews ? "Contenido de la noticia" : "Texto adicional"}
        required={isNews}
        optional={!isNews}
        rows={isNews ? 12 : 4}
        defaultValue={v.content ?? item?.content}
        error={state.fields?.content}
      />

      <ImageUpload label="Imagen" required={false} defaultValue={v.image ?? item?.image} error={state.fields?.image} />

      <Input
        id="imageAlt"
        name="imageAlt"
        label="Descripción de la imagen"
        optional
        defaultValue={v.imageAlt ?? item?.imageAlt}
        error={state.fields?.imageAlt}
      />

      {isNews ? (
        // Las noticias no llevan enlace ni horario, pero el esquema espera los tres campos
        <>
          <input type="hidden" name="link" value="" />
          <input type="hidden" name="startsAt" value="" />
          <input type="hidden" name="endsAt" value="" />
        </>
      ) : (
        <>
          <Input
            id="link"
            name="link"
            label="Enlace del aviso"
            type="url"
            optional
            placeholder="https://..."
            defaultValue={v.link ?? item?.link}
            error={state.fields?.link}
          />

          <div className="grid gap-x-5 sm:grid-cols-2">
            <Input
              id="startsAt"
              name="startsAt"
              label="Mostrar desde (hora de El Salvador)"
              type="datetime-local"
              optional
              defaultValue={v.startsAt ?? item?.startsAt}
              error={state.fields?.startsAt}
            />
            <Input
              id="endsAt"
              name="endsAt"
              label="Mostrar hasta (hora de El Salvador)"
              type="datetime-local"
              optional
              defaultValue={v.endsAt ?? item?.endsAt}
              error={state.fields?.endsAt}
            />
          </div>
        </>
      )}

      <Switch
        name="visible"
        label="Publicado"
        description="Si lo desactivas, solo se verá en el panel."
        defaultChecked={item?.visible ?? false}
      />

      <FormActions cancelHref={`/admin/${PUBLICATION_PATHS[kind]}`}>
        <SubmitButton>{item ? "Guardar cambios" : isNews ? "Crear noticia" : "Crear anuncio"}</SubmitButton>
      </FormActions>
    </form>
  );
}
