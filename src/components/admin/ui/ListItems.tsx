import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Pencil, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Piezas con las que se arman los listados del panel (cursos, eventos,
 * noticias, anuncios, usuarios): la fila, sus etiquetas y sus botones.
 */

/** Botón secundario de una fila: borde fino, misma altura que el resto de acciones. */
export const rowButton =
  "inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-[#c471ed]/40 hover:bg-violet-soft hover:text-violet-deep";

/** Fila de un listado. `dimmed` la atenúa: contenido oculto, cuenta sin acceso… */
export function ListRow({ dimmed = false, children }: { dimmed?: boolean; children: ReactNode }) {
  return (
    <li
      className={cn(
        "admin-card group/row relative flex flex-col gap-4 overflow-hidden p-4 transition-[transform,box-shadow] duration-300 ease-out-expo sm:flex-row sm:items-center",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-brand before:opacity-0 before:transition-opacity hover:-translate-y-0.5 hover:shadow-soft hover:before:opacity-100",
        dimmed && "opacity-70 saturate-50",
      )}
    >
      {children}
    </li>
  );
}

/** Miniatura a la izquierda de la fila. Es decorativa: el título va justo al lado. */
export function RowThumbnail({ src }: { src: string }) {
  return (
    <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-violet-soft ring-1 ring-ink/5 sm:h-16 sm:w-24">
      {src && <Image src={src} alt="" fill sizes="(min-width: 640px) 96px, 100vw" className="object-cover" />}
    </div>
  );
}

/** Etiqueta pequeña junto al título: "Oculto", "Portada", "Tú"… */
export function Pill({ icon: Icon, accent = false, children }: { icon?: LucideIcon; accent?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        accent ? "bg-violet-soft text-violet-deep" : "bg-paper text-muted",
      )}
    >
      {Icon && <Icon className="size-3" aria-hidden="true" />}
      {children}
    </span>
  );
}

type VisibilityToggleProps = {
  action: (formData: FormData) => Promise<void>;
  id: number;
  visible: boolean;
  /** Título del elemento, para que el botón se entienda sin ver la fila. */
  title: string;
};

/** Ocultar o mostrar sin entrar a editar. */
export function VisibilityToggle({ action, id, visible, title }: VisibilityToggleProps) {
  const Icon = visible ? Eye : EyeOff;

  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        title={visible ? "Ocultar del sitio público" : "Mostrar en el sitio público"}
        aria-label={visible ? `Ocultar ${title}` : `Mostrar ${title}`}
        className={rowButton}
      >
        <Icon className="size-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">{visible ? "Visible" : "Oculto"}</span>
      </button>
    </form>
  );
}

export function EditLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgb(0_1_32/0.18)] transition-[background-color,box-shadow] duration-200 hover:bg-ink-soft hover:shadow-[0_10px_26px_rgb(196_113_237/0.4)]"
    >
      <Pencil className="size-4" aria-hidden="true" />
      Editar <span className="sr-only">{title}</span>
    </Link>
  );
}

type EmptyStateProps = {
  title: string;
  children: ReactNode;
  /** Enlace para crear el primer elemento. */
  action?: { href: string; label: string };
};

/** Lo que se muestra cuando un listado todavía no tiene nada. */
export function EmptyState({ title, children, action }: EmptyStateProps) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-[#c471ed]/35 bg-surface/70 px-6 py-14 text-center backdrop-blur">
      <span aria-hidden="true" className="bg-brand mx-auto mb-4 block size-12 rounded-2xl opacity-90 shadow-[0_10px_30px_rgb(196_113_237/0.35)]" />
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{children}</p>
      {action && (
        <Link href={action.href} className="mt-4 inline-flex min-h-11 items-center px-3 font-bold text-violet-deep">
          {action.label}
        </Link>
      )}
    </div>
  );
}
