import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Field, controlA11y, fieldControl } from "./Field";

type TextareaProps = Omit<ComponentProps<"textarea">, "id"> & {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  wrapperClassName?: string;
};

export function Textarea({ id, label, error, optional, required, wrapperClassName, className, ...rest }: TextareaProps) {
  return (
    <Field id={id} label={label} required={required} optional={optional} error={error} className={wrapperClassName}>
      <textarea {...controlA11y(id, error)} required={required} className={cn(fieldControl, "resize-y", className)} {...rest} />
    </Field>
  );
}
