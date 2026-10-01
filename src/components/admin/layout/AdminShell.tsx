"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

type AdminShellProps = {
  user: { name: string; role: string };
  children: ReactNode;
};

/** Menú lateral fijo en escritorio y desplegable en móvil. */
export function AdminShell({ user, children }: AdminShellProps) {
  const [open, setOpen] = useState(false);
  // Los enlaces del menú llaman a close() al navegar (ver onNavigate)
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Escritorio */}
      <aside className="sticky top-0 hidden h-dvh lg:block">
        <AdminSidebar user={user} />
      </aside>

      {/* Móvil */}
      <header className="sticky top-0 z-40 flex min-h-16 items-center gap-3 border-b border-line bg-surface px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="grid size-11 place-items-center rounded-xl text-ink transition-colors duration-200 hover:bg-paper"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
        <span className="font-bold text-ink">Panel UGB Plus</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Cerrar menú" onClick={close} className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto shadow-lift">
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar menú"
              className="absolute top-4 right-3 z-10 grid size-10 place-items-center rounded-xl text-ink hover:bg-paper"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <AdminSidebar user={user} onNavigate={close} />
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
    </div>
  );
}
