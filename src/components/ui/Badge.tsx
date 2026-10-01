import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "soft" | "onImage" | "outline";

const variants: Record<Variant, string> = {
  soft: "bg-violet-soft text-violet-deep",
  // Fondo oscuro translúcido: legible sobre cualquier foto, clara u oscura
  onImage: "bg-ink/70 text-white backdrop-blur-md",
  outline: "border border-white/25 text-white",
};

export function Badge({ variant = "soft", className, children }: { variant?: Variant; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", variants[variant], className)}>
      {children}
    </span>
  );
}
