import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Enlace "volver" que encabeza las páginas de detalle (curso, evento, noticia). */
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet-deep">
      <ArrowLeft className="size-4" aria-hidden="true" />
      {children}
    </Link>
  );
}
