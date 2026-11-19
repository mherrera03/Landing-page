import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatAccent = "cyan" | "violet" | "coral" | "ink";

/** Color de cada tarjeta: el ícono, el resplandor y el filete inferior. */
const ACCENTS: Record<StatAccent, { icon: string; glow: string; bar: string }> = {
  cyan: { icon: "bg-[#12c2e9]/15 text-[#0779a0]", glow: "bg-[#12c2e9]/25", bar: "from-[#12c2e9] to-[#12c2e9]/0" },
  violet: { icon: "bg-violet-soft text-violet-deep", glow: "bg-[#c471ed]/25", bar: "from-[#c471ed] to-[#c471ed]/0" },
  coral: { icon: "bg-[#f64f59]/12 text-[#c2183a]", glow: "bg-[#f64f59]/20", bar: "from-[#f64f59] to-[#f64f59]/0" },
  ink: { icon: "bg-ink text-white", glow: "bg-ink/10", bar: "from-ink to-ink/0" },
};

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
  accent?: StatAccent;
};

export function StatCard({ icon: Icon, label, value, accent = "violet" }: StatCardProps) {
  const color = ACCENTS[accent];

  return (
    <div className="admin-card relative overflow-hidden p-5 transition-transform duration-300 ease-out-expo hover:-translate-y-0.5">
      <span aria-hidden="true" className={cn("absolute -top-10 -right-10 size-32 rounded-full blur-2xl", color.glow)} />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", color.icon)}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
      <p className="relative mt-4 text-4xl font-extrabold tracking-tight text-ink tabular-nums">{value}</p>
      <span aria-hidden="true" className={cn("absolute inset-x-0 bottom-0 h-1 bg-linear-to-r", color.bar)} />
    </div>
  );
}
