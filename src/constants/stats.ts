import { Award, CalendarRange, GraduationCap, Users, type LucideIcon } from "lucide-react";

export type Stat = {
  icon: LucideIcon;
  /** Número final al que sube el contador. */
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Si está presente, el valor se calcula como "año actual − este año". */
  since?: number;
};

/**
 * ⚠️ CIFRAS DE EJEMPLO: pedirle al cliente los datos reales antes de publicar.
 * La primera se calcula sola a partir del año de fundación (2016).
 */
export const STATS: Stat[] = [
  { icon: CalendarRange, value: 0, prefix: "+", label: "años de trayectoria", since: 2016 },
  { icon: Users, value: 1500, prefix: "+", label: "estudiantes formados" },
  { icon: GraduationCap, value: 60, prefix: "+", label: "programas impartidos" },
  { icon: Award, value: 98, suffix: "%", label: "de satisfacción" },
];
