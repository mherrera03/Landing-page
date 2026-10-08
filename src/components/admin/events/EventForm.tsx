"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CircleAlert, Save } from "lucide-react";
import { slugify } from "@/schemas/course.schema";
import type { EventFormState } from "@/server/actions/events.actions";
import { EVENT_KINDS, EVENT_KIND_LABELS, type EventItem } from "@/types/event.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Switch } from "../ui/Switch";

type EventFormProps = {
  action: (prev: EventFormState, formData: FormData) => Promise<EventFormState>;
  /** Evento a editar. Si no viene, es uno nuevo. */
  event?: EventItem;
};

export function EventForm({ action, event }: EventFormProps) {
  const [state, formAction] = useActionState<EventFormState, FormData>(action, {});
  const v = state.values ?? {};

  // La dirección se genera desde el título hasta que el usuario la edita a mano
  const [slug, setSlug] = useState(v.slug ?? event?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(Boolean(event));

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      {state.error && (
        <p role="alert" className="mb-5 flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="title"
          name="title"
          label="Título"
          required
          placeholder="Masterclass abierta"
          defaultValue={v.title ?? event?.title}
          error={state.fields?.title}
          wrapperClassName="sm:col-span-2"
          onChange={(e) => !slugTocado && setSlug(slugify(e.target.value))}
        />

        <Input
          id="slug"
          name="slug"
          label="Dirección en la web"
          required
          placeholder="masterclass-abierta"
          value={slug}
          error={state.fields?.slug}
          wrapperClassName="sm:col-span-2"
          onChange={(e) => {
            setSlugTocado(true);
            setSlug(e.target.value);
          }}
        />

        <Select
          id="kind"
          name="kind"
          label="Tipo"
          required
          placeholder="Selecciona un tipo"
          options={EVENT_KINDS.map((k) => EVENT_KIND_LABELS[k])}
          values={EVENT_KINDS}
          defaultValue={v.kind ?? event?.kind ?? ""}
          error={state.fields?.kind}
        />

        <Input
          id="tag"
          name="tag"
          label="Etiqueta"
          required
          placeholder="Próximamente"
          maxLength={30}
          defaultValue={v.tag ?? event?.tag}
          error={state.fields?.tag}
        />

        <Input
          id="date"
          name="date"
          label="Fecha"
          type="date"
          optional
          defaultValue={v.date ?? event?.date ?? ""}
          error={state.fields?.date}
        />

        <Input
          id="place"
          name="place"
          label="Lugar o modalidad"
          optional
          placeholder="Virtual, Campus San Miguel…"
          defaultValue={v.place ?? event?.place}
          error={state.fields?.place}
        />

        <Textarea
          id="description"
          name="description"
          label="Descripción"
          required
          rows={3}
          placeholder="En pocas líneas, de qué trata el evento."
          defaultValue={v.description ?? event?.description}
          error={state.fields?.description}
          wrapperClassName="sm:col-span-2"
        />

        <Input
          id="link"
          name="link"
          label="Enlace del botón"
          optional
          placeholder="https://… o /#contacto"
          defaultValue={v.link ?? event?.link}
          error={state.fields?.link}
        />

        <Input
          id="linkText"
          name="linkText"
          label="Texto del botón"
          optional
          placeholder="Inscribirme"
          maxLength={40}
          defaultValue={v.linkText ?? event?.linkText}
          error={state.fields?.linkText}
        />
      </div>

      <p className="-mt-2 mb-4 text-xs text-muted">
        El botón solo aparece si escribes un enlace. Usa <code className="rounded bg-paper px-1">/#contacto</code> para llevar al
        formulario de la propia landing.
      </p>

      <div className="border-t border-line pt-5">
        <Switch
          name="visible"
          label="Visible en la landing"
          description="Si lo apagas, el evento se guarda pero nadie lo ve."
          defaultChecked={event ? event.visible : true}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
        <SubmitButton isEdit={Boolean(event)} />
        <Link
          href="/admin/eventos"
          className="inline-flex min-h-12 items-center rounded-full border border-line px-6 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-paper"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" loading={pending}>
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear evento"}
      {!pending && <Save className="size-4" aria-hidden="true" />}
    </Button>
  );
}
