"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { ADMIN_NAV } from "@/constants/admin-nav";
import { logoutAction } from "@/server/actions/auth.actions";
import { USER_ROLE_LABELS, type UserRole } from "@/types/user.types";
import { Logo } from "@/components/public/layout/Logo";
import { cn } from "@/lib/utils";

export type AdminUserSummary = { name: string; role: UserRole };

type AdminSidebarProps = {
  user: AdminUserSummary;
  siteUrl: string;
  /** En móvil el menú se muestra dentro de un panel desplegable. */
  onNavigate?: () => void;
};

/** Iniciales para el avatar: "María López" → "ML". */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function AdminSidebar({ user, siteUrl, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();
  const items = ADMIN_NAV.filter((item) => !item.soloAdmin || user.role === "admin");

  return (
    <div className="admin-sidebar flex h-full flex-col gap-7 p-4 text-white">
      <Link
        href="/admin"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-2xl px-2 pt-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Ir al resumen"
      >
        {/* Variante del logo con el texto en blanco, para el fondo oscuro del menú */}
        <Logo size="sm" src="/images/nuevo-logo-blanco.svg" className="h-10" />
        <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-white/55 uppercase">Panel</span>
      </Link>

      <nav aria-label="Secciones del panel" className="flex-1">
        <p className="mb-2 px-3 text-[0.65rem] font-semibold tracking-[0.2em] text-white/40 uppercase">Contenido</p>
        <ul className="flex flex-col gap-1">
          {items.map(({ href, label, icon: Icon }) => {
            // "/admin" solo se marca activo en su propia página, no en las hijas
            const activo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                    activo
                      ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]"
                      : "text-white/65 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {activo && (
                    <span aria-hidden="true" className="bg-brand absolute inset-y-2 -left-4 w-1 rounded-r-full" />
                  )}
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-lg transition-colors duration-200",
                      activo ? "bg-brand text-ink" : "bg-white/5 text-white/70 group-hover:text-white",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3">
        <Link
          href={siteUrl}
          target="_blank"
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-3 rounded-xl border border-white/10 px-3 text-sm font-medium text-white/75 transition-colors duration-200 hover:border-white/25 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          Ver la landing
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="bg-brand grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-ink">
              {initials(user.name)}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-white">{user.name}</span>
              <span className="block text-xs text-white/55">{USER_ROLE_LABELS[user.role]}</span>
            </span>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-3 flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm font-semibold text-[#ff8a92] transition-colors duration-200 hover:bg-[#f64f59]/15"
            >
              <LogOut className="size-4 shrink-0" aria-hidden="true" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
