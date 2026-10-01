"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Send } from "lucide-react";

import { z } from "zod";

import {
  LEAD_INTERESTS,
  leadSchema,
  type LeadField,
  type LeadInput,
} from "@/schemas/lead.schema";

import { COUNTRIES } from "@/constants/countries";

import { ROUTES } from "@/constants/routes";

import { LEAD_INTEREST_EVENT } from "../courses/CourseGrid";

import { Button } from "@/components/ui/Button";

import { Input } from "@/components/ui/Input";

import { Select } from "@/components/ui/Select";

import { Textarea } from "@/components/ui/Textarea";

type Errors = Partial<Record<LeadField, string>> & {
  form?: string;
};

// Los dos select arrancan vacíos para obligar a elegir una opción.
// El orden de las claves marca el orden del formulario (se usa al enviar).
const EMPTY = {
  name: "",
  email: "",
  country: "" as LeadInput["country"],
  phone: "",
  interest: "" as LeadInput["interest"],
  message: "",
} satisfies LeadInput;

export function ContactForm() {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<LeadInput>({
    ...EMPTY,
  });

  const [touched, setTouched] = useState<
    Partial<Record<LeadField, boolean>>
  >({});

  const [errors, setErrors] = useState<Errors>({});

  const [submitting, setSubmitting] = useState(false);

  // Cuando alguien pide información desde la ficha de un curso,
  // se precarga el mensaje
  useEffect(() => {
    const onInterest = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;

      setValues((v) => ({
        ...v,
        interest: "Cursos",
        message: `Me interesa el curso: ${title}.`,
      }));
    };

    window.addEventListener(LEAD_INTEREST_EVENT, onInterest);

    return () =>
      window.removeEventListener(LEAD_INTEREST_EVENT, onInterest);
  }, []);

  function set<K extends LeadField>(
    field: K,
    value: LeadInput[K],
  ) {
    setValues((v) => ({
      ...v,
      [field]: value,
    }));

    // Si el campo ya mostró error, se revalida mientras se corrige
    if (errors[field]) {
      validateField(field, {
        ...values,
        [field]: value,
      });
    }
  }

  function validateField(
    field: LeadField,
    source: LeadInput = values,
  ) {
    const result = leadSchema.safeParse(source);

    const message = result.success
      ? undefined
      : z.flattenError(result.error).fieldErrors[field]?.[0];

    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const result = leadSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors =
        z.flattenError(result.error).fieldErrors;

      const next: Errors = {};

      for (const key of Object.keys(
        fieldErrors,
      ) as LeadField[]) {
        next[key] = fieldErrors[key]?.[0];
      }

      setErrors(next);

      // Se marcan todos los campos del esquema:
      // así no se olvida ninguno al agregar uno nuevo
      setTouched(
        Object.fromEntries(
          (Object.keys(EMPTY) as LeadField[]).map(
            (k) => [k, true],
          ),
        ),
      );

      // Lleva el foco al primer campo con problema,
      // en el orden en que aparecen en el formulario
      const first = (
        Object.keys(EMPTY) as LeadField[]
      ).find((k) => next[k]);

      formRef.current
        ?.querySelector<HTMLElement>(
          `#lead-${first}`,
        )
        ?.focus();

      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch(ROUTES.api.leads, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error();

      router.push(ROUTES.thanks);
    } catch {
      setErrors({
        form: "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.",
      });

      setSubmitting(false);
    }
  }

  const showError = (field: LeadField) =>
    touched[field] ? errors[field] : undefined;

  const blur = (field: LeadField) => () => {
    setTouched((t) => ({
      ...t,
      [field]: true,
    }));

    validateField(field);
  };

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="rounded-3xl border border-line bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="lead-name"
          label="Nombre completo"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          value={values.name}
          error={showError("name")}
          onChange={(e) =>
            set("name", e.target.value)
          }
          onBlur={blur("name")}
        />

        <Input
          id="lead-email"
          label="Correo"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="nombre@correo.com"
          value={values.email}
          error={showError("email")}
          onChange={(e) =>
            set("email", e.target.value)
          }
          onBlur={blur("email")}
        />

        <Select
          id="lead-country"
          label="País"
          required
          placeholder="Selecciona tu país"
          options={COUNTRIES}
          autoComplete="country-name"
          value={values.country}
          error={showError("country")}
          onChange={(e) =>
            set(
              "country",
              e.target.value as LeadInput["country"],
            )
          }
          onBlur={blur("country")}
        />

        <Input
          id="lead-phone"
          label="Teléfono (con clave de país)"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="+503 7777-7777"
          value={values.phone}
          error={showError("phone")}
          onChange={(e) =>
            set("phone", e.target.value)
          }
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
          onChange={(e) =>
            set(
              "interest",
              e.target.value as LeadInput["interest"],
            )
          }
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
          onChange={(e) =>
            set("message", e.target.value)
          }
          onBlur={blur("message")}
        />
      </div>

      {errors.form && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {errors.form}
        </p>
      )}

      {/* BOTÓN ENVIAR SOLICITUD */}
      <div className="group relative inline-block w-full sm:w-auto">
        {/* 🌈 HALO MULTICOLOR */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -inset-3
            z-0
            rounded-full
            bg-[linear-gradient(110deg,#18c5e5_0%,#8b5cf6_48%,#ff5c73_100%)]
            opacity-0
            blur-[24px]
            transition-all
            duration-300
            group-hover:opacity-90
            group-hover:blur-[30px]
          "
        />

        {/* BOTÓN */}
        <Button
          type="submit"
          size="lg"
          loading={submitting}
          className="
            relative
            z-10
            w-full
            sm:w-auto
            bg-white
            text-ink
            border
            border-ink
            shadow-sm
            transition-all
            duration-300
            hover:bg-white
            hover:text-ink
          "
        >
          <span className="relative z-20 flex items-center gap-2 text-ink">
            {submitting ? "Enviando…" : "Enviar solicitud"}

            {!submitting && (
              <Send
                className="size-4"
                aria-hidden="true"
              />
            )}
          </span>
        </Button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Los campos marcados con * son obligatorios.
      </p>
    </form>
  );
}