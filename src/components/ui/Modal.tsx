"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, type PanInfo, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Título accesible del diálogo (lo leen los lectores de pantalla). */
  title: string;
  children: ReactNode;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Lo que alcanzaría a recorrer el dedo si lo soltara con esa velocidad (decaimiento exponencial, como el scroll). */
function project(velocity: number, deceleration = 0.99) {
  return ((velocity / 1000) * deceleration) / (1 - deceleration);
}

/** Datos del cierre por gesto: la hoja sale por abajo, con la velocidad del dedo. */
type DismissInfo = { velocity: number } | null;

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 32 } },
  exit: (dismissed: DismissInfo) =>
    dismissed
      ? // Salida simétrica a la entrada (por abajo) y continuando el movimiento del dedo
        { y: "110%", transition: { type: "spring", bounce: 0, duration: 0.35, velocity: dismissed.velocity } }
      : { opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.15, ease: "easeIn" } },
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const lenis = useLenis();
  const dragControls = useDragControls();
  const [dismissed, setDismissed] = useState<DismissInfo>(null);
  // El portal necesita document.body, que solo existe en el navegador
  const mounted = useIsClient();

  // Bloquea el scroll de fondo y devuelve el foco al elemento que abrió el modal
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open, lenis]);

  // Escape cierra; Tab se queda dentro del diálogo
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /** Soltar la hoja: se cierra según hacia dónde iba, no solo según dónde quedó. */
  function onDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.y + project(info.velocity.y) > 140) {
      setDismissed({ velocity: Math.max(info.velocity.y, 0) });
      onClose();
    }
  }

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence custom={dismissed} onExitComplete={() => setDismissed(null)}>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          data-lenis-prevent
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-3xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-lift sm:rounded-3xl sm:pb-0"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            // Solo el asa arrastra (en el celular): el resto de la hoja sigue haciendo scroll con normalidad.
            // La hoja sigue al dedo 1:1 hacia abajo y se resiste (rubber band) hacia arriba.
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.08, bottom: 1 }}
            onDragEnd={onDragEnd}
            onAnimationStart={() => panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus()}
          >
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
            {/* Asa para deslizar la hoja hacia abajo y cerrarla; deja libre el botón de cerrar */}
            <div
              aria-hidden="true"
              onPointerDown={(e) => dragControls.start(e)}
              className="absolute inset-x-16 top-0 z-10 grid h-9 cursor-grab touch-none place-items-center active:cursor-grabbing sm:hidden"
            >
              <span className="h-1.5 w-10 rounded-full bg-white/90 shadow-[0_0_0_1px_rgb(0_1_32/0.25)]" />
            </div>
            <button
              type="button"
              onClick={onClose}
              data-autofocus
              aria-label="Cerrar"
              className="absolute top-4 right-4 z-10 grid size-11 place-items-center rounded-full bg-ink/70 text-white backdrop-blur-md transition-colors duration-200 hover:bg-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
