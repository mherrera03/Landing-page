import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gradient" | "ghost" | "light";
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
  ghost:
    "border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-ink/30",
  light:
    "bg-white text-ink hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgb(0_1_32/0.25)]",
};

const sizes: Record<Size, string> = {
  md: "min-h-11 px-5 text-sm",
  lg: "min-h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonElementProps = Omit<
  ComponentProps<"button">,
  keyof CommonProps | "type"
> & {
  href?: never;
  type?: ComponentProps<"button">["type"];
};

type LinkElementProps = Omit<
  ComponentProps<typeof Link>,
  keyof CommonProps | "href"
> & {
  href: string;
};

type ButtonProps = CommonProps & ButtonElementProps;
type LinkProps = CommonProps & LinkElementProps;

export function Button(props: ButtonProps | LinkProps) {
  const {
    variant = "primary",
    size = "md",
    loading = false,
    children,
    className,
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && typeof props.href === "string") {
    const {
      href,
      variant: _variant,
      size: _size,
      loading: _loading,
      children: _children,
      className: _className,
      ...linkProps
    } = props;

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const {
    href: _href,
    variant: _variant,
    size: _size,
    loading: _loading,
    children: _children,
    className: _className,
    type = "button",
    disabled,
    ...buttonProps
  } = props as ButtonProps;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {loading && (
        <Loader2
          className="size-4 animate-spin-slow"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
