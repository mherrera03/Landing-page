"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { CircleAlert, Save } from "lucide-react";
import { COURSE_CATEGORIES, COURSE_CATEGORY_KEYS } from "@/constants/course-categories";
import { slugify } from "@/schemas/course.schema";
import type { CourseFormState } from "@/server/actions/courses.actions";
import { COURSE_LEVELS, COURSE_MODALITIES, type Course } from "@/types/course.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "./ImageUpload";
import { Switch } from "../ui/Switch";

type CourseFormProps = {
  action: (prev: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  /** Curso a editar. Si no viene, es uno nuevo. */
  course?: Course;
};

export function CourseForm({ action, course }: CourseFormProps) {
  const [state, formAction] = useActionState<CourseFormState, FormData>(action, {});
  const v = state.values ?? {};

  // La dirección se genera desde el título hasta que el usuario la edita a mano
  const [slug, setSlug] = useState(v.slug ?? course?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(Boolean(course));

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
          label="Título del curso"
          required
          placeholder="Fundamentos de Inteligencia Artificial"
          defaultValue={v.title ?? course?.title}
          error={state.fields?.title}
          wrapperClassName="sm:col-span-2"
          onChange={(e) => !slugTocado && setSlug(slugify(e.target.value))}
        />

        <Input
          id="slug"
          name="slug"
          label="Dirección en la web"
          required
          placeholder="fundamentos-de-inteligencia-artificial"
          value={slug}
          error={state.fields?.slug}
          wrapperClassName="sm:col-span-2"
          onChange={(e) => {
            setSlugTocado(true);
            setSlug(e.target.value);
          }}
        />

        <Select
          id="category"
          name="category"
          label="Categoría"
          required
          placeholder="Selecciona una categoría"
          options={COURSE_CATEGORY_KEYS.map((k) => COURSE_CATEGORIES[k].label)}
          values={COURSE_CATEGORY_KEYS}
          defaultValue={v.category ?? course?.category ?? ""}
          error={state.fields?.category}
        />

        <Select
          id="level"
          name="level"
          label="Nivel"
          required
          placeholder="Selecciona un nivel"
          options={COURSE_LEVELS}
          defaultValue={v.level ?? course?.level ?? ""}
          error={state.fields?.level}
        />

        <Input
          id="durationHours"
          name="durationHours"
          label="Duración (horas)"
          type="number"
          required
          min={1}
          placeholder="30"
          defaultValue={v.durationHours ?? course?.durationHours}
          error={state.fields?.durationHours}
        />

        <Select
          id="modality"
          name="modality"
          label="Modalidad"
          placeholder="Sin definir"
          options={COURSE_MODALITIES}
          defaultValue={v.modality ?? course?.modality ?? ""}
          error={state.fields?.modality}
          allowEmpty
        />

        <Input
          id="students"
          name="students"
          label="Estudiantes inscritos"
          type="number"
          min={0}
          optional
          placeholder="Déjalo vacío si aún no abre"
          defaultValue={v.students ?? (course?.students ?? "")}
          error={state.fields?.students}
        />

        <Select
          id="status"
          name="status"
          label="Estado"
          required
          placeholder="Selecciona un estado"
          options={["Activo", "Próximamente"]}
          values={["activo", "proximamente"]}
          defaultValue={v.status ?? course?.status ?? "activo"}
          error={state.fields?.status}
        />

        <Textarea
          id="description"
          name="description"
          label="Descripción"
          required
          rows={3}
          placeholder="En pocas líneas, de qué trata el curso."
          defaultValue={v.description ?? course?.description}
          error={state.fields?.description}
          wrapperClassName="sm:col-span-2"
        />

        <ImageUpload defaultValue={v.image ?? course?.image} error={state.fields?.image} />

        <Input
          id="imageAlt"
          name="imageAlt"
          label="Descripción de la imagen"
          required
          placeholder="Manos escribiendo en una laptop con íconos digitales"
          defaultValue={v.imageAlt ?? course?.imageAlt}
          error={state.fields?.imageAlt}
          wrapperClassName="sm:col-span-2"
        />
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-line pt-5">
        <Switch
          name="visible"
          label="Visible en la landing"
          description="Si lo apagas, el curso se guarda pero nadie lo ve."
          defaultChecked={course ? course.visible : true}
        />
        <Switch
          name="featured"
          label="Mostrar en la portada"
          description="Aparece en la tarjeta destacada del inicio. Solo un curso puede estarlo."
          defaultChecked={course?.featured ?? false}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
        <SubmitButton isEdit={Boolean(course)} />
        <Link
          href="/admin/cursos"
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
      {pending ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear curso"}
      {!pending && <Save className="size-4" aria-hidden="true" />}
    </Button>
  );
}
