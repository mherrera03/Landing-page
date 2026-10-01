import { CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

/** Aviso de confirmación tras guardar, crear o eliminar. */
export function FlashMessage({ children }: { children: ReactNode }) {
  return (
    <p role="status" className="mb-5 flex items-center gap-2.5 rounded-xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
      <CheckCircle2 className="size-4.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
