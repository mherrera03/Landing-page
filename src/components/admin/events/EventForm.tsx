"use client";

import { useActionState } from "react";
import { useSlugField } from "@/hooks/useSlugField";
import type { EventFormState } from "@/server/actions/events.actions";
import { EVENT_MODALITIES, EVENT_STATUSES, EVENT_STATUS_LABELS, EVENT_TYPES, type UgbEvent } from "@/types/event.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormActions } from "../ui/FormActions";
import { FormError } from "../ui/FormError";
import { ImageUpload } from "../ui/ImageUpload";
import { SubmitButton } from "../ui/SubmitButton";
import { Switch } from "../ui/Switch";

type EventFormProps = {
  action: (prev: EventFormState, formData: FormData) => Promise<EventFormState>;
  /** Evento a editar. Si no viene, se crea uno nuevo. */
  event?: UgbEvent;
};

export function EventForm({ action, event }: EventFormProps) {
  const [state, formAction] = useActionState<EventFormState, FormData>(action, {});
  // Tras un error, el formulario se repinta con lo que la persona había escrito
  const v = state.values ?? {};
  const slugField = useSlugField(event?.slug ?? "", Boolean(event));

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <FormError className="mb-5">{state.error}</FormError>

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
          onChange={slugField.onTitleChange}
        />

        <Input
          id="slug"
          name="slug"
          label="Dirección en la web"
          required
          placeholder="masterclass-abierta"
          value={slugField.slug}
          error={state.fields?.slug}
          wrapperClassName="sm:col-span-2"
          onChange={slugField.onSlugChange}
        />

        <Select
          id="type"
          name="type"
          label="Tipo de evento"
          required
          placeholder="Selecciona un tipo"
          options={EVENT_TYPES}
          defaultValue={v.type ?? event?.type ?? ""}
          error={state.fields?.type}
        />

        <Select
          id="modality"
          name="modality"
          label="Modalidad"
          required
          placeholder="Selecciona una modalidad"
          options={EVENT_MODALITIES}
          defaultValue={v.modality ?? event?.modality ?? ""}
          error={state.fields?.modality}
        />

        <Input
          id="date"
          name="date"
          label="Fecha"
          type="date"
          required
          defaultValue={v.date ?? event?.date}
          error={state.fields?.date}
        />

        <Input
          id="time"
          name="time"
          label="Hora de inicio"
          type="time"
          required
          defaultValue={v.time ?? event?.time}
          error={state.fields?.time}
        />

        <Input
          id="location"
          name="location"
          label="Lugar o plataforma"
          optional
          placeholder="Campus UGB San Miguel / Microsoft Teams"
          defaultValue={v.location ?? event?.location}
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
          defaultValue={v.price ?? event?.price}
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
          defaultValue={v.capacity ?? event?.capacity}
          error={state.fields?.capacity}
        />

        <Input
          id="registrationUrl"
          name="registrationUrl"
          label="Enlace de inscripción"
          type="url"
          optional
          placeholder="https://..."
          defaultValue={v.registrationUrl ?? event?.registrationUrl}
          error={state.fields?.registrationUrl}
          wrapperClassName="sm:col-span-2"
        />

        <Select
          id="status"
          name="status"
          label="Estado"
          required
          placeholder="Selecciona un estado"
          options={EVENT_STATUSES.map((status) => EVENT_STATUS_LABELS[status])}
          values={EVENT_STATUSES}
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
          defaultValue={v.description ?? event?.description}
          error={state.fields?.description}
          wrapperClassName="sm:col-span-2"
        />

        <ImageUpload label="Imagen del evento" defaultValue={v.image ?? event?.image} error={state.fields?.image} />

        <Input
          id="imageAlt"
          name="imageAlt"
          label="Descripción de la imagen"
          required
          placeholder="Personas participando en una conferencia de la UGB"
          defaultValue={v.imageAlt ?? event?.imageAlt}
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

      <FormActions cancelHref="/admin/eventos">
        <SubmitButton>{event ? "Guardar cambios" : "Crear evento"}</SubmitButton>
      </FormActions>
    </form>
  );
}
