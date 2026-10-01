"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type SwitchProps = {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
};

/** Interruptor de encendido/apagado. Envía "on" cuando está activo, como un checkbox. */
export function Switch({ name, label, description, defaultChecked = false }: SwitchProps) {
  const id = useId();
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl p-2 transition-colors hover:bg-paper">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-deep",
          checked ? "bg-ink" : "bg-line",
        )}
      >
        <span className={cn("size-5 rounded-full bg-white shadow-sm transition-transform duration-200", checked && "translate-x-5")} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="block text-xs text-muted">{description}</span>}
      </span>
    </label>
  );
}
