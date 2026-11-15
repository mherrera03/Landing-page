import Image from "next/image";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/utils";

const DEFAULT_LOGO = "/images/logo.png";

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
      width={350}
      height={100}
      preload
      className={cn("w-auto", size === "sm" ? "h-10" : "h-15", className)}
    />
  );
}
