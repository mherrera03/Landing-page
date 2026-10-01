import { Briefcase, Building2, GraduationCap, Presentation, Rocket, type LucideIcon } from "lucide-react";

export type Audience = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** Perfiles a los que se dirige la oferta de UGB Plus. */
export const AUDIENCES: Audience[] = [
  {
    icon: GraduationCap,
    title: "Estudiantes y personas en formación",
    description:
      "Personas que buscan complementar su formación académica, adquirir nuevas competencias o prepararse para nuevos retos.",
  },
  {
    icon: Presentation,
    title: "Docentes y profesionales de la educación",
    description:
      "Quienes buscan actualizar sus conocimientos, fortalecer sus competencias y responder a los nuevos desafíos educativos.",
  },
  {
    icon: Building2,
    title: "Empresas y organizaciones",
    description:
      "Instituciones que buscan desarrollar las capacidades de sus equipos y fortalecer su desempeño mediante soluciones de formación.",
  },
  {
    icon: Briefcase,
    title: "Profesionales y especialistas",
    description:
      "Personas de distintas áreas que buscan mantenerse actualizadas, especializarse y continuar desarrollándose profesionalmente.",
  },
  {
    icon: Rocket,
    title: "Emprendedores y personas que buscan nuevas oportunidades",
    description:
      "Quienes desean desarrollar habilidades para emprender, mejorar sus proyectos o ampliar sus oportunidades de crecimiento.",
  },
];
