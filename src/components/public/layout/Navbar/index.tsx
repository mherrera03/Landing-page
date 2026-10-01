import Link from "next/link";
import { NAV_LINKS } from "@/constants/routes";
import { cn } from "@/lib/utils";

/** Navegación de escritorio. */
export function Navbar({ activeId }: { activeId: string | null }) {
  return (
    <nav aria-label="Principal" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {NAV_LINKS.map((link) => {
          const active = link.id === activeId;
          return (
            <li key={link.id}>
              <Link
                href={link.href}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "group relative inline-flex min-h-11 items-center px-4 text-sm font-semibold transition-colors duration-200",
                  active ? "text-ink" : "text-ink/70 hover:text-ink",
                )}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-4 bottom-1.5 left-4 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300 ease-out-expo",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
