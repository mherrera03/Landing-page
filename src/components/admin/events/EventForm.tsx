"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CircleAlert, Save } from "lucide-react";

import { slugify } from "@/schemas/course.schema";
import type { EventFormState } from "@/server/actions/events.actions";
import { EVENT_TYPES, EVENT_MODALITIES, type UgbEvent } from "@/types/event.types";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "../ui/ImageUpload";
import { Switch } from "../ui/Switch";

type EventFormProps = {
  action: (
    prev: EventFormState,
    formData: FormData
  ) => Promise<EventFormState>;
  /** Evento a editar. Si no viene, se crea uno nuevo. */
  event?: UgbEvent;
};

export function EventForm({ action, event }: EventFormProps) {
  const [state, formAction] = useActionState<EventFormState, FormData>(
    action,
    {}
  );

  const v = state.values ?? {};

  const [slug, setSlug] = useState(v.slug ?? event?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(Boolean(event));

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-line bg-surface p-5 sm:p-7"
    >
      {state.error && (
        <p
          role="alert"
          className="mb-5 flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          <CircleAlert
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          {state.error}
        </p>
      )}

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="title"
          name="title"
          label="Título del evento"
          required
          placeholder="Masterclass abierta"
          defaultValue={v.title ?? event?.title}
          error={state.fields?.title}
          wrapperClassName="sm:col-span-2"
          onChange={(e) => {
            if (!slugTocado) {
              setSlug(slugify(e.target.value));
            }
          }}
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
          id="type"
          name="type"
          label="Tipo de evento"
          required
          placeholder="Selecciona un tipo"
          options={[...EVENT_TYPES]}
          defaultValue={v.type ?? event?.type ?? ""}
          error={state.fields?.type}
        />

        <Select
          id="modality"
          name="modality"
          label="Modalidad"
          required
          placeholder="Selecciona una modalidad"
          options={[...EVENT_MODALITIES]}
          defaultValue={v.modality ?? event?.modality ?? ""}
          error={state.fields?.modality}
        />

        <Input
          id="date"
          name="date"
          label="Fecha"
          type="date"
          required
          defaultValue={v.date ?? event?.date ?? ""}
          error={state.fields?.date}
        />

        <Input
          id="time"
          name="time"
          label="Hora de inicio"
          type="time"
          required
          defaultValue={v.time ?? event?.time ?? ""}
          error={state.fields?.time}
        />

        <Input
          id="location"
          name="location"
          label="Lugar o plataforma"
          optional
          placeholder="Campus UGB San Miguel / Microsoft Teams"
          defaultValue={v.location ?? event?.location ?? ""}
          error={state.fields?.location}
          wrapperClassName="sm:col-span-2"
        />

        <Input
          id="price"
          name="price"
          label="Costo (USD)"
          type="number"
          min={0}
          step="0.01"
          optional
          placeholder="Déjalo vacío si es gratis"
          defaultValue={v.price ?? event?.price ?? ""}
          error={state.fields?.price}
        />

        <Input
          id="capacity"
          name="capacity"
          label="Cupos disponibles"
          type="number"
          min={1}
          step={1}
          optional
          placeholder="Déjalo vacío si no hay límite"
          defaultValue={v.capacity ?? event?.capacity ?? ""}
          error={state.fields?.capacity}
        />

        <Input
          id="registrationUrl"
          name="registrationUrl"
          label="Enlace de inscripción"
          type="url"
          optional
          placeholder="https://..."
          defaultValue={v.registrationUrl ?? event?.registrationUrl ?? ""}
          error={state.fields?.registrationUrl}
          wrapperClassName="sm:col-span-2"
        />

        <Select
          id="status"
          name="status"
          label="Estado"
          required
          placeholder="Selecciona un estado"
          options={[
            "Inscripción abierta",
            "Próximamente",
            "Finalizado",
          ]}
          values={["abierto", "proximamente", "finalizado"]}
          defaultValue={v.status ?? event?.status ?? "abierto"}
          error={state.fields?.status}
          wrapperClassName="sm:col-span-2"
        />

        <Textarea
          id="description"
          name="description"
          label="Descripción"
          required
          rows={4}
          placeholder="Explica de qué trata el evento y a quién va dirigido."
          defaultValue={v.description ?? event?.description ?? ""}
          error={state.fields?.description}
          wrapperClassName="sm:col-span-2"
        />

        <ImageUpload
          defaultValue={v.image ?? event?.image ?? ""}
          error={state.fields?.image}
        />

        <Input
          id="imageAlt"
          name="imageAlt"
          label="Descripción de la imagen"
          required
          placeholder="Personas participando en una conferencia de la UGB"
          defaultValue={v.imageAlt ?? event?.imageAlt ?? ""}
          error={state.fields?.imageAlt}
          wrapperClassName="sm:col-span-2"
        />
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-line pt-5">
        <Switch
          name="visible"
          label="Visible en la landing"
          description="Si lo desactivas, el evento se guarda, pero no aparece públicamente."
          defaultChecked={event ? event.visible : true}
        />

        <Switch
          name="featured"
          label="Destacar en la portada"
          description="Marca este evento como destacado en el inicio."
          defaultChecked={event?.featured ?? false}
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
      {pending
        ? "Guardando…"
        : isEdit
          ? "Guardar cambios"
          : "Crear evento"}

      {!pending && (
        <Save className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}