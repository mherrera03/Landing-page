"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CircleAlert, Save } from "lucide-react";

import type { BannerFormState } from "@/server/actions/banners.actions";
import type { Banner } from "@/types/banner.types";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "../ui/ImageUpload";
import { Switch } from "../ui/Switch";

type BannerFormProps = {
  action: (
    prev: BannerFormState,
    formData: FormData
  ) => Promise<BannerFormState>;
  /** Banner a editar. Si no viene, se crea uno nuevo. */
  banner?: Banner;
};

export function BannerForm({ action, banner }: BannerFormProps) {
  const [state, formAction] = useActionState<BannerFormState, FormData>(
    action,
    {}
  );

  const v = state.values ?? {};

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
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.error}
        </p>
      )}

      <div className="grid gap-x-5 sm:grid-cols-2">
        <ImageUpload
          label="Imagen del banner"
          folderHint="Se recomienda horizontal y ancha."
          defaultValue={v.image ?? banner?.image ?? ""}
          error={state.fields?.image}
        />

        <Input
          id="imageAlt"
          name="imageAlt"
          label="Descripción de la imagen"
          required
          placeholder="Estudiantes en el campus de la UGB"
          defaultValue={v.imageAlt ?? banner?.imageAlt ?? ""}
          error={state.fields?.imageAlt}
          wrapperClassName="sm:col-span-2"
        />
      </div>

      <div className="mt-2 border-t border-line pt-5">
        <Switch
          name="visible"
          label="Visible en la landing"
          description="Si lo desactivas, el banner se guarda, pero no aparece públicamente."
          defaultChecked={banner ? banner.visible : true}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
        <SubmitButton isEdit={Boolean(banner)} />

        <Link
          href="/admin/banners"
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
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Agregar imagen"}
      {!pending && <Save className="size-4" aria-hidden="true" />}
    </Button>
  );
}
