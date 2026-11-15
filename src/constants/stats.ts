import { Award, CalendarRange, GraduationCap, Users, type LucideIcon } from "lucide-react";

/** Cifras de la franja "UGB Plus en cifras". El valor de cada una sale de Configuración. */
export type StatKey = "years" | "people" | "programs" | "satisfaction";

export type Stat = {
  key: StatKey;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  label: string;
};

export const STATS: Stat[] = [
  { key: "years", icon: CalendarRange, prefix: "+", label: "años de trayectoria" },
  { key: "people", icon: Users, prefix: "+", label: "personas formadas" },
  { key: "programs", icon: GraduationCap, prefix: "+", label: "programas impartidos" },
  { key: "satisfaction", icon: Award, suffix: "%", label: "de satisfacción" },
];
