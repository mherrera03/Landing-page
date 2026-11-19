import {
  Award,
  Blocks,
  Briefcase,
  Building2,
  Cpu,
  GraduationCap,
  HandCoins,
  Laptop,
  Lightbulb,
  MonitorPlay,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Contenido de la sección "Nuestros servicios".
 * Para agregar o quitar una línea, edita la lista `items` del grupo correspondiente.
 * El icono se elige de https://lucide.dev/icons (impórtalo arriba).
 */
export type ServiceGroup = {
  title: string;
  items: { icon: LucideIcon; label: string }[];
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    title: "Servicios",
    items: [
      { icon: Wrench, label: "Seminarios y talleres" },
      { icon: Laptop, label: "Cursos especializados" },
      { icon: Award, label: "Diplomados" },
      { icon: HandCoins, label: "Programas de formación y subvencionados" },
      { icon: MonitorPlay, label: "Conferencias y masterclasses" },
    ],
  },
  {
    title: "Áreas de formación",
    items: [
      { icon: Cpu, label: "Tecnología e informática" },
      { icon: Briefcase, label: "Negocios y emprendimiento" },
      { icon: GraduationCap, label: "Educación e idiomas" },
      { icon: Blocks, label: "Ingeniería y áreas técnicas" },
      { icon: Users, label: "Habilidades para el empleo" },
    ],
  },
  {
    title: "Modalidad",
    items: [
      { icon: Building2, label: "Presencial" },
      { icon: Blocks, label: "Semipresencial" },
      { icon: MonitorPlay, label: "Virtual" },
      { icon: Lightbulb, label: "Horarios flexibles" },
    ],
  },
];
