import { Award, CalendarRange, GraduationCap, Users, type LucideIcon } from "lucide-react";

export type Stat = {
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  label: string;
};

export const STATS: Stat[] = [
  { icon: CalendarRange, prefix: "+", label: "años de trayectoria" },
  { icon: Users, prefix: "+", label: "personas formadas" },
  { icon: GraduationCap, prefix: "+", label: "programas impartidos" },
  { icon: Award, suffix: "%", label: "de satisfacción" },
];
