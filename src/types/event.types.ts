export type EventKind = "masterclass" | "novedad" | "empresas";

export const EVENT_KINDS: EventKind[] = ["masterclass", "novedad", "empresas"];

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  masterclass: "Masterclass o charla",
  novedad: "Noticia o novedad",
  empresas: "Para empresas",
};

export interface EventItem {
  id: number;
  slug: string;
  kind: EventKind;
  /** Etiqueta corta sobre el título: PRÓXIMAMENTE, NUEVA EDICIÓN… */
  tag: string;
  title: string;
  description: string;
  /** AAAA-MM-DD, o null en las noticias que no tienen día concreto. */
  date: string | null;
  /** HH:MM en 24 h, o null si no hay hora concreta. */
  time: string | null;
  /** Lugar o modalidad: "Virtual", "Campus San Miguel"… */
  place: string;
  /** Enlace de inscripción o más información. Vacío si no hay. */
  link: string;
  /** Texto del botón del enlace. */
  linkText: string;
  /** Banner promocional. Vacío si el evento no tiene imagen. */
  image: string;
  imageAlt: string;
  /** Se muestra en grande arriba del resto. Solo uno a la vez. */
  featured: boolean;
  visible: boolean;
  order: number;
  updatedAt: string;
}
