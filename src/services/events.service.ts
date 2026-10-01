import type { EventItem } from "@/types/event.types";

// TEMPORAL: datos de ejemplo hasta conectar la base de datos y el panel admin.
const EVENTS: EventItem[] = [
  {
    id: 1,
    slug: "masterclass-abierta",
    kind: "masterclass",
    tag: "Próximamente",
    title: "Masterclass abierta",
    description: "Sesiones gratuitas con especialistas para conocer de cerca nuestros programas antes de inscribirte.",
  },
  {
    id: 2,
    slug: "nuevos-programas-2026",
    kind: "novedad",
    tag: "Nueva edición",
    title: "Nuevos programas 2026",
    description: "Conoce las próximas aperturas de cohortes y las novedades de nuestra oferta académica.",
  },
  {
    id: 3,
    slug: "capacitacion-a-medida",
    kind: "empresas",
    tag: "Para empresas",
    title: "Capacitación a medida",
    description: "Diseñamos programas corporativos según las necesidades de formación de tu organización.",
  },
];

export async function getEvents(): Promise<EventItem[]> {
  return EVENTS;
}
