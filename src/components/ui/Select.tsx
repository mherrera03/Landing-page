import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, controlA11y, fieldControl } from "./Field";

type SelectProps = Omit<ComponentProps<"select">, "id"> & {
  id: string;
  label: string;
  error?: string;
  placeholder: string;
  options: readonly string[];
  wrapperClassName?: string;
};

export function Select({ id, label, error, required, placeholder, options, wrapperClassName, className, ...rest }: SelectProps) {
  return (
    <Field id={id} label={label} required={required} error={error} className={wrapperClassName}>
      <div className="relative">
        <select {...controlA11y(id, error)} required={required} className={cn(fieldControl, "appearance-none pr-11", className)} {...rest}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      </div>
    </Field>
  );
}
