import type { Course } from "@/types/course.types";

// TEMPORAL: datos de ejemplo. Cuando exista la base de datos, estas funciones
// leerán del repositorio (src/server/database/repositories/courses.repository.ts)
// y el panel admin será quien administre los cursos.
const COURSES: Course[] = [
  {
    id: 1,
    slug: "fundamentos-de-inteligencia-artificial",
    title: "Fundamentos de Inteligencia Artificial",
    category: "tecnologia",
    description: "Introducción práctica al uso responsable de herramientas y conceptos de IA.",
    students: 98,
    level: "Básico",
    durationHours: 30,
    modality: "Híbrida",
    image: "/images/courses/fundamentos-ia.webp",
    imageAlt: "Manos escribiendo en una laptop con íconos digitales flotando",
    status: "activo",
    featured: true,
  },
  {
    id: 2,
    slug: "marketing-digital-estrategico",
    title: "Marketing Digital Estratégico",
    category: "negocios",
    description: "Diseña campañas, contenidos y métricas con enfoque en resultados.",
    students: 145,
    level: "Intermedio",
    durationHours: 25,
    modality: "Virtual",
    image: "/images/courses/marketing-digital.jpg",
    imageAlt: "Escritorio con laptop y diagramas de estrategia de marketing",
    status: "activo",
  },
  {
    id: 3,
    slug: "liderazgo-y-gestion-de-equipos",
    title: "Liderazgo y Gestión de Equipos",
    category: "habilidades",
    description: "Fortalece comunicación, liderazgo y coordinación de equipos de trabajo.",
    students: 76,
    level: "Intermedio",
    durationHours: 20,
    modality: "Presencial",
    image: "/images/courses/liderazgo-equipos.webp",
    imageAlt: "Equipo de trabajo reunido alrededor de una mesa",
    status: "activo",
  },
  {
    id: 4,
    slug: "ciberseguridad-para-organizaciones",
    title: "Ciberseguridad para Organizaciones",
    category: "tecnologia",
    description: "Buenas prácticas para reducir riesgos y proteger información institucional.",
    students: null,
    level: "Avanzado",
    durationHours: 35,
    modality: null,
    image: "/images/courses/ciberseguridad.webp",
    imageAlt: "Candado digital rodeado de íconos de servicios en línea",
    status: "proximamente",
  },
];

export async function getCourses(): Promise<Course[]> {
  return COURSES;
}

export async function getFeaturedCourse(): Promise<Course> {
  return COURSES.find((c) => c.featured) ?? COURSES[0];
}
