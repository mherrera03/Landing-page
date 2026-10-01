"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { z } from "zod";
import { LEAD_INTERESTS, leadSchema, type LeadField, type LeadInput } from "@/schemas/lead.schema";
import { ROUTES } from "@/constants/routes";
import { LEAD_INTEREST_EVENT } from "../courses/CourseGrid";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

type Errors = Partial<Record<LeadField, string>> & { form?: string };

const EMPTY: LeadInput = { name: "", email: "", phone: "", interest: "Cursos", message: "" };

export function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<LeadInput>({ ...EMPTY, interest: "" as LeadInput["interest"] });
  const [touched, setTouched] = useState<Partial<Record<LeadField, boolean>>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  // Cuando alguien pide información desde la ficha de un curso, se precarga el mensaje
  useEffect(() => {
    const onInterest = (e: Event) => {
      const title = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, interest: "Cursos", message: `Me interesa el curso: ${title}.` }));
    };
    window.addEventListener(LEAD_INTEREST_EVENT, onInterest);
    return () => window.removeEventListener(LEAD_INTEREST_EVENT, onInterest);
  }, []);

  function set<K extends LeadField>(field: K, value: LeadInput[K]) {
    setValues((v) => ({ ...v, [field]: value }));
    // Si el campo ya mostró error, se revalida mientras se corrige
    if (errors[field]) validateField(field, { ...values, [field]: value });
  }

  function validateField(field: LeadField, source: LeadInput = values) {
    const result = leadSchema.safeParse(source);
    const message = result.success ? undefined : z.flattenError(result.error).fieldErrors[field]?.[0];
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = leadSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      const next: Errors = {};
      for (const key of Object.keys(fieldErrors) as LeadField[]) next[key] = fieldErrors[key]?.[0];
      setErrors(next);
      setTouched({ name: true, email: true, phone: true, interest: true, message: true });
      // Lleva el foco al primer campo con problema
      const first = (Object.keys(next) as LeadField[])[0];
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
      if (!res.ok) throw new Error();
      router.push(ROUTES.thanks);
    } catch {
      setErrors({ form: "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo." });
      setSubmitting(false);
    }
  }

  const showError = (field: LeadField) => (touched[field] ? errors[field] : undefined);
  const blur = (field: LeadField) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    validateField(field);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Input
          id="lead-name"
          label="Nombre completo"
          required
          autoComplete="name"
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
          placeholder="nombre@correo.com"
          value={values.email}
          error={showError("email")}
          onChange={(e) => set("email", e.target.value)}
          onBlur={blur("email")}
        />
        <Input
          id="lead-phone"
          label="Teléfono"
          type="tel"
          optional
          inputMode="tel"
          autoComplete="tel"
          placeholder="+503 0000-0000"
          value={values.phone}
          error={showError("phone")}
          onChange={(e) => set("phone", e.target.value)}
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

      <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
        {submitting ? "Enviando…" : "Enviar solicitud"}
        {!submitting && <Send className="size-4" aria-hidden="true" />}
      </Button>
      <p className="mt-3 text-xs text-muted">Los campos marcados con * son obligatorios.</p>
    </form>
  );
}
