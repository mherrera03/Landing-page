import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md";
  className?: string;
  src?: string;
  alt?: string;
};

export function Logo({ size = "md", className, src = "/images/logo.png", alt = "UGB Plus" }: LogoProps) {
  const sm = size === "sm";
  return (
    <Image
      src={src}
      alt={alt}
      width={350}
      height={100}
      priority
      className={cn("w-auto", sm ? "h-10" : "h-15", className)}
    />
  );
}
