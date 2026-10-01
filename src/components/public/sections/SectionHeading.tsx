import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "../motion/Reveal";

type SectionHeadingProps = {
  id: string;
  /** Texto pequeño sobre el título. Omítelo si solo repetiría lo que ya dice el título. */
  kicker?: string;
  title: string;
  children?: ReactNode;
  /** Para secciones con fondo oscuro. */
  onDark?: boolean;
};

export function SectionHeading({ id, kicker, title, children, onDark = false }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
      <div>
        {kicker && (
          <p className={cn("text-xs font-bold tracking-[0.18em] uppercase", onDark ? "text-violet" : "text-violet-deep")}>{kicker}</p>
        )}
        <h2
          id={id}
          className={cn(
            "text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.08] font-extrabold tracking-[-0.035em]",
            kicker && "mt-2",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h2>
      </div>
      {children && <p className={cn("max-w-xl leading-relaxed", onDark ? "text-white/75" : "text-muted")}>{children}</p>}
    </Reveal>
  );
}
