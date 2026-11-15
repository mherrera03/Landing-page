"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/constants/routes";
import { SITE } from "@/constants/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";
import { Logo } from "../Logo";
import { MobileMenu } from "../MobileMenu";
import { Navbar } from "../Navbar";

const SECTION_IDS = NAV_LINKS.map((link) => link.id);

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
  const activeId = useActiveSection(SECTION_IDS);
  const menuId = useId();
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Si la ventana crece a escritorio con el menú abierto, se cierra
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-paper/85 backdrop-blur-lg transition-[border-color,box-shadow] duration-300",
        scrolled || menuOpen ? "border-ink/10 shadow-[0_8px_30px_rgb(0_1_32/0.06)]" : "border-transparent",
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
            className="grid size-11 place-items-center rounded-xl text-ink transition-colors duration-200 hover:bg-ink/5 lg:hidden"
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
