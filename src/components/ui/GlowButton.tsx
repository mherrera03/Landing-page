import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./Button";

type GlowButtonProps = ButtonProps & {
  /** Clases del contenedor: aquí va lo que decide dónde y cuándo se muestra (hidden, w-full…). */
  wrapperClassName?: string;
};

/**
 * Botón claro con un halo multicolor que aparece al pasar el cursor.
 * Se reserva para la llamada a la acción principal de la landing.
 */
export function GlowButton({ wrapperClassName, className, ...props }: GlowButtonProps) {
  return (
    <span className={cn("group/glow relative", wrapperClassName)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 z-0 rounded-full bg-[linear-gradient(110deg,#18c5e5_0%,#8b5cf6_48%,#ff5c73_100%)] opacity-0 blur-[24px] transition-all duration-300 group-hover/glow:opacity-90 group-hover/glow:blur-[30px]"
      />
      <Button variant="outline" {...props} className={cn("z-10", className)} />
    </span>
  );
}
