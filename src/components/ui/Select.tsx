import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, controlA11y, fieldControl } from "./Field";

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  id: string;
  label: string;
  error?: string;
  placeholder: string;
  /** Lo que ve el usuario. */
  options: readonly string[];
  /** Lo que se envía, si difiere de la etiqueta. Mismo orden que `options`. */
  values?: readonly string[];
  /** Permite dejarlo sin elegir (el marcador de posición vale como respuesta vacía). */
  allowEmpty?: boolean;
  wrapperClassName?: string;
};

export function Select({
  id,
  label,
  error,
  required,
  placeholder,
  options,
  values,
  allowEmpty = false,
  wrapperClassName,
  className,
  ...rest
}: SelectProps) {
  return (
    <Field id={id} label={label} required={required} error={error} className={wrapperClassName}>
      <div className="relative">
        <select {...controlA11y(id, error)} required={required} className={cn(fieldControl, "appearance-none pr-11", className)} {...rest}>
          <option value="" disabled={!allowEmpty}>
            {placeholder}
          </option>
          {options.map((label, i) => (
            <option key={label} value={values?.[i] ?? label}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    </Field>
  );
}
