export type EventKind = "masterclass" | "novedad" | "empresas";

export interface EventItem {
  id: number;
  slug: string;
  kind: EventKind;
  /** Etiqueta corta: PRÓXIMAMENTE, NUEVA EDICIÓN… */
  tag: string;
  title: string;
  description: string;
  /** Fecha y hora de inicio del evento en formato ISO 8601. */
  startsAt?: string;
  /** URL de la imagen del evento. */
  image?: string;
  /** URL de registro al evento. */
  registrationUrl?: string;
  /** Precio del evento. */
  price?: string;
}
