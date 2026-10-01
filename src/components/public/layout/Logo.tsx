import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md";
  /** Muestra "FORMACIÓN CONTINUA" debajo del nombre. */
  withTagline?: boolean;
  className?: string;
};

// Logo provisional construido con CSS. Reemplazar por el logo oficial
// (public/images/branding/logo) cuando esté disponible.
export function Logo({ size = "md", withTagline = false, className }: LogoProps) {
  const sm = size === "sm";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "relative shrink-0 bg-brand shadow-[0_8px_24px_rgb(196_113_237/0.25)]",
          sm ? "size-9 rounded-[11px_11px_11px_4px]" : "size-11 rounded-[14px_14px_14px_4px]",
        )}
      >
        <span className={cn("absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-white", sm ? "h-1.5 w-[18px]" : "h-[7px] w-[22px]")} />
        <span className={cn("absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-white", sm ? "h-[18px] w-1.5" : "h-[22px] w-[7px]")} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-extrabold tracking-tighter", sm ? "text-[1.35rem]" : "text-[1.65rem]")}>
          <span className="text-gradient">UGB</span>
          <span className="font-normal text-[#0794b8]">plus</span>
        </span>
        {withTagline && <span className="mt-1 text-[0.5rem] font-medium tracking-[0.3em] text-ink/70">FORMACIÓN CONTINUA</span>}
      </span>
    </span>
  );
}
