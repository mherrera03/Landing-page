"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { GlowButton } from "@/components/ui/GlowButton";
import { isHeaderPinned } from "@/lib/header-pin";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";
import { MobileMenu } from "../MobileMenu";
import { Navbar } from "../Navbar";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

/** Movimientos de scroll más cortos que esto se ignoran, para que el header no tiemble. */
const UMBRAL_PX = 6;

type HeaderProps = {
  logoImage: string;
  logoAlt: string;
  /** Botón de la derecha (y del menú móvil). Su texto y su destino se editan en Configuración. */
  contactButtonLabel: string;
  contactButtonHref: string;
};

export function Header({ logoImage, logoAlt, contactButtonLabel, contactButtonHref }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // En móvil y tablet se oculta al bajar y vuelve al subir (en escritorio siempre se ve)
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const activeId = useActiveSection(SECTION_IDS);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    let ultimoY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

      // Cerca del inicio, o mientras la página baja sola tras tocar el menú, siempre visible
      const alto = headerRef.current?.offsetHeight ?? 0;
      if (y <= alto || isHeaderPinned()) {
        setHidden(false);
        ultimoY = y;
        return;
      }

      const delta = y - ultimoY;
      if (Math.abs(delta) < UMBRAL_PX) return;
      setHidden(delta > 0); // baja: se oculta · sube: aparece
      ultimoY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el menú abierto no se oculta
  const oculto = hidden && !menuOpen;

  // Si la ventana crece a escritorio con el menú abierto, se cierra
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      ref={headerRef}
      // Quien navega con teclado y llega al header lo vuelve a ver
      onFocus={() => setHidden(false)}
      className={cn(
        "material material-bar sticky top-0 z-50 border-b bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-lg transition-[border-color,box-shadow,translate] duration-300 motion-reduce:transition-none",
        scrolled || menuOpen ? "border-ink/10 shadow-[0_8px_30px_rgb(0_1_32/0.06)]" : "border-transparent",
        // Solo bajo lg: en escritorio el header nunca se oculta. Sin sombra, para que no asome arriba
        oculto && "max-lg:-translate-y-full max-lg:border-transparent max-lg:shadow-none",
      )}
    >
      <div className="container-page flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" aria-label={`${SITE.name}, ir al inicio`} className="rounded-lg">
          <Logo src={logoImage} alt={logoAlt} />
        </Link>

        <Navbar activeId={activeId} />

        <div className="flex items-center gap-2">
          <GlowButton href={contactButtonHref} wrapperClassName="hidden lg:inline-block">
            {contactButtonLabel}
          </GlowButton>

          <button
            type="button"
            className="grid size-11 place-items-center rounded-xl text-ink transition-colors duration-100 hover:bg-ink/5 active:bg-ink/10 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <MobileMenu
        id={menuId}
        open={menuOpen}
        activeId={activeId}
        onClose={closeMenu}
        contactButtonLabel={contactButtonLabel}
        contactButtonHref={contactButtonHref}
      />
    </header>
  );
}
