import { BookOpen, CalendarDays, Inbox, LayoutDashboard, Megaphone, Newspaper, Settings, Users, type LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Solo para el rol admin: a los editores ni siquiera se les muestra. */
  soloAdmin?: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/cursos", label: "Cursos", icon: BookOpen },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper },
  { href: "/admin/anuncios", label: "Anuncios", icon: Megaphone },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: Inbox },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, soloAdmin: true },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, soloAdmin: true },
];
