import type { ReactNode } from "react";
import { CircleAlert } from "lucide-react";

export const fieldControl =
  "w-full min-h-12 rounded-xl border border-line bg-paper px-4 py-3 text-base text-ink placeholder:text-muted/70 " +
  "transition-[border-color,box-shadow] duration-200 " +
  "focus:border-violet-deep focus:outline-none focus:ring-4 focus:ring-violet/20 " +
  "aria-invalid:border-danger aria-invalid:focus:ring-danger/15";

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
};

/** Envoltura común de los campos: etiqueta visible + mensaje de error debajo del campo. */
export function Field({ id, label, required, optional, error, className, children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        )}
        {optional && <span className="font-normal text-muted">(opcional)</span>}
      </label>
      {children}
      <p id={`${id}-error`} role="alert" className="mt-1.5 flex min-h-5 items-start gap-1.5 text-sm text-danger">
        {error && (
          <>
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </>
        )}
      </p>
    </div>
  );
}

/** Atributos de accesibilidad que comparten input, textarea y select. */
export function controlA11y(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  } as const;
}
