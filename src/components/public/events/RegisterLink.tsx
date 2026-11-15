import type { ReactNode } from "react";
import Link from "next/link";
import { externalLinkProps, isExternalUrl } from "@/lib/utils";
import type { UgbEvent } from "@/types/event.types";

type RegisterLinkProps = {
  event: UgbEvent;
  className: string;
  /** Lo que acompaña al texto, como una flecha. */
  children?: ReactNode;
};

/**
 * Enlace "Inscribirme" de un evento. No pinta nada si el evento no tiene enlace.
 * Los lectores de pantalla oyen además a qué evento lleva y si abre otra pestaña.
 */
export function RegisterLink({ event, className, children }: RegisterLinkProps) {
  const url = event.registrationUrl;
  if (!url) return null;

  return (
    <Link href={url} {...externalLinkProps(url)} className={className}>
      Inscribirme
      <span className="sr-only">
        {" "}
        en {event.title}
        {isExternalUrl(url) && " (se abre en una pestaña nueva)"}
      </span>
      {children}
    </Link>
  );
}
