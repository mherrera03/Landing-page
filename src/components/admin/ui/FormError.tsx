import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Error general de un formulario (el que no pertenece a un campo concreto). No pinta nada si no hay error. */
export function FormError({ children, className }: { children?: string; className?: string }) {
  if (!children) return null;

  return (
    <p role="alert" className={cn("flex items-start gap-2 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger", className)}>
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
