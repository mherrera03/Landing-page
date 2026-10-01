"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, controlA11y, fieldControl } from "./Field";

/** Quita tildes y pasa a minúsculas: así "panama" encuentra "Panamá". */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

type ComboboxProps = {
  id: string;
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  wrapperClassName?: string;
};

/**
 * Lista desplegable con buscador, para listas largas (como los países).
 * Se maneja con el teclado: flechas para moverse, Enter para elegir y Escape para cerrar.
 */
export function Combobox({
  id,
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  error,
  wrapperClassName,
}: ComboboxProps) {
  // query null = no se está escribiendo, se muestra el valor elegido
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(() => {
    if (query === null || query === "") return options;
    const q = normalize(query);
    return options.filter((o) => normalize(o).includes(q));
  }, [options, query]);

  // Mantiene a la vista la opción resaltada al moverse con el teclado
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${highlighted}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, highlighted]);

  // Un clic fuera cierra la lista y descarta lo que se estaba escribiendo
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  function close() {
    setOpen(false);
    setQuery(null);
  }

  function openList() {
    setOpen(true);
    const current = options.indexOf(value);
    setHighlighted(current >= 0 ? current : 0);
    // Selecciona el texto para que al escribir se reemplace el país elegido
    inputRef.current?.select();
  }

  function select(option: string) {
    onChange(option);
    setOpen(false);
    setQuery(null);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      if (filtered.length === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setHighlighted((i) => (i + step + filtered.length) % filtered.length);
      return;
    }
    if (e.key === "Enter" && open) {
      e.preventDefault(); // no enviar el formulario al elegir
      if (filtered[highlighted]) select(filtered[highlighted]);
      return;
    }
    if (e.key === "Escape" && open) {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Tab" && open) close();
  }

  const activeId = open && filtered[highlighted] ? `${listboxId}-${highlighted}` : undefined;

  return (
    <Field id={id} label={label} required={required} error={error} className={wrapperClassName}>
      <div ref={rootRef} className="relative">
        <input
          {...controlA11y(id, error)}
          ref={inputRef}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          required={required}
          placeholder={placeholder}
          value={query ?? value}
          className={cn(fieldControl, "pr-11")}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => !open && openList()}
          onClick={() => !open && openList()}
          onKeyDown={onKeyDown}
          onBlur={() => {
            // El clic en una opción no llega aquí: usa pointerdown con preventDefault
            setQuery(null);
            setOpen(false);
            onBlur?.();
          }}
        />

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />

        {open && (
          <ul
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            data-lenis-prevent
            className="absolute z-50 mt-1.5 max-h-64 w-full overflow-y-auto overscroll-contain rounded-xl border border-line bg-surface py-1 shadow-lift"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-muted">No encontramos ese país.</li>
            ) : (
              filtered.map((option, i) => {
                const selected = option === value;
                return (
                  <li
                    key={option}
                    id={`${listboxId}-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={selected}
                    // pointerdown en vez de click: evita que el input pierda el foco antes de elegir
                    onPointerDown={(e) => {
                      e.preventDefault();
                      select(option);
                    }}
                    onPointerEnter={() => setHighlighted(i)}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center justify-between gap-2 px-4 text-sm",
                      i === highlighted ? "bg-violet-soft text-violet-deep" : "text-ink",
                    )}
                  >
                    {option}
                    {selected && <Check className="size-4 shrink-0" aria-hidden="true" />}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </Field>
  );
}
