export const EVENT_TYPES = ["Masterclass", "Taller", "Webinar", "Conferencia"] as const;
export const EVENT_MODALITIES = ["Presencial", "Virtual", "Híbrido"] as const;
export const EVENT_STATUSES = ["abierto", "proximamente", "finalizado"] as const;

export const EVENT_STATUS_LABELS: Record<(typeof EVENT_STATUSES)[number], string> = {
  abierto: "Inscripción abierta",
  proximamente: "Próximamente",
  finalizado: "Finalizado",
};

export type EventType = (typeof EVENT_TYPES)[number];
export type EventModality = (typeof EVENT_MODALITIES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export type UgbEvent = {
  id: number;
  slug: string;
  title: string;
  type: EventType;
  modality: EventModality;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24 h)
  location?: string;
  price?: number; // undefined = gratis
  capacity?: number; // undefined = sin límite
  registrationUrl?: string;
  status: EventStatus;
  description: string;
  image: string;
  imageAlt: string;
  visible: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};