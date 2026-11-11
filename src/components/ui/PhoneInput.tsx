import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Field, controlA11y, fieldControl } from "./Field";

type PhoneInputProps = Omit<ComponentProps<"input">, "id" | "type"> & {
  id: string;
  label: string;
  /** Clave del país que se muestra fija a la izquierda, por ejemplo "+503". */
  prefix: string;
  error?: string;
  wrapperClassName?: string;
};

/** Campo de teléfono con la clave del país fija; solo se escribe el número. */
export function PhoneInput({ id, label, prefix, error, required, wrapperClassName, className, ...rest }: PhoneInputProps) {
  const a11y = controlA11y(id, error);
  const prefixId = `${id}-prefix`;

  return (
    <Field id={id} label={label} required={required} error={error} className={wrapperClassName}>
      <div className="flex">
        <span
          id={prefixId}
          className="flex shrink-0 items-center rounded-l-xl border border-r-0 border-line bg-surface px-3.5 font-semibold text-ink tabular-nums"
        >
          {prefix}
        </span>
        <input
          {...a11y}
          aria-describedby={cn(prefixId, a11y["aria-describedby"])}
          type="tel"
          inputMode="numeric"
          required={required}
          className={cn(fieldControl, "rounded-l-none tabular-nums", className)}
          {...rest}
        />
      </div>
    </Field>
  );
}
