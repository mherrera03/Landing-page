import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS } from "@/constants/routes";
import { SITE } from "@/constants/site";
import type { PublicSettings } from "@/schemas/settings.schema";
import { Logo } from "../Logo";

const linkStyle =
  "group inline-flex min-h-10 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink";

/** Flecha que aparece al pasar el cursor en los enlaces que salen del sitio. */
function ExternalArrow() {
  return (
    <ArrowUpRight
      className="size-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      aria-hidden="true"
    />
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-sm font-bold text-ink">{children}</h2>;
}

export function Footer({ settings }: { settings: PublicSettings }) {
  const phones = [settings.whatsapp1, settings.whatsapp2].filter(Boolean);
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr]">
        {/* Marca */}
        <div>
          <Link href="/" aria-label="UGB Plus, ir al inicio" className="inline-block rounded-lg">
            <Logo size="sm" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Formación continua de la {SITE.university}: cursos, programas y experiencias para seguir creciendo.
          </p>
        </div>

        {/* Navegación */}
        <nav aria-label="Pie de página">
          <ColumnTitle>Explora</ColumnTitle>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className={linkStyle}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto general */}
        <div>
          <ColumnTitle>Contacto</ColumnTitle>
          <ul>
            <li>
              <a href={`mailto:${settings.email}`} className={linkStyle}>
                <Mail className="size-4 shrink-0 text-violet-deep" aria-hidden="true" />
                  {settings.email}
              </a>
            </li>
            {phones.map((number) => (
              <li key={number}>
                <a href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                  <MessageCircle className="size-4 shrink-0 text-violet-deep" aria-hidden="true" />
                  +{number}
                  <ExternalArrow />
                  <span className="sr-only">— escribir por WhatsApp (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name} · {SITE.university}. Sitio en etapa de prueba: los cursos, cifras y fechas son
            de ejemplo.
          </p>
          <p className="shrink-0">
            Desarrollado por <span className="font-semibold text-ink">EscapeStudios</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
