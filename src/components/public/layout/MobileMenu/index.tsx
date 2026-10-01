"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { NAV_LINKS } from "@/constants/routes";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type MobileMenuProps = {
  id: string;
  open: boolean;
  activeId: string | null;
  onClose: () => void;
};

/** Menú desplegable para móvil y tablet. Incluye el botón de inscripción. */
export function MobileMenu({ id, open, activeId, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id={id}
          aria-label="Principal"
          className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-soft lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="container-page flex flex-col gap-1 py-4">
            <ul>
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i + 0.05, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={link.id === activeId ? "location" : undefined}
                    className={cn(
                      "flex min-h-12 items-center justify-between rounded-xl px-3 text-base font-semibold transition-colors duration-200 hover:bg-paper",
                      link.id === activeId ? "text-violet-deep" : "text-ink",
                    )}
                  >
                    {link.label}
                    <ArrowRight className="size-4 text-muted" aria-hidden="true" />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <Button href="/#contacto" variant="gradient" size="lg" className="mt-3 w-full" onClick={onClose}>
              Inscribirme
            </Button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
