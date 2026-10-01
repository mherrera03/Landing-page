export type EventKind = "masterclass" | "novedad" | "empresas";

export interface EventItem {
  id: number;
  slug: string;
  kind: EventKind;
  /** Etiqueta corta: PRÓXIMAMENTE, NUEVA EDICIÓN… */
  tag: string;
  title: string;
  description: string;
}
