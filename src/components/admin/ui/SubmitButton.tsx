"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Save, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

type SubmitButtonProps = {
  children: ReactNode;
  /** Texto mientras se envía el formulario. */
  pendingLabel?: string;
  icon?: LucideIcon;
  className?: string;
};

/** Botón de envío de los formularios del panel: se desactiva y avisa mientras guarda. */
export function SubmitButton({ children, pendingLabel = "Guardando…", icon: Icon = Save, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" loading={pending} className={className}>
      {pending ? pendingLabel : children}
      {!pending && <Icon className="size-4" aria-hidden="true" />}
    </Button>
  );
}
