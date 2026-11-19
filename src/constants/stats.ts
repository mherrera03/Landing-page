import { GraduationCap, Users, type LucideIcon } from "lucide-react";

/** Cifras de la franja "UGB Plus en cifras". El valor de cada una sale de Configuración. */
export type StatKey = "people" | "programs";

export type Stat = {
  key: StatKey;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Foto de fondo del bloque (opcional). */
  image?: { src: string; alt: string };
};

export const STATS: Stat[] = [
  {
    key: "people",
    icon: Users,
    prefix: "+",
    label: "personas formadas",
    image: {
      src: "/images/stats/personas-formadas.webp",
      alt: "Participantes de UGB Plus con sus diplomas en la ceremonia de graduación",
    },
  },
  {
    key: "programs",
    icon: GraduationCap,
    prefix: "+",
    label: "programas impartidos",
    image: {
      src: "/images/stats/programas-impartidos.webp",
      alt: "Participantes escuchando una ponencia en la clausura de un programa de UGB Plus",
    },
  },
];
