import Image from "next/image";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

const DEFAULT_LOGO = "/images/nuevo-logo.svg";

type LogoProps = {
  size?: "sm" | "md";
  className?: string;
  /** Logo cargado desde Configuración. Si no viene (o está vacío), se usa el del proyecto. */
  src?: string;
  alt?: string;
};

export function Logo({ size = "md", className, src, alt }: LogoProps) {
  return (
    <Image
      src={src || DEFAULT_LOGO}
      alt={alt || SITE.name}
      width={930}
      height={240}
      preload
      className={cn("w-auto object-contain", size === "sm" ? "h-10" : "h-15", className)}
    />
  );
}
