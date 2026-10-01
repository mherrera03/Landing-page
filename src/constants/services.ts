import {
  Award,
  Blocks,
  Briefcase,
  Building2,
  Clapperboard,
  Cpu,
  GraduationCap,
  HandCoins,
  Languages,
  Laptop,
  Lightbulb,
  MonitorPlay,
  Presentation,
  Rocket,
  Settings2,
  Sparkles,
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
      { icon: Presentation, label: "Seminarios" },
      { icon: Wrench, label: "Talleres" },
      { icon: Laptop, label: "Cursos especializados" },
      { icon: Award, label: "Diplomados" },
      { icon: GraduationCap, label: "Programas de formación" },
      { icon: HandCoins, label: "Programas subvencionados" },
      { icon: Settings2, label: "Capacitación a la medida" },
      { icon: MonitorPlay, label: "Conferencias y masterclasses" },
      { icon: Sparkles, label: "Formación y actualización profesional" },
    ],
  },
  {
    title: "Áreas de formación",
    items: [
      { icon: Cpu, label: "Tecnología de la Información y la Comunicación" },
      { icon: Briefcase, label: "Negocios y Administración" },
      { icon: GraduationCap, label: "Educación y Formación Docente" },
      { icon: Languages, label: "Idiomas" },
      { icon: Clapperboard, label: "Diseño, Creatividad y Comunicación" },
      { icon: Blocks, label: "Ingeniería y áreas técnicas" },
      { icon: Users, label: "Desarrollo personal y habilidades para el empleo" },
      { icon: Building2, label: "Emprendimiento y desarrollo empresarial" },
      { icon: Rocket, label: "Muchas otras áreas según las necesidades y tendencias del entorno" },
    ],
  },
  {
    title: "Modalidad",
    items: [
      { icon: Building2, label: "Presencial" },
      { icon: Blocks, label: "Semipresencial" },
      { icon: MonitorPlay, label: "Virtual" },
      { icon: Lightbulb, label: "Formación flexible y adaptada a las necesidades del participante" },
    ],
  },
];
