import { CalendarDays, Megaphone, Building2, type LucideIcon } from "lucide-react";
import type { EventItem, EventKind } from "@/types/event.types";

const ICONS: Record<EventKind, LucideIcon> = {
  masterclass: Megaphone,
  novedad: CalendarDays,
  empresas: Building2,
};

export function EventCard({ event }: { event: EventItem }) {
  const Icon = ICONS[event.kind];

  return (
    <article className="group h-full rounded-3xl border border-white/12 bg-white/[0.06] p-6 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.1]">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <p className="text-xs font-bold tracking-[0.14em] text-violet uppercase">{event.tag}</p>
      </div>
      <h3 className="mt-4 text-xl font-bold text-white">{event.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{event.description}</p>
    </article>
  );
}
