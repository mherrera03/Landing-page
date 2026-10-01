import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Field, controlA11y, fieldControl } from "./Field";

type InputProps = Omit<ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
};

export function Input({ id, label, error, optional, required, wrapperClassName, className, ...rest }: InputProps) {
  return (
    <Field id={id} label={label} required={required} optional={optional} error={error} className={wrapperClassName}>
      <input {...controlA11y(id, error)} required={required} className={cn(fieldControl, className)} {...rest} />
    </Field>
  );
}
