import { BookOpen, CalendarDays, Image, Inbox, LayoutDashboard, Megaphone, Newspaper, Settings, Users, type LucideIcon } from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Las secciones pendientes se muestran atenuadas y no se puede entrar. */
  disponible: boolean;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard, disponible: true },
  { href: "/admin/cursos", label: "Cursos", icon: BookOpen, disponible: true },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, disponible: false },
  { href: "/admin/noticias", label: "Noticias", icon: Newspaper, disponible: false },
  { href: "/admin/anuncios", label: "Anuncios", icon: Megaphone, disponible: false },
  { href: "/admin/banners", label: "Banners", icon: Image, disponible: false },
  { href: "/admin/solicitudes", label: "Solicitudes", icon: Inbox, disponible: false },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, disponible: false },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, disponible: false },
];
