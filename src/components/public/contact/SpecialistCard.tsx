import { Mail, MessageCircle } from "lucide-react";
import type { Specialist } from "@/constants/team";

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const { name, whatsapp, email } = specialist;

  return (
    <article className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-surface p-5 transition-[border-color,box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-1 hover:border-violet/40 hover:shadow-soft">
      <h4 className="text-lg font-bold text-ink">{name}</h4>

      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
      >
        <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
        WhatsApp
        <span className="sr-only">— escribir a {name} (se abre en una pestaña nueva)</span>
      </a>

      <a
        href={`mailto:${email}`}
        className="inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-line px-4 text-sm font-medium text-muted transition-colors duration-200 hover:border-ink/30 hover:text-ink"
      >
        <Mail className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{email}</span>
      </a>
    </article>
  );
}
