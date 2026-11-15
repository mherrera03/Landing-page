export const ROUTES = {
  thanks: "/gracias",
  events: "/eventos",
  api: {
    leads: "/api/leads",
  },
} as const;

/**
 * Enlaces del menú. La mayoría son secciones de la landing (anclas): en esos,
 * el id coincide con el atributo id de su <section> y sirve para resaltar en el
 * menú la sección que está a la vista.
 */
export const NAV_LINKS = [
  { id: "nosotros", label: "Nosotros", href: "/#nosotros" },
  { id: "servicios", label: "Servicios", href: "/#servicios" },
  { id: "programas", label: "Programas", href: "/#programas" },
  { id: "eventos", label: "Eventos", href: "/#eventos" },
  { id: "noticias", label: "Noticias", href: "/noticias" },
  { id: "contacto", label: "Contáctanos", href: "/#contacto" },
] as const;
