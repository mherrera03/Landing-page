import type { ReactNode } from "react";
import { FlashMessage } from "../ui/FlashMessage";
import { SubmitButton } from "../ui/SubmitButton";

type SettingsCardProps = {
  /** La acción que devuelve useActionState. */
  formAction: (formData: FormData) => void;
  title: string;
  description?: string;
  /** El último guardado salió bien. */
  saved?: boolean;
  savedMessage: string;
  submitLabel: string;
  /** Los campos del formulario. */
  children: ReactNode;
};

/** Marco común de cada bloque de Configuración: título, aviso de guardado, campos y botón. */
export function SettingsCard({ formAction, title, description, saved, savedMessage, submitLabel, children }: SettingsCardProps) {
  return (
    <form action={formAction} className="max-w-3xl space-y-6 admin-card p-5 sm:p-7">
      <div>
        <h2 className="flex items-center gap-2.5 text-lg font-bold text-ink">
          <span aria-hidden="true" className="bg-brand size-2 rounded-full" />
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>

      {saved && <FlashMessage>{savedMessage}</FlashMessage>}

      {children}

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
