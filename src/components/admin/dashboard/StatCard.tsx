import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: number;
};

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-violet-soft text-violet-deep">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-ink tabular-nums">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
