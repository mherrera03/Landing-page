"use client";

import type { ReactNode } from "react";
import { useIsClient } from "@/hooks/useIsClient";
import { todayInElSalvador } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { EVENT_STATUS_LABELS, type UgbEvent } from "@/types/event.types";

function Chip({ highlight = false, children }: { highlight?: boolean; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-0.5 text-sm font-semibold",
        highlight ? "bg-success/60 text-green-100" : "bg-white/15 text-white/75",
      )}
    >
      {children}
    </span>
  );
}

/** Días entre hoy y la fecha del evento. Negativo si ya pasó. */
function daysUntil(isoDate: string): number {
  const [y1, m1, d1] = isoDate.split("-").map(Number);
  const [y2, m2, d2] = todayInElSalvador().split("-").map(Number);
  return Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86_400_000);
}

/**
 * "Hoy", "Mañana" o "En 5 días".
 *
 * Se calcula solo en el navegador: depende del día de hoy, y si el servidor y
 * el navegador lo calcularan a un lado y otro de la medianoche, React avisaría
 * de una diferencia al hidratar.
 */
function Countdown({ date }: { date: string }) {
  const isClient = useIsClient();
  if (!isClient) return null;

  const dias = daysUntil(date);
  if (dias < 0) return <Chip>{EVENT_STATUS_LABELS.finalizado}</Chip>;

  return <Chip highlight>{dias === 0 ? "Hoy" : dias === 1 ? "Mañana" : `En ${dias} días`}</Chip>;
}

type EventStatusProps = {
  event: Pick<UgbEvent, "date" | "status">;
  /** El evento ya se realizó (por fecha o porque se marcó como finalizado). */
  past: boolean;
};

/** Etiqueta de estado de un evento. El estado manual manda; si sigue abierto, se muestra la cuenta atrás. */
export function EventStatus({ event, past }: EventStatusProps) {
  if (past) return <Chip>{EVENT_STATUS_LABELS.finalizado}</Chip>;
  if (event.status !== "abierto") return <Chip>{EVENT_STATUS_LABELS[event.status]}</Chip>;
  return <Countdown date={event.date} />;
}
