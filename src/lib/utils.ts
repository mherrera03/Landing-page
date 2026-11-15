/** Une clases condicionales: cn("a", cond && "b") -> "a b" */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** ¿El enlace sale del sitio? Las rutas internas empiezan con "/" o "#". */
export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Atributos para un enlace que puede ser interno o externo: los externos se
 * abren en otra pestaña, sin darle acceso a esta a la página de destino.
 */
export function externalLinkProps(href: string): { target?: "_blank"; rel?: "noopener noreferrer" } {
  return isExternalUrl(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
