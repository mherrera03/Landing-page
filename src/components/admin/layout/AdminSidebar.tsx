"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { ADMIN_NAV } from "@/constants/admin-nav";
import { logoutAction } from "@/server/actions/auth.actions";
import { Logo } from "@/components/public/layout/Logo";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  user: { name: string; role: string };
  /** En móvil el menú se muestra dentro de un panel desplegable. */
  onNavigate?: () => void;
};

export function AdminSidebar({ user, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 border-r border-line bg-surface p-4">
      <Link href="/admin" onClick={onNavigate} className="inline-block rounded-lg px-2 pt-2" aria-label="Ir al resumen">
        <Logo size="sm" />
      </Link>

      <nav aria-label="Secciones del panel" className="flex-1">
        <ul className="flex flex-col gap-0.5">
          {ADMIN_NAV.map(({ href, label, icon: Icon, disponible }) => {
            // "/admin" solo se marca activo en su propia página, no en las hijas
            const activo = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

            if (!disponible) {
              return (
                <li key={href}>
                  <span
                    aria-disabled="true"
                    title="Próximamente"
                    className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted/50"
                  >
                    <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                    {label}
                    <span className="ml-auto text-[0.65rem] font-semibold tracking-wide uppercase">Pronto</span>
                  </span>
                </li>
              );
            }

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors duration-200",
                    activo ? "bg-ink text-white" : "text-ink hover:bg-paper",
                  )}
                >
                  <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex flex-col gap-3 border-t border-line pt-4">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-paper hover:text-ink"
        >
          <ExternalLink className="size-4.5 shrink-0" aria-hidden="true" />
          Ver la landing
        </Link>

        <div className="rounded-xl bg-paper p-3">
          <p className="truncate text-sm font-bold text-ink">{user.name}</p>
          <p className="text-xs text-muted capitalize">{user.role}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="mt-2 flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-sm font-semibold text-danger transition-colors duration-200 hover:bg-danger/10"
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
