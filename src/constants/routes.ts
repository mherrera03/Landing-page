export const ROUTES = {
  home: "/",
  thanks: "/gracias",
  api: {
    leads: "/api/leads",
  },
} as const;

/** Secciones de la landing (anclas). El id coincide con el atributo id de cada <section>. */
export const NAV_LINKS = [
  { id: "nosotros", label: "Nosotros", href: "/#nosotros" },
  { id: "servicios", label: "Servicios", href: "/#servicios" },
  { id: "programas", label: "Cursos", href: "/#programas" },
  { id: "eventos", label: "Eventos", href: "/#eventos" },
  { id: "contacto", label: "Contáctanos", href: "/#contacto" },
  
] as const;
