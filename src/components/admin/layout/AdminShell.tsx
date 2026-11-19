"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { AdminSidebar, type AdminUserSummary } from "./AdminSidebar";

type AdminShellProps = {
  user: AdminUserSummary;
  /** URL de la landing: en producción vive en otro dominio. */
  siteUrl: string;
  children: ReactNode;
};

/** Menú lateral fijo en escritorio y desplegable en móvil. */
export function AdminShell({ user, siteUrl, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  // Los enlaces del menú llaman a close() al navegar (ver onNavigate)
  const close = useCallback(() => setOpen(false), []);

  useEscapeKey(open, close);

  // Con el menú abierto, el contenido de fondo no debe desplazarse
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="admin-canvas min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Escritorio */}
      <aside className="sticky top-0 hidden h-dvh lg:block">
        <AdminSidebar user={user} siteUrl={siteUrl} />
      </aside>

      {/* Móvil */}
      <header className="admin-sidebar sticky top-0 z-40 flex min-h-16 items-center gap-3 px-4 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-xl text-white transition-colors duration-200 hover:bg-white/10"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
        <span className="font-bold">Panel <span className="text-gradient" style={{ backgroundImage: "var(--grad)" }}>UGB Plus</span></span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Cerrar menú" onClick={close} className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto shadow-lift">
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="absolute top-4 right-3 z-10 grid size-10 place-items-center rounded-xl text-white hover:bg-white/10"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <AdminSidebar user={user} siteUrl={siteUrl} onNavigate={close} />
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
