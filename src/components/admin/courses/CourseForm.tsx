"use client";

import { useActionState } from "react";
import { COURSE_CATEGORIES, COURSE_CATEGORY_KEYS } from "@/constants/course-categories";
import { useSlugField } from "@/hooks/useSlugField";
import type { CourseFormState } from "@/server/actions/courses.actions";
import { COURSE_LEVELS, COURSE_MODALITIES, COURSE_STATUSES, COURSE_STATUS_LABELS, type Course } from "@/types/course.types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormActions } from "../ui/FormActions";
import { FormError } from "../ui/FormError";
import { ImageUpload } from "../ui/ImageUpload";
import { SubmitButton } from "../ui/SubmitButton";
import { Switch } from "../ui/Switch";

type CourseFormProps = {
  action: (prev: CourseFormState, formData: FormData) => Promise<CourseFormState>;
  /** Curso a editar. Si no viene, es uno nuevo. */
  course?: Course;
};

export function CourseForm({ action, course }: CourseFormProps) {
  const [state, formAction] = useActionState<CourseFormState, FormData>(action, {});
  // Tras un error, el formulario se repinta con lo que la persona había escrito
  const v = state.values ?? {};
  const slugField = useSlugField(course?.slug ?? "", Boolean(course));

  return (
    <form action={formAction} className="admin-card p-5 sm:p-7">
      <FormError className="mb-5">{state.error}</FormError>

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
          onChange={slugField.onTitleChange}
        />

        <Input
          id="slug"
          name="slug"
          label="Dirección en la web"
          required
          placeholder="fundamentos-de-inteligencia-artificial"
          value={slugField.slug}
          error={state.fields?.slug}
          wrapperClassName="sm:col-span-2"
          onChange={slugField.onSlugChange}
        />

        <Select
          id="category"
          name="category"
          label="Categoría"
          required
          placeholder="Selecciona una categoría"
          options={COURSE_CATEGORY_KEYS.map((key) => COURSE_CATEGORIES[key].label)}
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
          defaultValue={v.students ?? course?.students ?? ""}
          error={state.fields?.students}
        />

        <Select
          id="status"
          name="status"
          label="Estado"
          required
          placeholder="Selecciona un estado"
          options={COURSE_STATUSES.map((status) => COURSE_STATUS_LABELS[status])}
          values={COURSE_STATUSES}
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

        <ImageUpload label="Imagen del curso" defaultValue={v.image ?? course?.image} error={state.fields?.image} />

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

      <FormActions cancelHref="/admin/cursos">
        <SubmitButton>{course ? "Guardar cambios" : "Crear curso"}</SubmitButton>
      </FormActions>
    </form>
  );
}
