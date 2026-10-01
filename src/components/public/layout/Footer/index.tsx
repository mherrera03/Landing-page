import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS } from "@/constants/routes";
import { SITE, WHATSAPP_LINES } from "@/constants/site";
import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" aria-label="UGB Plus, ir al inicio" className="inline-block rounded-lg">
            <Logo size="sm" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Formación continua de la {SITE.university}: cursos, programas y experiencias para seguir creciendo.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-sm font-bold text-ink">Explora</h2>
          <ul className="mt-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link href={link.href} className="inline-flex min-h-10 items-center text-sm text-muted transition-colors duration-200 hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold text-ink">Contacto</h2>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
          >
            <Mail className="size-4 shrink-0" aria-hidden="true" />
            {SITE.email}
          </a>

          <p className="mt-5 text-sm font-bold text-ink">WhatsApp</p>
          <ul className="mt-1">
            {WHATSAPP_LINES.map((line) => (
              <li key={line.number}>
                <a
                  href={`https://wa.me/${line.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-10 items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
                >
                  <MessageCircle className="size-4 shrink-0 text-violet-deep" aria-hidden="true" />
                  {line.label}
                  <ArrowUpRight
                    className="size-3.5 shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden="true"
                  />
                  <span className="sr-only">— escribir por WhatsApp (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-5 text-xs text-muted">
          © {new Date().getFullYear()} {SITE.name} · {SITE.university}. Sitio en etapa de prueba: los cursos, cifras y fechas son de ejemplo.
        </p>
      </div>
    </footer>
  );
}
