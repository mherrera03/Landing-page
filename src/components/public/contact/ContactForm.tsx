"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Send, X } from "lucide-react";
import { z } from "zod";
import { COUNTRIES } from "@/constants/countries";
import { DEFAULT_COUNTRY, type Country } from "@/constants/country-phone";
import { ROUTES } from "@/constants/routes";
import { onLeadInterest } from "@/lib/lead-interest";
import { dialCode, examplePhone, formatNational, readPhoneInput, toInternational } from "@/lib/phone";
import { LEAD_INTERESTS, leadSchema, type LeadField, type LeadInput } from "@/schemas/lead.schema";
import { Combobox } from "@/components/ui/Combobox";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

type Errors = Partial<Record<LeadField, string>> & { form?: string };

// "Me interesa" arranca vacío para obligar a elegir una opción; el país arranca
// en El Salvador y de él sale la clave del teléfono.
const EMPTY = {
  name: "",
  email: "",
  country: DEFAULT_COUNTRY,
  phone: "",
  interest: "" as LeadInput["interest"],
  message: "",
} satisfies LeadInput;

/** Los campos en el orden en que aparecen en el formulario. */
const FIELDS = Object.keys(EMPTY) as LeadField[];

/** Primer mensaje de error de cada campo. */
function firstErrors(error: z.ZodError<LeadInput>): Errors {
  const fieldErrors = z.flattenError(error).fieldErrors;
  const errors: Errors = {};
  for (const field of FIELDS) errors[field] = fieldErrors[field]?.[0];
  return errors;
}

export function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<LeadInput>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  // Curso que la persona eligió en la ficha: se muestra para que sepa qué quedó precargado y pueda quitarlo
  const [topic, setTopic] = useState<string | null>(null);
  // Tras un intento fallido de envío se muestra el resumen "Revisa N campos"
  const [attempted, setAttempted] = useState(false);

  // Solo los dígitos del número nacional; values.phone guarda el número
  // completo con la clave del país ("+503 7777 7777").
  const [phoneDigits, setPhoneDigits] = useState("");
  const country: Country = values.country;

  // Cuando alguien pide información desde la ficha de un curso, se precarga el mensaje
  useEffect(
    () =>
      onLeadInterest((courseTitle) => {
        setTopic(courseTitle);
        setValues((v) => ({ ...v, interest: "Cursos", message: `Me interesa el curso: ${courseTitle}.` }));
      }),
    [],
  );

  function validateField(field: LeadField, source: LeadInput = values) {
    const result = leadSchema.safeParse(source);
    const message = result.success ? undefined : firstErrors(result.error)[field];
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function set<K extends LeadField>(field: K, value: LeadInput[K]) {
    setValues((v) => ({ ...v, [field]: value }));
    // Si el campo ya mostró error, se revalida mientras se corrige
    if (errors[field]) validateField(field, { ...values, [field]: value });
  }

  /** Deshace lo precargado desde la ficha del curso, sin tocar lo que la persona ya haya escrito. */
  function clearTopic() {
    if (topic === null) return;
    const prefilled = `Me interesa el curso: ${topic}.`;
    setValues((v) => (v.message === prefilled ? { ...v, interest: "" as LeadInput["interest"], message: "" } : v));
    setTopic(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = leadSchema.safeParse(values);

    if (!result.success) {
      const next = firstErrors(result.error);
      setErrors(next);
      // Se marcan todos los campos: así ningún error queda oculto por no haber pasado por él
      setTouched(Object.fromEntries(FIELDS.map((field) => [field, true])));
      setAttempted(true);
      // El foco va al primer campo con problema, en el orden del formulario
      const first = FIELDS.find((field) => next[field]);
      formRef.current?.querySelector<HTMLElement>(`#lead-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(ROUTES.api.leads, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error(`El servidor respondió ${res.status}`);

      router.push(ROUTES.thanks);
    } catch {
      setErrors({ form: "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo." });
      setSubmitting(false);
    }
  }

  const showError = (field: LeadField) => (touched[field] ? errors[field] : undefined);
  const pendingCount = FIELDS.filter((field) => showError(field)).length;

  const blur = (field: LeadField) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      {/* aria-live: al llegar desde la ficha de un curso, el lector de pantalla anuncia lo precargado */}
      <div aria-live="polite">
        {topic && (
          <p className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-violet-soft py-2 pr-2 pl-4 text-sm text-ink">
            <span className="min-w-0">
              <span className="text-muted">Consulta sobre: </span>
              <span className="font-semibold">{topic}</span>
            </span>
            <button
              type="button"
              onClick={clearTopic}
              className="grid size-11 shrink-0 place-items-center rounded-full text-violet-deep transition-colors duration-100 hover:bg-white active:bg-white"
              aria-label={`Quitar el curso ${topic} de la consulta`}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </p>
        )}
      </div>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="lead-name"
          label="Nombre completo"
          required
          autoComplete="name"
          autoCapitalize="words"
          autoCorrect="off"
          enterKeyHint="next"
          placeholder="Tu nombre"
          value={values.name}
          error={showError("name")}
          onChange={(e) => set("name", e.target.value)}
          onBlur={blur("name")}
        />

        <Input
          id="lead-email"
          label="Correo"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
          placeholder="nombre@correo.com"
          value={values.email}
          error={showError("email")}
          onChange={(e) => set("email", e.target.value)}
          onBlur={blur("email")}
        />

        <Combobox
          id="lead-country"
          label="País"
          required
          placeholder="Escribe o elige tu país"
          emptyText="No encontramos ese país."
          options={COUNTRIES}
          value={values.country}
          error={showError("country")}
          onChange={(option) => {
            // Las opciones salen de COUNTRIES, así que siempre es un país de la lista
            const selected = option as Country;
            set("country", selected);
            // La clave cambia con el país; el número escrito se conserva
            set("phone", toInternational(selected, phoneDigits));
          }}
          onBlur={blur("country")}
        />

        <PhoneInput
          id="lead-phone"
          label="Teléfono"
          required
          autoComplete="tel-national"
          enterKeyHint="next"
          prefix={dialCode(country)}
          placeholder={examplePhone(country)}
          value={formatNational(country, phoneDigits)}
          error={showError("phone")}
          onChange={(e) => {
            const digits = readPhoneInput(country, e.target.value, phoneDigits);
            setPhoneDigits(digits);
            set("phone", toInternational(country, digits));
          }}
          onBlur={blur("phone")}
        />

        <Select
          id="lead-interest"
          label="Me interesa"
          required
          placeholder="Selecciona una opción"
          options={LEAD_INTERESTS}
          value={values.interest}
          error={showError("interest")}
          onChange={(e) => set("interest", e.target.value as LeadInput["interest"])}
          onBlur={blur("interest")}
        />

        <Textarea
          id="lead-message"
          label="Mensaje"
          optional
          rows={4}
          placeholder="Cuéntanos qué formación buscas"
          wrapperClassName="sm:col-span-2"
          value={values.message}
          error={showError("message")}
          onChange={(e) => set("message", e.target.value)}
          onBlur={blur("message")}
        />
      </div>

      {errors.form && (
        <p role="alert" className="mb-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {errors.form}
        </p>
      )}
      {attempted && pendingCount > 0 && (
        <p role="status" className="mb-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
          {pendingCount === 1 ? "Falta corregir 1 campo, marcado en rojo." : `Faltan por corregir ${pendingCount} campos, marcados en rojo.`}
        </p>
      )}

      <GlowButton
        type="submit"
        size="lg"
        loading={submitting}
        wrapperClassName="inline-block w-full sm:w-auto"
        className="w-full sm:w-auto"
      >
        {submitting ? "Enviando…" : "Enviar solicitud"}
        {!submitting && <Send className="size-4" aria-hidden="true" />}
      </GlowButton>

      <p className="mt-3 text-[0.8125rem] text-muted">Los campos con * son obligatorios; el mensaje es opcional.</p>
    </form>
  );
}
