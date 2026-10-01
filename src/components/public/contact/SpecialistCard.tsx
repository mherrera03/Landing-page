import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import type { Specialist } from "@/constants/team";

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  const { name, photo, photoAlt, whatsapp, phoneLabel, email } = specialist;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-[border-color,box-shadow,translate] duration-300 ease-out-expo hover:-translate-y-1 hover:border-violet/40 hover:shadow-soft">
      <div className="relative aspect-[3/4] overflow-hidden bg-violet-soft">
        <Image
          src={photo}
          alt={photoAlt}
          fill
          sizes="(min-width: 1024px) 20rem, (min-width: 640px) 45vw, 90vw"
          className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h4 className="text-lg font-bold text-ink">{name}</h4>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl bg-ink px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-soft"
        >
          <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
          {phoneLabel}
          <span className="sr-only">— escribir a {name} por WhatsApp (se abre en una pestaña nueva)</span>
        </a>

        <a
          href={`mailto:${email}`}
          className="inline-flex min-h-11 items-center gap-2.5 rounded-xl border border-line px-4 text-sm font-medium text-muted transition-colors duration-200 hover:border-ink/30 hover:text-ink"
        >
          <Mail className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{email}</span>
        </a>
      </div>
    </article>
  );
}
