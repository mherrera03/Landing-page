import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gradient" | "ghost" | "outline";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap " +
  "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-out " +
  "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-[0_10px_30px_rgb(0_1_32/0.22)] hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgb(196_113_237/0.45)]",
  gradient:
    "bg-brand text-ink shadow-[0_10px_26px_rgb(196_113_237/0.3)] hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgb(196_113_237/0.45)]",
  ghost: "border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/30",
  outline:
    "border border-ink bg-white text-ink shadow-sm hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgb(196_113_237/0.45)]",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type AsButton = CommonProps &
  Omit<ComponentProps<"button">, keyof CommonProps> & {
    href?: undefined;
    /** Muestra un indicador de carga y desactiva el botón. */
    loading?: boolean;
  };

type AsLink = CommonProps & Omit<ComponentProps<typeof Link>, keyof CommonProps | "href"> & { href: string };

export type ButtonProps = AsButton | AsLink;

/** Botón de la marca. Con `href` se pinta como enlace; sin él, como <button>. */
export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    return (
      <Link {...props} className={classes}>
        {children}
      </Link>
    );
  }

  const { loading = false, type = "button", disabled, ...buttonProps } = props;

  return (
    <button {...buttonProps} type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined}>
      {loading && <Loader2 className="size-4 animate-spin-slow" aria-hidden="true" />}
      {children}
    </button>
  );
}
