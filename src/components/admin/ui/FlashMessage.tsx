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

type FlashFromParamsProps = {
  /** Parámetros de la URL de la página. */
  params: Record<string, string | string[] | undefined>;
  /** Mensaje por parámetro: { creado: "Curso creado." } se muestra con ?creado=1. */
  messages: Record<string, string>;
};

/**
 * Las acciones del panel redirigen al listado con ?creado=1, ?actualizado=1 o
 * ?eliminado=1. Esto muestra el aviso que corresponda, si hay alguno.
 */
export function FlashFromParams({ params, messages }: FlashFromParamsProps) {
  const key = Object.keys(messages).find((name) => params[name] === "1");
  return key ? <FlashMessage>{messages[key]}</FlashMessage> : null;
}
