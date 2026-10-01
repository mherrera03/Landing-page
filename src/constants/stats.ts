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
 * Los años se calculan solos a partir del año de fundación (2016).
 * ⚠️ El % de satisfacción sigue siendo un dato de ejemplo: confirmarlo antes de publicar.
 */
export const STATS: Stat[] = [
  { icon: CalendarRange, value: 0, prefix: "+", label: "años de trayectoria", since: 2016 },
  { icon: Users, value: 4999, prefix: "+", label: "personas formadas" },
  { icon: GraduationCap, value: 99, prefix: "+", label: "programas impartidos" },
  { icon: Award, value: 98, suffix: "%", label: "de satisfacción" },
];
